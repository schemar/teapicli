import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { autorun } from "mobx";
import { Box, Color, useInput } from "ink";
import TextInput from "ink-text-input";
import Configuration from "../Configuration";
import { useStore } from "../Store";

const StatusBarComponent: FunctionComponent<{
  width: number;
  configuration: Configuration;
}> = ({ width, configuration }) => {
  const [configCommands, setConfigCommands] = useState<{
    [key: string]: string;
  }>({});
  const [active, setActive] = useState<boolean>(false);
  const [content, setContent] = useState<React.ReactNode>(
    <Color bgBlack>{"".padEnd(width, " ")}</Color>
  );
  const [command, setCommand] = useState<string>("");
  const setContentWhite = useCallback(
    (input: string) => {
      setContent(
        <Color bgBlack white>
          {input.padEnd(width, " ")}
        </Color>
      );
    },
    [width]
  );
  const setContentStringYellow = useCallback(
    (input: string) => {
      setContent(
        <Color bgBlack yellow>
          {input.padEnd(width, " ")}
        </Color>
      );
    },
    [width]
  );
  const setContentStringRed = useCallback(
    (input: string) => {
      setContent(
        <Color bgBlack red>
          {input.padEnd(width, " ")}
        </Color>
      );
    },
    [width]
  );

  const { commandsStore, messagesStore } = useStore();

  useEffect(() => {
    setConfigCommands(configuration.get("keys"));
  }, [configuration]);

  useEffect(
    () =>
      autorun(() => {
        const message = messagesStore.lastMessage;
        if (message) {
          switch (message.type) {
            case "warning":
              setContentStringYellow(message.message);
              break;
            case "error":
              setContentStringRed(message.message);
              break;
            default:
              setContentWhite(message.message);
          }
        }
      }),
    // autorun doesn't require dependencies in useEffect.
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useInput((input: string, key) => {
    if (input === configCommands.command) {
      setActive(true);
    } else if (active && key.escape) {
      setCommand("");
      setContentWhite("");
      setActive(false);
    } else if (!active) {
      let found = false;
      Object.keys(configCommands).forEach((name) => {
        if (commandsStore.availableCommands[name] !== undefined) {
          if (configCommands[name] === input) {
            found = true;
            setContentWhite("");
            commandsStore.availableCommands[name]();
          }
        }
      });

      if (!found) {
        messagesStore.warning(`Unknown shortcut: '${input}'`);
      }
    }
  });

  const handleCommandChange = (input: string) => {
    setCommand(input);
  };

  const handleCommandSubmit = (input: string) => {
    if (commandsStore.availableCommands[input] !== undefined) {
      commandsStore.availableCommands[input]();
      setContentWhite("");
    } else {
      messagesStore.warning(`Unknown command: '${input}'`);
    }
    setCommand("");
    setActive(false);
  };

  return (
    <Box height={1} width={width}>
      {active ? (
        <Color bgBlack white>
          :
          <TextInput
            value={`${command}`}
            onChange={handleCommandChange}
            onSubmit={handleCommandSubmit}
          />
          {" ".repeat(width - command.length - 2)}
        </Color>
      ) : (
        <Box textWrap="truncate-end">{content}</Box>
      )}
    </Box>
  );
};

export default StatusBarComponent;
