import React, { FunctionComponent } from "react";
import { Box, Color } from "ink";
import { observer } from "mobx-react";
import { useStore } from "../../Store";

const EnvironmentsComponent: FunctionComponent<{}> = () => {
  const { collectionStore } = useStore();

  return (
    <Box flexDirection="column" padding={1} width="50%">
      <Box>
        <Color green>Environments:</Color>
      </Box>
      {collectionStore.collection?.environments?.map((environment) => {
        return (
          <Box textWrap="truncate-end">
            <Color
              blue={
                environment.name === collectionStore.selectedEnvironment?.name
              }
            >
              {environment.name}
            </Color>
          </Box>
        );
      })}
    </Box>
  );
};

export default observer(EnvironmentsComponent);
