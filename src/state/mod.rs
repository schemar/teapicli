mod commands;

use crate::event::Key;
use commands::{Command, CommandName};
use std::collections::HashMap;

pub trait Commander {
    fn get_command(&self, key: &Key) -> Option<Command>;
}

#[derive(Clone, Copy, Eq, PartialEq, Hash)]
pub enum State {
    Main,
}

pub struct StateMachine {
    stack: Vec<State>,
    commands: HashMap<State, HashMap<Key, Command>>,
}

impl StateMachine {
    pub fn new() -> StateMachine {
        // TODO: make this configurable
        let mut commands = HashMap::new();
        let mut main_commands = HashMap::new();
        main_commands.insert(
            Key::Char('o'),
            Command {
                name: CommandName::Open,
                description: "Test command to push to the stack".to_string(),
            },
        );
        main_commands.insert(
            Key::Char('q'),
            Command {
                name: CommandName::Close,
                description: "Test command to pop from the stack".to_string(),
            },
        );
        commands.insert(State::Main, main_commands);
        StateMachine {
            stack: vec![State::Main],
            commands,
        }
    }

    pub fn update(&mut self, key: &Key) {
        if let Some(current_state) = self.get_state() {
            // TODO: error handling
            if let Some(state_commands) = self.commands.get(current_state) {
                if let Some(command) = state_commands.get(key) {
                    match command.name {
                        CommandName::Open => {
                            self.push(State::Main);
                        }
                        CommandName::Close => {
                            self.pop();
                        }
                    }
                }
            }
        }
    }

    pub fn get_state(&self) -> Option<&State> {
        if !self.stack.is_empty() {
            return Some(&self.stack[self.stack.len() - 1]);
        }

        None
    }

    fn push(&mut self, state: State) -> &mut Self {
        self.stack.push(state);
        self
    }

    fn pop(&mut self) {
        if !self.stack.is_empty() {
            self.stack.truncate(self.stack.len() - 1);
        }
    }
}
