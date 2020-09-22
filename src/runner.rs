use super::state::{self, event};
use std::io;
use tui::backend::CrosstermBackend;
use tui::Terminal;

pub fn run(backend: CrosstermBackend<io::Stdout>) -> Result<(), io::Error> {
    let mut terminal = Terminal::new(backend)?;
    // TODO: configurable?
    let timeout = 200;
    let key_events = event::KeyEvents::new(timeout);

    let mut state = state::State::new();

    terminal.hide_cursor()?;

    loop {
        // TODO: replace unwrap with proper error handling
        // Getting a key event is blocking based on key_events' timeout
        let key = key_events.next().unwrap();

        // Make sure Control-C always breaks the loop (and therefore exits the application)
        if key == event::Key::Ctrl('c') {
            break;
        }

        state.update(&key, &mut terminal);

        if state.get_view().is_none() {
            // Make sure to exit if there is no view left on the state stack
            break;
        }
    }

    terminal.show_cursor()?;

    Ok(())
}
