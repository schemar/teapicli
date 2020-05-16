import React, { FunctionComponent } from "react";
import { Box, Color } from "ink";
import HttpStatus from "http-status-codes";
import Response from "../../Response";

const ResponseComponent: FunctionComponent<{ response?: Response }> = ({
  response,
}) => {
  const bodyLines: string[] | undefined = response?.body.split("\n");

  return (
    <Box padding={1} flexDirection="column">
      <Box>
        <Color green>Last Response:</Color>
      </Box>
      <Box>
        <Color green>Code: </Color>
        {response && (
          <Box>
            <Color blue>{response.status} </Color>
            {HttpStatus.getStatusText(response.status)}
          </Box>
        )}
      </Box>
      <Box>
        <Color green>Headers:</Color>
      </Box>
      {response &&
        Object.keys(response.headers).map((name) => {
          return (
            <Box paddingLeft={2} textWrap="truncate-end">
              <Color blue>{name}: </Color>
              {response.headers[name]}
            </Box>
          );
        })}
      <Box>
        <Color green>Body:</Color>
      </Box>
      {bodyLines &&
        bodyLines.slice(0, 8).map((line) => {
          return (
            <Box paddingLeft={2} textWrap="truncate-end">
              {line}
            </Box>
          );
        })}
      {bodyLines && bodyLines.length > 8 && <Box paddingLeft={2}>…</Box>}
    </Box>
  );
};

export default ResponseComponent;
