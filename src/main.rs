mod runner;
mod state;

use crossterm::{
    event::{DisableMouseCapture, EnableMouseCapture},
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use std::io::{self, Write};
use tui::backend::CrosstermBackend;

fn main() -> Result<(), io::Error> {
    // TODO: error handling
    let mut stdout = io::stdout();
    execute!(stdout, EnterAlternateScreen, EnableMouseCapture);
    enable_raw_mode();

    let backend = CrosstermBackend::new(stdout);

    runner::run(backend);

    // TODO: panic handler
    disable_raw_mode();
    let mut stdout = io::stdout();
    execute!(stdout, LeaveAlternateScreen, DisableMouseCapture);

    Ok(())
}
