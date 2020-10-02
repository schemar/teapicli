use crate::event::{Key, KeyEvents};
use crate::state::{State, StateMachine};
use crate::view::{BottomBar, MainView};
use std::io;
use tui::backend::Backend;
use tui::layout::{Constraint, Direction, Layout};
use tui::Terminal;

pub fn run<B: Backend>(terminal: &mut Terminal<B>) -> Result<(), io::Error> {
    // TODO: configurable?
    let timeout = 200;
    let key_events = KeyEvents::new(timeout);

    let mut state_machine = StateMachine::new();

    let bottom_bar = BottomBar::new();
    let main_view = MainView::new();

    loop {
        // TODO: replace unwrap with proper error handling
        // TODO: can be made faster on first run to make initial drawing
        // Getting a key event is blocking based on key_events' timeout
        let key = key_events.next().unwrap();

        // Make sure Control-C always breaks the loop (and therefore exits the application)
        if key == Key::Ctrl('c') {
            break;
        }

        state_machine.update(&key);
        let current_state = state_machine.get_state();

        if let Some(current_state) = current_state {
            let size = terminal.size().unwrap();
            let vertical_chunks = Layout::default()
                .direction(Direction::Vertical)
                .constraints([Constraint::Max(size.height), Constraint::Length(1)])
                .split(size);

            terminal.draw(|mut frame| {
                bottom_bar.draw(&mut frame, vertical_chunks[1]);

                match current_state {
                    State::Main => {
                        main_view.draw(&mut frame, vertical_chunks[0]);
                    }
                }
            })?;
        } else {
            // Make sure to exit if there is no view left on the state stack
            break;
        }
    }

    Ok(())
}
