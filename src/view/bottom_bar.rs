use tui::backend::Backend;
use tui::layout::Rect;
use tui::style::{Color, Style};
use tui::widgets::Block;
use tui::Frame;

pub struct BottomBar {}

impl BottomBar {
    pub fn new() -> BottomBar {
        BottomBar {}
    }
}

impl BottomBar {
    pub fn draw<B>(&self, frame: &mut Frame<B>, area: Rect)
    where
        B: Backend,
    {
        let bottom_bar = Block::default()
            .title("Input")
            .style(Style::default().bg(Color::Black));

        frame.render_widget(bottom_bar, area);
    }
}
