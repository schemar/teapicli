import React, { FunctionComponent } from "react";
import { Box, Color } from "ink";
import Request from "../../Collections/Request";

const RequestsComponent: FunctionComponent<{
  requests?: Request[];
}> = ({ requests }) => {
  return (
    <Box flexDirection="column" padding={1} width="50%">
      <Box>
        <Color green>Requests:</Color>
      </Box>
      {requests?.map((request) => {
        return <Box>{request.name}</Box>;
      })}
    </Box>
  );
};

export default RequestsComponent;
