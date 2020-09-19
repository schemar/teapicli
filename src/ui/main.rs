use std::io;
use tui::backend::CrosstermBackend;
use tui::layout::{Constraint, Direction, Layout};
use tui::style::{Color, Style};
use tui::widgets::{Block, Borders};
use tui::Terminal;

pub struct MainView {}

impl MainView {
    pub fn draw(&self, terminal: &mut Terminal<CrosstermBackend<io::Stdout>>) -> io::Result<()> {
        terminal.draw(|terminal| {
            // TODO: error handling
            let size = terminal.size();
            let vertical_chunks = Layout::default()
                .direction(Direction::Vertical)
                .constraints([Constraint::Max(size.height), Constraint::Length(1)])
                .split(size);
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
}
