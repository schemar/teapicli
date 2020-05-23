import React, { FunctionComponent, useEffect, useState } from "react";
import { Box, Color } from "ink";
import Spinner from "ink-spinner";
import { highlight } from "cli-highlight";
import HttpStatus from "http-status-codes";
import Configuration from "../../Configuration";
import { Tab, Tabs } from "../Tabs";
import Response from "../../Response";

const ResponseComponent: FunctionComponent<{
  isLoading: boolean;
  startTime?: [number, number];
  response?: Response;
  configuration: Configuration;
}> = ({ isLoading, startTime, response, configuration }) => {
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
          <Tabs configuration={configuration}>
            <Tab name="Body">
              <Box flexDirection="column">
                {bodyLines.slice(0, 12).map((line) => {
                  return <Box textWrap="truncate-end">{line}</Box>;
                })}
              </Box>
            </Tab>
            <Tab name="Headers">
              <Box flexDirection="column">
                {Object.keys(response.headers).map((name) => {
                  return (
                    <Box textWrap="truncate-end">
                      <Color blue>{name}: </Color>
                      {response.headers[name]}
                    </Box>
                  );
                })}
              </Box>
            </Tab>
          </Tabs>
        </>
      )}
    </Box>
  );
};

export default ResponseComponent;
