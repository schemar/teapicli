#[derive(Clone, Copy, Eq, Hash, PartialEq)]
pub enum CommandName {
    Open,
    Close,
}

pub struct Command {
    pub name: CommandName,
    pub description: String,
}
