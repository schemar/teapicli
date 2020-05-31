import React, { FunctionComponent } from "react";
import { Box, Color } from "ink";
import { observer } from "mobx-react-lite";
import { useStore } from "../../Store";

const CollectionComponent: FunctionComponent<{}> = () => {
  const { collectionStore } = useStore();

  return (
    <Box flexDirection="column" padding={1} width="100%">
      <Box>
        <Color green>Collection:</Color>
      </Box>
      <Box>{collectionStore.collection?.name}</Box>
    </Box>
  );
};
export default observer(CollectionComponent);
