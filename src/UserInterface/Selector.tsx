import React, { FunctionComponent, useState } from "react";
import { Box, Color, useInput } from "ink";
import { highlight } from "cli-highlight";
import Configuration from "../Configuration";

const Selector: FunctionComponent<{
  configuration: Configuration;
  height: number;
  items: { name: string }[];
  selectedItem?: string;
  onSelect: (selection: string) => void;
  onClose: () => void;
}> = ({ configuration, height, items, selectedItem, onSelect, onClose }) => {
  let initialPointer = 0;
  if (selectedItem !== undefined) {
    items.forEach((item, index) => {
      if (item.name === selectedItem) {
        initialPointer = index;
      }
    });
  }
  const [pointer, setPointer] = useState<number>(initialPointer);

  useInput((input) => {
    if (input === configuration.get("keys.close")) {
      onClose();
    } else if (input === configuration.get("keys.down")) {
      setPointer(Math.min(items.length - 1, pointer + 1));
    } else if (input === configuration.get("keys.up")) {
      setPointer(Math.max(0, pointer - 1));
    } else if (input === configuration.get("keys.select")) {
      onSelect(items[pointer].name);
    }
  });

  return (
    <Box width="100%" height="100%" flexDirection="row">
      <Box width="30%" flexDirection="column">
        {items.map((item, index) => (
          <Box>
            <Color blue={index === pointer}>{item.name}</Color>
          </Box>
        ))}
      </Box>
      <Box flexGrow={1} flexDirection="column">
        {highlight(JSON.stringify(items[pointer], null, 2))
          .split("\n")
          .slice(0, height)
          .map((line) => (
            <Box textWrap="truncate-middle">{line}</Box>
          ))}
      </Box>
    </Box>
  );
};

export default Selector;
