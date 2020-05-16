import React, { FunctionComponent } from "react";
import { Box } from "ink";

const CollectionComponent: FunctionComponent<{
  name?: string;
}> = ({ name }) => {
  return (
    <Box flexDirection="column" padding={1} width="100%">
      <Box>Collection:</Box>
      <Box>{name}</Box>
    </Box>
  );
};
export default CollectionComponent;
