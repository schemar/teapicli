use crate::state::commands::Command;
use crate::state::event::Key;
use crate::state::View;
use tui::layout::Rect;
use tui::style::{Color, Style};
use tui::widgets::{Block, Widget};

pub struct BottomBar {}

impl BottomBar {
    pub fn new() -> BottomBar {
        BottomBar {}
    }
}

impl View for BottomBar {
    fn draw(
        &self,
        area: Rect,
    ) -> Vec<(Box<Block>, Rect)> {
        let bottom_bar = Block::default()
            .title("Input")
            .style(Style::default().bg(Color::Black));

        return vec![(Box::new(bottom_bar), area)];
    }

    fn get_command(&self, _: &Key) -> Option<&Command> {
        None
    }
}
