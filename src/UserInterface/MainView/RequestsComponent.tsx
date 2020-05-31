import React, { FunctionComponent } from "react";
import { Box, Color } from "ink";
import { observer } from "mobx-react-lite";
import { useStore } from "../../Store";

const RequestsComponent: FunctionComponent<{}> = () => {
  const { collectionStore } = useStore();

  return (
    <Box flexDirection="column" padding={1} width="50%">
      <Box>
        <Color green>Requests:</Color>
      </Box>
      {collectionStore.collection?.requests?.map((request) => {
        return (
          <Box textWrap="truncate-end">
            <Color
              blue={request.name === collectionStore.selectedRequest?.name}
            >
              {request.name}
            </Color>
          </Box>
        );
      })}
    </Box>
  );
};

export default observer(RequestsComponent);
