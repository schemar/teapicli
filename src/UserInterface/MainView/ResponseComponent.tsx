import React, { FunctionComponent } from "react";
import { Box, Color } from "ink";
import Spinner from "ink-spinner";
import HttpStatus from "http-status-codes";
import Response from "../../Response";

const ResponseComponent: FunctionComponent<{
  isLoading: boolean;
  response?: Response;
}> = ({ isLoading, response }) => {
  const bodyLines: string[] | undefined = response?.body.split("\n");

  return (
    <Box padding={1} flexDirection="column">
      <Box>
        <Color green>Last Response:</Color>
        {isLoading && (
          <Color blue>
            {' '}<Spinner type="dots" />
          </Color>
        )}
      </Box>
      {response && (
        <>
          <Box>
            <Color green>Code: </Color>
            <Box>
              <Color blue>{response.status} </Color>
              {HttpStatus.getStatusText(response.status)}
            </Box>
          </Box>
          <Box>
            <Color green>Headers:</Color>
          </Box>
          {Object.keys(response.headers).map((name) => {
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
            bodyLines.slice(0, 6).map((line) => {
              return (
                <Box paddingLeft={2} textWrap="truncate-end">
                  {line}
                </Box>
              );
            })}
          {bodyLines && bodyLines.length > 8 && <Box paddingLeft={2}>…</Box>}
        </>
      )}
    </Box>
  );
};

export default ResponseComponent;
