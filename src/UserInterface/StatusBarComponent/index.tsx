import React, { FunctionComponent } from "react";
import { Box, Color } from "ink";

const StatusBarComponent: FunctionComponent<{ width: number }> = ({
  width,
}) => {
  return (
    <Box height={1} width={width}>
      <Box textWrap="truncate-end">
        <Color bgBlackBright={true}>
          :write{" ".repeat(width - ":write".length)}
        </Color>
      </Box>
    </Box>
  );
};

export default StatusBarComponent;
