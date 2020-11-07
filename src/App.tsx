import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { Box, useApp, useInput } from "ink";
import useStdoutDimensions from "ink-use-stdout-dimensions";

import { store } from "./store/store";
import HomePage from "./components/HomePage";

export const App = () => {
  const { exit } = useApp();

  const [columns, rows] = useStdoutDimensions();
  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    setWidth(columns);
    // height has to be rows - 1 as ink always adds an extra row for the cursor at the end.
    setHeight(rows - 1);
  }, [columns, rows, setWidth, setHeight]);

  useInput((input) => {
    if (input === "q") {
      exit();
    }
  });

  return (
    <Provider store={store}>
      {/* Full screen space. */}
      <Box width={width} height={height}>
        {/* TODO: switch based on view state */}
        <HomePage />
      </Box>
    </Provider>
  );
};
