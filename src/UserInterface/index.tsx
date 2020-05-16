import React, { FunctionComponent, useEffect, useState } from "react";
import { Box, Color, useApp, useInput } from "ink";
import useStdoutDimensions from "ink-use-stdout-dimensions";
import Configuration from "../Configuration";
import Collections from "../Collections";
import Collection from "../Collections/Collection";

const UserInterface: FunctionComponent<{
  program: any;
  configuration: Configuration;
}> = ({ program, configuration }) => {
  const { exit } = useApp();
  const [columns, rows] = useStdoutDimensions();
  useInput((input) => {
    if (input === configuration.get("keys.quit")) {
      exit();
    }
  });

  const [collection, setCollection] = useState<Collection>();

  useEffect(() => {
    setCollection(
      Collections.load({
        filePath: program.collection,
        importerName: program.importer,
      })
    );
  }, [program.collection, program.importer]);

  return (
    <Box width={columns} height={rows - 1} flexDirection="column">
      <Box flexGrow={1}>
        <Box width="45%" flexDirection="column">
          <Box flexDirection="column" padding={1} width="100%">
            <Box>Collection:</Box>
            <Box>{collection?.name}</Box>
          </Box>
          <Box flexDirection="row" width="100%">
            <Box flexDirection="column" padding={1} width="50%">
              <Box>Environments:</Box>
              {collection?.environments.map((environment) => {
                return <Box>{environment.name}</Box>;
              })}
            </Box>
            <Box flexDirection="column" padding={1} width="50%">
              <Box>Requests:</Box>
              {collection?.requests.map((request) => {
                return <Box>{request.name}</Box>;
              })}
            </Box>
          </Box>
        </Box>
        <Box flexGrow={1} flexDirection="column">
          <Box height="50%" padding={1}>
            Request:
          </Box>
          <Box flexGrow={1} padding={1}>
            Response:
          </Box>
        </Box>
      </Box>
      <Box height={1} width={columns}>
        <Box textWrap="truncate-end">
          <Color bgBlackBright={true}>
            :write{" ".repeat(columns - ":write".length)}
          </Color>
        </Box>
      </Box>
    </Box>
  );
};

export default UserInterface;
