import React, { FunctionComponent, useEffect, useState } from "react";
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
  startTime?: [number, number];
  response?: Response;
  configuration: Configuration;
}> = ({ isLoading, startTime, response, configuration }) => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Body);
  const [passedTime, setPassedTime] = useState<string>("");
  const [bodyLines, setBodyLines] = useState<string[]>([]);

  useEffect(() => {
    let passedTimeInterval: number | undefined;
    if (isLoading) {
      passedTimeInterval = setInterval(() => {
        setPassedTime(
          `${process.hrtime(startTime)[0]}s ${Math.round(
            process.hrtime(startTime)[1] / 1000000
          )}ms`
        );
      }, 10) as any;
    }

    return () => {
      if (passedTimeInterval !== undefined) {
        clearInterval(passedTimeInterval);
      }
    };
  }, [startTime, isLoading]);

  useEffect(() => {
    if (response !== undefined) {
      setBodyLines(highlight(response.body).split("\n"));
    }
  }, [response]);

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

  return (
    <Box padding={1} flexDirection="column">
      <Box>
        <Color green>Last Response:</Color>
        <Color blue>
          {" "}
          {isLoading ? <Spinner type="dots" /> : <> </>} {passedTime}
        </Color>
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
            bodyLines.slice(0, 12).map((line) => {
              return (
                <Box paddingLeft={2} textWrap="truncate-end">
                  {line}
                </Box>
              );
            })}
          {bodyLines.length > 8 && <Box paddingLeft={2}>…</Box>}

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
