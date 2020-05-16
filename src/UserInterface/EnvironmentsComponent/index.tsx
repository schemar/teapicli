import React, { FunctionComponent } from "react";
import { Box, Color } from "ink";
import Environment from "../../Collections/Environment";

const EnvironmentsComponent: FunctionComponent<{
  environments?: Environment[];
  selectedEnvironment?: Environment;
}> = ({ environments, selectedEnvironment }) => {
  return (
    <Box flexDirection="column" padding={1} width="50%">
      <Box>
        <Color green>Environments:</Color>
      </Box>
      {environments?.map((environment) => {
        if (environment.name === selectedEnvironment?.name) {
          return <Box textWrap="truncate-end"><Color blue>{environment.name}</Color></Box>
        }
        return <Box textWrap="truncate-end">{environment.name}</Box>;
      })}
    </Box>
  );
};

export default EnvironmentsComponent;
