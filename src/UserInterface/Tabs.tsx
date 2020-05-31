import React, { Children, FunctionComponent, useEffect, useState } from "react";
import { Box, Color } from "ink";
import { useStore } from "../Store";

const Tab: FunctionComponent<{ name: string }> = ({ children }) => {
  return <>{children}</>;
};

const Tabs: FunctionComponent<{
  changeCommand: string;
  children: React.ReactElement<typeof Tab>[];
}> = ({ changeCommand, children }) => {
  const { commandsStore } = useStore();
  const [activeTab, setActiveTab] = useState<number>(0);

  useEffect(() => {
    const commands: { [key: string]: () => void } = {};
    commands[changeCommand] = () => {
      if (activeTab + 1 >= Children.count(children)) {
        setActiveTab(0);
      } else {
        setActiveTab(activeTab + 1);
      }
    };
    commandsStore.registerCommands(commands);
    return () => {
      commandsStore.unregisterCommands(commands);
    };
  });

  return (
    <Box flexDirection="column">
      <Box flexDirection="row">
        {Children.map(children, (child, index) => {
          return (
            <Box>
              {index > 0 && " | "}
              <Color white={activeTab !== index} green={activeTab === index}>
                {child?.props.name}
              </Color>
            </Box>
          );
        })}
      </Box>
      <Box>
        {Children.map(children, (child, index) => {
          return index === activeTab && child;
        })}
      </Box>
    </Box>
  );
};

export { Tab, Tabs };
