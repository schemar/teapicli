use crate::state::commands::{Command, CommandName};
use crate::state::event::Key;
use crate::state::View;
use std::collections::HashMap;
use tui::layout::{Constraint, Direction, Layout, Rect};
use tui::widgets::{Block, Borders, Widget};

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
}

impl View for Main {
    fn draw(
        &self,
        area: Rect,
    ) -> Vec<(Box<Block>, Rect)> {
            // TODO: error handling
            let chunks = Layout::default()
                .direction(Direction::Horizontal)
                .constraints([Constraint::Percentage(20), Constraint::Percentage(80)])
                .split(area);
            let settings_block = Block::default().title("Teapicli").borders(Borders::ALL);
            let actions_block = Block::default()
                .title("Request/Response")
                .borders(Borders::ALL);
            vec![(Box::new(settings_block), chunks[0]), (Box::new(actions_block), chunks[1])]
    }

    fn get_command(&self, key: &Key) -> Option<&Command> {
        self.commands.get(key)
    }
}
