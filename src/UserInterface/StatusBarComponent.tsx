import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
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
  const [content, setContentHidden] = useState<string>("".padEnd(width, " "));
  const [command, setCommand] = useState<string>("");
  const setContent = useCallback(
    (input: string) => {
      setContentHidden(input.padEnd(width, " "));
    },
    [width]
  );

  const { commandsStore } = useStore();

  useEffect(() => {
    setConfigCommands(configuration.get("keys"));
  }, [configuration]);

  useInput((input: string, key) => {
    if (input === configCommands.command) {
      setActive(true);
    } else if (active && key.escape) {
      setCommand("");
      setActive(false);
    } else if (!active) {
      let found = false;
      Object.keys(configCommands).forEach((name) => {
        if (commandsStore.availableCommands[name] !== undefined) {
          if (configCommands[name] === input) {
            found = true;
            commandsStore.availableCommands[name]();
          }
        }
      });
      if (!found) {
        setContent(`Unknown shortcut: '${input}'`);
      }
    }
  });

  const handleCommandChange = (input: string) => {
    setCommand(input);
  };

  const handleCommandSubmit = (input: string) => {
    if (commandsStore.availableCommands[input] !== undefined) {
      commandsStore.availableCommands[input]();
    } else {
      setContent(`Unknown command: '${input}'`);
    }
    setCommand("");
    setActive(false);
  };

  return (
    <Box height={1} width={width}>
      {active ? (
        <Color bgBlackBright>
          <TextInput
            value={`${command}`}
            onChange={handleCommandChange}
            onSubmit={handleCommandSubmit}
          />
          {" ".repeat(width - command.length - 1)}
        </Color>
      ) : (
        <Box textWrap="truncate-end">
          <Color bgBlackBright>{content}</Color>
        </Box>
      )}
    </Box>
  );
};

export default StatusBarComponent;
