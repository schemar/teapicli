import React, { FunctionComponent, useEffect, useState } from "react";
import { Box, useInput } from "ink";
import { highlight } from "cli-highlight";
import Configuration from "../Configuration";

const Pager: FunctionComponent<{
  configuration: Configuration;
  width: number;
  height: number;
  content: string;
  onClose: () => void;
}> = ({ configuration, width, height, content, onClose }) => {
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
  }, [content]);

  const [pointer, setPointer] = useState<number>(0);
  useInput((input) => {
    if (input === configuration.get("keys.close")) {
      onClose();
    } else if (input === configuration.get("keys.down")) {
      setPointer(Math.min(lines.length - 1, pointer + 1));
    } else if (input === configuration.get("keys.up")) {
      setPointer(Math.max(0, pointer - 1));
    }
  });

  return (
    <Box width="100%" height="100%" flexDirection="column">
      {lines.slice(pointer, pointer + height).map((line) => (
        <>{line}</>
      ))}
    </Box>
  );
};

export default Pager;
