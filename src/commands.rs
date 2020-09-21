use crate::event::Key;
use crate::state;
use std::collections::HashMap;

#[derive(Clone, Copy, Eq, Hash, PartialEq)]
enum CommandName {
    Open,
    Close,
}

pub struct Command {
    name: CommandName,
    key: Key,
    description: String,
}

pub struct Commands(HashMap<state::State, HashMap<CommandName, Command>>);

impl Commands {
    // TODO: keys should be configurable
    pub fn new() -> Commands {
        let mut commands = HashMap::new();

        let mut main_commands = HashMap::new();

        let open_command = Command {
            name: CommandName::Open,
            key: Key::Char('o'),
            description: "Test command to push to the stack".to_string(),
        };
        insert_command(&mut main_commands, open_command);

        let close_command = Command {
            name: CommandName::Close,
            key: Key::Char('q'),
            description: "Test command to pop from the stack".to_string(),
        };
        insert_command(&mut main_commands, close_command);

        commands.insert(state::State::Main, main_commands);

        Commands { 0: commands }
    }

    pub fn get_command(&self, state_machine: &state::Machine, key: Key) -> Option<&Command> {
        if let Some(state) = state_machine.get_state() {
            if let Some(commands) = self.0.get(state) {
                for (name, command) in commands {
                    if command.key == key {
                        return Some(command);
                    }
                }
            }
        }

        None
    }

    pub fn update_state(&self, state_machine: &mut state::Machine, command: &Command) {
        if let Some(state) = state_machine.get_state() {
            match state {
                state::State::Main => match command.name {
                    CommandName::Open => {
                        state_machine.push(state::State::Main);
                    }
                    CommandName::Close => {
                        state_machine.pop();
                    }
                },
            }
        }
    }
}

fn insert_command(map: &mut HashMap<CommandName, Command>, command: Command) {
    map.insert(command.name, command);
}
