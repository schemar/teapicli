import React, { FunctionComponent } from "react";
import { Box, Color } from "ink";
import Request from "../../Collections/Request";

const RequestsComponent: FunctionComponent<{
  requests?: Request[];
  selectedRequest?: Request;
}> = ({ requests, selectedRequest }) => {
  return (
    <Box flexDirection="column" padding={1} width="50%">
      <Box>
        <Color green>Requests:</Color>
      </Box>
      {requests?.map((request) => {
        if (request.name === selectedRequest?.name) {
          return (
            <Box textWrap="truncate-end">
              <Color blue>{request.name}</Color>
            </Box>
          );
        }
        return <Box textWrap="truncate-end">{request.name}</Box>;
      })}
    </Box>
  );
};

export default RequestsComponent;
