import React, { FunctionComponent, useEffect, useState } from "react";
import { Box, Color } from "ink";

const StatusBarComponent: FunctionComponent<{
  message: string;
  width: number;
}> = ({ message, width }) => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    let slicedMessage = message;
    if (slicedMessage.length > width) {
      slicedMessage = slicedMessage.slice(0, width);
    }
    setContent(`${slicedMessage}${" ".repeat(width - message.length)}`);
  }, [message, width]);

  return (
    <Box height={1} width={width}>
      <Box textWrap="truncate-end">
        <Color bgBlackBright={true}>{content}</Color>
      </Box>
    </Box>
  );
};

export default StatusBarComponent;
