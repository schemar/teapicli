use crate::event::Key;
use crate::state;
use std::collections::HashMap;

#[derive(Clone, Copy, Eq, Hash, PartialEq)]
pub enum CommandName {
    Open,
    Close,
}

pub struct Command {
    name: CommandName,
    key: Key,
    description: String,
}

/// Maps states to a list of their available commands.
pub struct Commands(HashMap<state::State, Vec<Command>>);

impl Commands {
    // TODO: keys should be configurable/read from file
    pub fn new() -> Commands {
        let mut commands = HashMap::new();

        let main_commands = vec![
            Command {
                name: CommandName::Open,
                key: Key::Char('o'),
                description: "Test command to push to the stack".to_string(),
            },
            Command {
                name: CommandName::Close,
                key: Key::Char('q'),
                description: "Test command to pop from the stack".to_string(),
            },
        ];

        commands.insert(state::State::Main, main_commands);

        Commands { 0: commands }
    }

    pub fn get_commands(&self, state: state::State) -> &Vec<Command> {
        match self.0.get(&state) {
            Some(commands) => commands,
            // TODO: better handling though a view without commands should never exist
            None => panic!("nope"),
        }
    }

    pub fn get_command<'a>(&self, commands: &'a [Command], key: Key) -> Option<&'a Command> {
        for command in commands {
            if command.key == key {
                return Some(command);
            }
        }

        None
    }
}

impl Command {
    pub fn name(&self) -> &CommandName {
        &self.name
    }
}

fn insert_command(map: &mut HashMap<CommandName, Command>, command: Command) {
    map.insert(command.name, command);
}
