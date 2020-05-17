import React, { FunctionComponent, useState } from "react";
import { Box, Color, useInput } from "ink";
import Spinner from "ink-spinner";
import { highlight } from "cli-highlight";
import HttpStatus from "http-status-codes";
import Configuration from "../../Configuration";
import Response from "../../Response";

enum Tab {
  Body,
  Headers,
}

const ResponseComponent: FunctionComponent<{
  isLoading: boolean;
  response?: Response;
  configuration: Configuration;
}> = ({ isLoading, response, configuration }) => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Body);

  useInput((input) => {
    if (input === configuration.get("keys.nextTab")) {
      switch (activeTab) {
        case Tab.Body:
          setActiveTab(Tab.Headers);
          break;
        case Tab.Headers:
          setActiveTab(Tab.Body);
          break;
        default:
          setActiveTab(Tab.Body);
      }
    }
  });

  const bodyLines: string[] | undefined =
    response && highlight(response.body).split("\n");

  return (
    <Box padding={1} flexDirection="column">
      <Box>
        <Color green>Last Response:</Color>
        {isLoading && (
          <Color blue>
            {" "}
            <Spinner type="dots" />
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
          <Box flexDirection="row">
            <Color gray={activeTab !== Tab.Body} green={activeTab === Tab.Body}>
              Body
            </Color>
            {" | "}
            <Color
              gray={activeTab !== Tab.Headers}
              green={activeTab === Tab.Headers}
            >
              Headers
            </Color>
          </Box>
          {activeTab === Tab.Body &&
            bodyLines &&
            bodyLines.slice(0, 6).map((line) => {
              return (
                <Box paddingLeft={2} textWrap="truncate-end">
                  {line}
                </Box>
              );
            })}
          {bodyLines && bodyLines.length > 8 && <Box paddingLeft={2}>…</Box>}

          {activeTab === Tab.Headers &&
            Object.keys(response.headers).map((name) => {
              return (
                <Box paddingLeft={2} textWrap="truncate-end">
                  <Color blue>{name}: </Color>
                  {response.headers[name]}
                </Box>
              );
            })}
        </>
      )}
    </Box>
  );
};

export default ResponseComponent;
