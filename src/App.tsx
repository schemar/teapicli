import React from "react";
import { Box, Text, useApp, useInput } from "ink";
import useStdoutDimensions from "ink-use-stdout-dimensions";

export const App = () => {
  const { exit } = useApp();

  const [columns, rows] = useStdoutDimensions();

  useInput((input, key) => {
    if (input === "q") {
      exit();
    }
  });

  return (
    // height has to be rows - 1 as ink always adds an extra row for the
    // cursor at the end.
    <Box width={columns} height={rows - 1}>
      <Text>Here be Text: {columns} x {rows}</Text>
    </Box>
  );
};
