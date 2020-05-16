import React, { FunctionComponent } from "react";
import { Box, Color } from "ink";

const CollectionComponent: FunctionComponent<{
  name?: string;
}> = ({ name }) => {
  return (
    <Box flexDirection="column" padding={1} width="100%">
      <Box>
        <Color green>Collection:</Color>
      </Box>
      <Box>{name}</Box>
    </Box>
  );
};
export default CollectionComponent;
