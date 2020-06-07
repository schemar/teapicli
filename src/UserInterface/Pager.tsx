import React, { FunctionComponent, useEffect, useState } from "react";
import { Box } from "ink";
import { highlight } from "cli-highlight";
import { useStore } from "../Store";

const Pager: FunctionComponent<{
  width: number;
  height: number;
  content: string;
}> = ({ width, height, content }) => {
  const { commandsStore } = useStore();
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const highlighted = highlight(content);
    const highlightedLines = highlighted.split("\n");

    // Split wide lines into multiple lines
    const reflow: string[] = [];
    highlightedLines.forEach((line) => {
      let currentIndex = 0;
      while (currentIndex < line.length) {
        reflow.push(line.slice(currentIndex, currentIndex + width));
        currentIndex += width;
      }
    });
    setLines(reflow);
  }, [content, width]);

  const [pointer, setPointer] = useState<number>(0);
  useEffect(() => {
    const commands = {
      down: () => {
        setPointer(Math.min(lines.length - 1, pointer + 1));
      },
      up: () => {
        setPointer(Math.max(0, pointer - 1));
      },
    };
    commandsStore.registerCommands(commands);
    return () => {
      commandsStore.unregisterCommands(commands);
    };
  }, []);

  return (
    <Box width="100%" height="100%" flexDirection="column">
      {lines.slice(pointer, pointer + height).map((line) => (
        <>{line}</>
      ))}
    </Box>
  );
};

export default Pager;
