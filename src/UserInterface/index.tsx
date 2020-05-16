import React, { FunctionComponent, useEffect, useState } from "react";
import { Box, useApp, useInput } from "ink";
import useStdoutDimensions from "ink-use-stdout-dimensions";
import Configuration from "../Configuration";
import CollectionComponent from "./CollectionComponent";
import EnvironmentsComponent from "./EnvironmentsComponent";
import RequestsComponent from "./RequestsComponent";
import SelectedRequestComponent from "./SelectedRequestComponent";
import ResponseComponent from "./ResponseComponent";
import StatusBarComponent from "./StatusBarComponent";
import Collections from "../Collections";
import Collection from "../Collections/Collection";
import Request from "../Collections/Request";

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
  const [selectedRequest, setSelectedRequest] = useState<Request>();

  useEffect(() => {
    const newCollection = Collections.load({
      filePath: program.collection,
      importerName: program.importer,
    });
    setCollection(newCollection);
    if (newCollection.requests.length > 0) {
      setSelectedRequest(newCollection.requests[0]);
    }
  }, [program.collection, program.importer]);

  return (
    <Box width={columns} height={rows - 1} flexDirection="column">
      <Box flexGrow={1}>
        <Box width="45%" flexDirection="column">
          <CollectionComponent name={collection?.name} />
          <Box flexDirection="row" width="100%">
            <EnvironmentsComponent environments={collection?.environments} />
            <RequestsComponent requests={collection?.requests} />
          </Box>
        </Box>
        <Box flexGrow={1} flexDirection="column">
          <Box height="50%">
            <SelectedRequestComponent request={selectedRequest} />
          </Box>
          <Box flexGrow={1}>
            <ResponseComponent />
          </Box>
        </Box>
      </Box>
      <StatusBarComponent width={columns} />
    </Box>
  );
};

export default UserInterface;
