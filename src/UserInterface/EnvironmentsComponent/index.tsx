import React, { FunctionComponent } from "react";
import { Box } from "ink";
import Environment from "../../Collections/Environment";

const EnvironmentsComponent: FunctionComponent<{
  environments?: Environment[];
}> = ({ environments }) => {
  return (
    <Box flexDirection="column" padding={1} width="50%">
      <Box>Environments:</Box>
      {environments?.map((environment) => {
        return <Box>{environment.name}</Box>;
      })}
    </Box>
  );
};

export default EnvironmentsComponent;
