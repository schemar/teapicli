mod event;
mod state;
mod ui;

use crossterm::{
    event::{DisableMouseCapture, EnableMouseCapture},
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use std::io::{self, Write};
use tui::backend::CrosstermBackend;
use tui::Terminal;

use state::{Machine, State};

fn main() -> Result<(), io::Error> {
    let mut stdout = io::stdout();
    execute!(stdout, EnterAlternateScreen, EnableMouseCapture);
    enable_raw_mode();

    let backend = CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend)?;
    terminal.hide_cursor()?;

    let key_events = event::Events::new(10);
    let mut state_machine = Machine::new();

    let ui_main = ui::MainView {};

    loop {
        match state_machine.current_state() {
            Some(state) => match state {
                State::Main => {
                    ui_main.draw(&mut terminal)?;
                }
            },
            None => {
                break;
            }
        }

        // TODO: replace unwrap with proper error handling:
        match key_events.next().unwrap() {
            event::Event::Input(key) => {
                if key == event::Key::Ctrl('c') {
                    break;
                }

                if key == event::Key::Char('q') {
                    state_machine.pop();
                }
            }
            event::Event::Tick => {}
        }
    }

    terminal.show_cursor()?;
    disable_raw_mode();
    let mut stdout = io::stdout();
    execute!(stdout, LeaveAlternateScreen, DisableMouseCapture);

    Ok(())
}
