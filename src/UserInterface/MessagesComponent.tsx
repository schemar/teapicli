import React, { FunctionComponent } from "react";
import { observer } from "mobx-react-lite";
import { Box, Color } from "ink";
import moment from "moment";
import { useStore } from "../Store";

const MessagesComponent: FunctionComponent<{
  width: number;
  height: number;
}> = ({ width, height }) => {
  const { messagesStore } = useStore();

  return (
    <Box width={width} height={height} flexDirection="column">
      {messagesStore.messages.length === 0 ? (
        <Box>[no messages]</Box>
      ) : (
        messagesStore.messages
          .slice()
          .reverse()
          .map((message) => {
            return (
              <Box textWrap="truncate-end" width={width} height="1">
                <Color
                  red={message.type === "error"}
                  yellow={message.type === "warning"}
                >
                  [{moment(message.dateTime).format("YYYY-MM-DD HH:mm:ss")}]{" "}
                  {message.message}
                </Color>
              </Box>
            );
          })
      )}
    </Box>
  );
};

export default observer(MessagesComponent);
