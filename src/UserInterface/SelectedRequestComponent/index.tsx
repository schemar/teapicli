import React, { FunctionComponent } from "react";
import { Box, Color } from "ink";
import Request from "../../Collections/Request";

const SelectedRequestComponent: FunctionComponent<{ request?: Request }> = ({
  request,
}) => {
  return (
    <Box padding={1} flexDirection="column">
      <Box>
        <Color green>Selected Request:</Color>
      </Box>
      <Box>
        <Color green>Method: </Color>
        {request?.method}
      </Box>
      <Box>
        <Color green>URL: </Color>
        {request?.url}
      </Box>
      <Box>
        <Color green>Headers:</Color>
      </Box>
      {request &&
        Object.keys(request.headers).map((name) => {
          return (
            <Box paddingLeft={2}>
              <Color blue>{name}: </Color>
              {request.headers[name]}
            </Box>
          );
        })}
      <Box>
        <Color green>Body:</Color>
      </Box>
      {request &&
        request.body.split("\n").map((line) => {
          return (
            <Box paddingLeft={2} textWrap="truncate-end">
              {line}
            </Box>
          );
        })}
    </Box>
  );
};

export default SelectedRequestComponent;
