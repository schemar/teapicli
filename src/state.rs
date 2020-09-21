#[derive(Clone, Copy, Eq, Hash, PartialEq)]
pub enum State {
    Main,
}

pub struct Machine {
    stack: Vec<State>,
}

impl Machine {
    pub fn new() -> Machine {
        Machine {
            stack: vec![State::Main],
        }
    }

    pub fn get_state(&self) -> Option<&State> {
        if self.stack.len() > 0 {
            return Some(&self.stack[self.stack.len() - 1]);
        }

        None
    }

    pub fn push(&mut self, state: State) -> &Machine {
        self.stack.push(state);
        self
    }

    pub fn pop(&mut self) -> Option<State> {
        if self.stack.len() > 0 {
            let current_state = self.stack[self.stack.len() - 1];
            self.stack.truncate(self.stack.len() - 1);

            return Some(current_state);
        }

        None
    }
}
