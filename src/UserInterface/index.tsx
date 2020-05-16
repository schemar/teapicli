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
import Clients from "../Clients";
import Collections from "../Collections";
import Collection from "../Collections/Collection";
import Request from "../Collections/Request";
import Response from "../Response";

const UserInterface: FunctionComponent<{
  program: any;
  configuration: Configuration;
}> = ({ program, configuration }) => {
  const { exit } = useApp();
  const [columns, rows] = useStdoutDimensions();

  const [collection, setCollection] = useState<Collection>();
  const [selectedRequest, setSelectedRequest] = useState<Request>();
  const [lastResponse, setLastResponse] = useState<Response>();

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

  useInput((input) => {
    if (input === configuration.get("keys.quit")) {
      exit();
    } else if (input === configuration.get("keys.send")) {
      if (selectedRequest instanceof Request) {
        Clients.send(program.client, selectedRequest).then(setLastResponse);
      }
    }
  });

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
            <ResponseComponent response={lastResponse} />
          </Box>
        </Box>
      </Box>
      <StatusBarComponent width={columns} />
    </Box>
  );
};

export default UserInterface;
