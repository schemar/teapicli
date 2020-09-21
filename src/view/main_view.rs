use crate::commands::{Command, CommandName};
use crate::event::Key;
use crate::state;
use std::collections::HashMap;
use std::io;
use tui::backend::CrosstermBackend;
use tui::layout::{Constraint, Direction, Layout, Rect};
use tui::style::{Color, Style};
use tui::widgets::{Block, Borders};
use tui::Terminal;

pub struct Main {
    commands: HashMap<Key, Command>,
}

impl Main {
    pub fn new() -> Main {
        // TODO: configurable with config file?
        let mut commands = HashMap::new();
        commands.insert(
            Key::Char('o'),
            Command {
                name: CommandName::Open,
                description: "Test command to push to the stack".to_string(),
            },
        );
        commands.insert(
            Key::Char('q'),
            Command {
                name: CommandName::Close,
                description: "Test command to pop from the stack".to_string(),
            },
        );

        Main { commands }
    }

    pub fn draw(
        &self,
        terminal: &mut Terminal<CrosstermBackend<io::Stdout>>,
        area: Rect,
    ) -> io::Result<()> {
        terminal.draw(|terminal| {
            // TODO: error handling
            let vertical_chunks = Layout::default()
                .direction(Direction::Vertical)
                .constraints([Constraint::Max(area.height), Constraint::Length(1)])
                .split(area);
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
        })
    }

    pub fn execute(&self, key: &Key, state_machine: &mut state::Machine) {
        if let Some(command) = self.commands.get(key) {
            match command.name {
                CommandName::Open => {
                    state_machine.push(state::State::Main);
                }
                CommandName::Close => {
                    state_machine.pop();
                }
            }
        }
    }
}
