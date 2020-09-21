use crate::commands::{Command, CommandName};
use crate::state;
use std::io;
use tui::backend::CrosstermBackend;
use tui::layout::{Constraint, Direction, Layout, Rect};
use tui::style::{Color, Style};
use tui::widgets::{Block, Borders};
use tui::Terminal;

pub struct Main<'a> {
    commands: &'a Vec<Command>,
}

impl<'a> Main<'a> {
    pub fn new(commands: &Vec<Command>) -> Main {
        Main { commands }
    }

    pub fn commands(&self) -> &Vec<Command> {
        self.commands
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

    pub fn execute(&self, command: &Command, state_machine: &mut state::Machine) {
        match command.name() {
            CommandName::Open => {
                state_machine.push(state::State::Main);
            }
            CommandName::Close => {
                state_machine.pop();
            }
        }
    }
}
