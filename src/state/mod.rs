mod commands;
pub mod event;
mod view;

use commands::{Command, CommandName};
use event::Key;
use std::io;
use tui::backend::CrosstermBackend;
use tui::layout::{Constraint, Direction, Layout, Rect};
use tui::widgets::{Block, Widget};
use tui::Terminal;
use view::{BottomBar, Main};

pub trait View {
    fn draw(
        &self,
        area: Rect,
    ) -> Vec<(Box<Block>, Rect)>;
    fn get_command(&self, key: &Key) -> Option<&Command>;
}

pub struct State {
    stack: Vec<Box<dyn View>>,
    bottom_bar: BottomBar,
}

impl State {
    pub fn new() -> State {
        State {
            stack: vec![Box::new(Main::new())],
            bottom_bar: BottomBar::new(),
        }
    }

    pub fn update(&mut self, key: &Key, terminal: &mut Terminal<CrosstermBackend<io::Stdout>>) {
        if let Some(current_view) = self.get_view() {
            // TODO: error handling
            if let Some(command) = current_view.get_command(key) {
                match command.name {
                    CommandName::Open => {
                        self.push(Box::new(Main::new()));
                    }
                    CommandName::Close => {
                        self.pop();
                    }
                }
            }
        }

        // Another view could have been pushed or popped above
        if let Some(current_view) = self.get_view() {
            self.render(current_view, terminal);
        }
    }

    pub fn get_view(&self) -> Option<&Box<dyn View>> {
        if !self.stack.is_empty() {
            return Some(&self.stack[self.stack.len() - 1]);
        }

        None
    }

    fn push(&mut self, state: Box<dyn View>) -> &mut Self {
        self.stack.push(state);
        self
    }

    fn pop(&mut self) {
        if !self.stack.is_empty() {
            self.stack.truncate(self.stack.len() - 1);
        }
    }

    fn render(&self, current_view: &Box<dyn View>, terminal: &mut Terminal<CrosstermBackend<io::Stdout>>) {
            let size = terminal.size().unwrap();
            let vertical_chunks = Layout::default()
                .direction(Direction::Vertical)
                .constraints([Constraint::Max(size.height), Constraint::Length(1)])
                .split(size);

            let mut widgets = Vec::new();
            widgets.extend(current_view.draw(vertical_chunks[0]));
            widgets.extend(self.bottom_bar.draw(vertical_chunks[1]));

            terminal.draw(|f| {
                for widget in widgets {
                    f.render_widget(*widget.0, widget.1);
                }
            });
    }
}
