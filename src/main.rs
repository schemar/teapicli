mod commands;
mod event;
mod state;
mod view;

use crossterm::{
    event::{DisableMouseCapture, EnableMouseCapture},
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use std::io::{self, Write};
use tui::backend::CrosstermBackend;
use tui::Terminal;

fn main() -> Result<(), io::Error> {
    let mut stdout = io::stdout();
    execute!(stdout, EnterAlternateScreen, EnableMouseCapture);
    enable_raw_mode();

    let backend = CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend)?;
    terminal.hide_cursor()?;

    let timeout = 10;
    let key_events = event::Events::new(timeout);

    let mut state_machine = state::Machine::new();
    let commands = commands::Commands::new();
    let main_view = view::Main::new(commands.get_commands(state::State::Main));

    loop {
        let key;
        // TODO: replace unwrap with proper error handling
        // Getting a key event is blocking based on events' timeout
        match key_events.next().unwrap() {
            event::Event::Input(key_from_event) => {
                key = key_from_event;
            }
        }

        // Make sure Control-C always breaks the loop (and therefore exits the application)
        if key == event::Key::Ctrl('c') {
            break;
        }

        // Render view
        match state_machine.get_state() {
            Some(state) => {
                let size = terminal.size().unwrap();
                match state {
                    state::State::Main => {
                        if let Some(command) = commands.get_command(main_view.commands(), key) {
                            main_view.execute(command, &mut state_machine);
                        }
                        main_view.draw(&mut terminal, size);
                    }
                };
            }
            // Make sure to exit if there is nothing left on the state stack
            None => {
                break;
            }
        }
    }

    // TODO: panic handler
    terminal.show_cursor()?;
    disable_raw_mode();
    let mut stdout = io::stdout();
    execute!(stdout, LeaveAlternateScreen, DisableMouseCapture);

    Ok(())
}
