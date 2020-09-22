mod commands;
pub mod event;
mod view;

use commands::{Command, CommandName};
use event::Key;
use std::io;
use tui::backend::CrosstermBackend;
use tui::layout::Rect;
use tui::Terminal;
use view::Main;

pub trait View {
    fn draw(
        &self,
        terminal: &mut Terminal<CrosstermBackend<io::Stdout>>,
        area: Rect,
    ) -> io::Result<()>;
    fn get_command(&self, key: &Key) -> Option<&Command>;
}

pub struct State {
    stack: Vec<Box<dyn View>>,
}

impl State {
    pub fn new() -> State {
        State {
            stack: vec![Box::new(Main::new())],
        }
    }

    pub fn update(&mut self, key: &Key, terminal: &mut Terminal<CrosstermBackend<io::Stdout>>) {
        if let Some(current_view) = self.get_view() {
            // TODO: error handling
            if let Some(command) = current_view.get_command(key) {
                match command.name {
                    CommandName::Open => {
                        self.push(Main::new());
                    }
                    CommandName::Close => {
                        self.pop();
                    }
                }
            }
        }

        // Another view could have been pushed or popped above
        if let Some(current_view) = self.get_view() {
            let size = terminal.size().unwrap();
            current_view.draw(terminal, size);
        }
    }

    pub fn get_view(&self) -> Option<&Box<dyn View>> {
        if !self.stack.is_empty() {
            return Some(&self.stack[self.stack.len() - 1]);
        }

        None
    }

    fn push<T: View + 'static>(&mut self, state: T) -> &mut Self {
        self.stack.push(Box::new(state));
        self
    }

    fn pop(&mut self) {
        if !self.stack.is_empty() {
            self.stack.truncate(self.stack.len() - 1);
        }
    }
}
