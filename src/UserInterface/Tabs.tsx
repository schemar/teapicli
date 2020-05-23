import React, { Children, FunctionComponent, useState } from "react";
import { Box, Color, useInput } from "ink";

const Tab: FunctionComponent<{ name: string }> = ({ children }) => {
  return <>{children}</>;
};

const Tabs: FunctionComponent<{
  changeKey: string;
  children: React.ReactElement<typeof Tab>[];
}> = ({ changeKey, children }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  useInput((input) => {
    if (input === changeKey) {
      if (activeTab + 1 >= Children.count(children)) {
        setActiveTab(0);
      } else {
        setActiveTab(activeTab + 1);
      }
    }
  });

  return (
    <Box flexDirection="column">
      <Box flexDirection="row">
        {Children.map(children, (child, index) => {
          return (
            <Box>
              {index > 0 && " | "}
              <Color gray={activeTab !== index} green={activeTab === index}>
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
