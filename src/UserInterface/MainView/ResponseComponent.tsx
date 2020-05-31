import React, { FunctionComponent, useEffect, useState } from "react";
import { Box, Color } from "ink";
import Spinner from "ink-spinner";
import { autorun } from "mobx";
import { observer } from "mobx-react-lite";
import { highlight } from "cli-highlight";
import HttpStatus from "http-status-codes";
import { useStore } from "../../Store";
import { Tab, Tabs } from "../Tabs";

const ResponseComponent: FunctionComponent<{
  isLoading: boolean;
  startTime?: [number, number];
}> = ({ isLoading, startTime }) => {
  const { collectionStore } = useStore();
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

  useEffect(
    () =>
      autorun(() => {
        if (collectionStore.lastResponse !== undefined) {
          setBodyLines(
            highlight(collectionStore.lastResponse.body).split("\n")
          );
        }
      }),
    []
  );

  return (
    <Box padding={1} flexDirection="column">
      <Box>
        <Color green>Last Response:</Color>
        <Color blue>
          {" "}
          {isLoading ? <Spinner type="dots" /> : <> </>} {passedTime}
        </Color>
      </Box>
      {collectionStore.lastResponse && (
        <>
          <Box>
            <Color green>Code: </Color>
            <Box>
              <Color blue>{collectionStore.lastResponse.status} </Color>
              {HttpStatus.getStatusText(collectionStore.lastResponse.status)}
            </Box>
          </Box>
          <Tabs changeCommand="nextTabResponse">
            <Tab name="Body">
              <Box flexDirection="column">
                {bodyLines.slice(0, 12).map((line) => {
                  return <Box textWrap="truncate-end">{line}</Box>;
                })}
              </Box>
            </Tab>
            <Tab name="Headers">
              <Box flexDirection="column">
                {Object.keys(collectionStore.lastResponse.headers).map(
                  (name) => {
                    return (
                      <Box textWrap="truncate-end">
                        <Color blue>{name}: </Color>
                        {collectionStore.lastResponse?.headers[name]}
                      </Box>
                    );
                  }
                )}
              </Box>
            </Tab>
          </Tabs>
        </>
      )}
    </Box>
  );
};

export default observer(ResponseComponent);
