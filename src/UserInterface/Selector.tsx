import React, { FunctionComponent, useEffect, useState } from "react";
import { Box, Color } from "ink";
import { highlight } from "cli-highlight";
import { useStore } from "../Store";

const Selector: FunctionComponent<{
  height: number;
  items: { name: string }[];
  selectedItem?: string;
  onSelect: (selection: string) => void;
}> = ({ height, items, selectedItem, onSelect }) => {
  const { commandsStore, viewsStore } = useStore();

  let initialPointer = 0;
  if (selectedItem !== undefined) {
    items.forEach((item, index) => {
      if (item.name === selectedItem) {
        initialPointer = index;
      }
    });
  }
  const [pointer, setPointer] = useState<number>(initialPointer);

  useEffect(() => {
    const commands = {
      scrollDown: () => {
        setPointer(Math.min(items.length - 1, pointer + 1));
      },
      scrollUp: () => {
        setPointer(Math.max(0, pointer - 1));
      },
      select: () => {
        onSelect(items[pointer].name);
        viewsStore.popView();
      },
    };

    commandsStore.registerCommands(commands);

    return () => {
      commandsStore.unregisterCommands(commands);
    };
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
