import React, { FunctionComponent, useEffect, useState } from "react";
import { Box, Color } from "ink";
import highlight from "cli-highlight";
import { Tab, Tabs } from "../Tabs";
import Request from "../../Collections/Request";

const SelectedRequestComponent: FunctionComponent<{
  request?: Request;
}> = ({ request }) => {
  const [bodyLines, setBodyLines] = useState<string[]>([]);

  useEffect(() => {
    if (request !== undefined) {
      setBodyLines(highlight(request.body).split("\n"));
    }
  }, [request]);

  return (
    <Box padding={1} flexDirection="column">
      <Box>
        <Color green>Selected Request: </Color>
        <Color blue>{request?.name}</Color>
      </Box>
      <Box>
        <Color green>Method: </Color>
        {request?.method}
      </Box>
      <Box>
        <Color green>URL: </Color>
        {request?.url}
      </Box>
      {request && (
        <Tabs changeCommand="nextTabRequest">
          <Tab name="Body">
            <Box flexDirection="column">
              {bodyLines.slice(0, 12).map((line) => {
                return <Box textWrap="truncate-end">{line}</Box>;
              })}
            </Box>
          </Tab>
          <Tab name="Headers">
            <Box flexDirection="column">
              {Object.keys(request.headers).map((name) => {
                return (
                  <Box textWrap="truncate-end">
                    <Color blue>{name}: </Color>
                    {request.headers[name]}
                  </Box>
                );
              })}
            </Box>
          </Tab>
        </Tabs>
      )}
    </Box>
  );
};

export default SelectedRequestComponent;
