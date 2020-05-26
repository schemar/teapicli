import React, { FunctionComponent, useEffect, useState } from "react";
import { Box, Color } from "ink";
import { autorun } from "mobx";
import { observer } from "mobx-react";
import highlight from "cli-highlight";
import { Tab, Tabs } from "../Tabs";
import { useStore } from "../../Store";

const SelectedRequestComponent: FunctionComponent<{}> = () => {
  const { collectionStore } = useStore();
  const [bodyLines, setBodyLines] = useState<string[]>([]);

  useEffect(
    () =>
      autorun(() => {
        if (collectionStore.selectedRequest !== undefined) {
          setBodyLines(
            highlight(collectionStore.selectedRequest.body).split("\n")
          );
        }
      }),
    []
  );

  return (
    <Box padding={1} flexDirection="column">
      <Box>
        <Color green>Selected Request: </Color>
        <Color blue>{collectionStore.selectedRequest?.name}</Color>
      </Box>
      <Box>
        <Color green>Method: </Color>
        {collectionStore.selectedRequest?.method}
      </Box>
      <Box>
        <Color green>URL: </Color>
        {collectionStore.selectedRequest?.url}
      </Box>
      {collectionStore.selectedRequest && (
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
              {Object.keys(collectionStore.selectedRequest.headers).map(
                (name) => {
                  return (
                    <Box textWrap="truncate-end">
                      <Color blue>{name}: </Color>
                      {collectionStore.selectedRequest?.headers[name]}
                    </Box>
                  );
                }
              )}
            </Box>
          </Tab>
        </Tabs>
      )}
    </Box>
  );
};

export default observer(SelectedRequestComponent);
