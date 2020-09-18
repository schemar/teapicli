mod event;

use crossterm::{
    event::{DisableMouseCapture, EnableMouseCapture},
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use std::io::{self, Write};
use tui::backend::CrosstermBackend;
use tui::layout::{Constraint, Direction, Layout};
use tui::style::{Color, Style};
use tui::Terminal;

use tui::widgets::{Block, Borders};

fn main() -> Result<(), io::Error> {
    let mut stdout = io::stdout();
    execute!(stdout, EnterAlternateScreen, EnableMouseCapture);
    enable_raw_mode();

    let backend = CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend)?;
    terminal.hide_cursor()?;

    let key_events = event::Events::new(10);

    loop {
        terminal.draw(|terminal| {
            let size = terminal.size();
            let vertical_chunks = Layout::default()
                .direction(Direction::Vertical)
                .constraints([Constraint::Max(size.height), Constraint::Length(1)])
                .split(size);
            let chunks = Layout::default()
                .direction(Direction::Horizontal)
                .constraints([Constraint::Percentage(20), Constraint::Percentage(80)])
                .split(vertical_chunks[0]);
            let settings_block = Block::default().title("Teapicli").borders(Borders::ALL);
            let actions_block = Block::default()
                .title("Request/Response")
                .borders(Borders::ALL);
            let input_block = Block::default()
                .title("Input")
                .style(Style::default().bg(Color::Black));
            terminal.render_widget(settings_block, chunks[0]);
            terminal.render_widget(actions_block, chunks[1]);
            terminal.render_widget(input_block, vertical_chunks[1]);
        })?;

        // TODO: replace unwrap with proper error handling:
        match key_events.next().unwrap() {
            event::Event::Input(key) => {
                if key == event::Key::Ctrl('c') || key == event::Key::Char('q') {
                    break;
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
