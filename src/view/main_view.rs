use tui::backend::Backend;
use tui::layout::{Constraint, Direction, Layout, Rect};
use tui::widgets::{Block, Borders};
use tui::Frame;

pub struct MainView {}

impl MainView {
    pub fn new() -> MainView {
        MainView {}
    }

    pub fn draw<B>(&self, frame: &mut Frame<B>, area: Rect)
    where
        B: Backend,
    {
        // TODO: error handling
        let chunks = Layout::default()
            .direction(Direction::Horizontal)
            .constraints([Constraint::Percentage(20), Constraint::Percentage(80)])
            .split(area);
        let settings_block = Block::default().title("Teapicli").borders(Borders::ALL);
        let actions_block = Block::default()
            .title("Request/Response")
            .borders(Borders::ALL);

        frame.render_widget(settings_block, chunks[0]);
        frame.render_widget(actions_block, chunks[1]);
    }
}
