import React, { FunctionComponent, useEffect, useState } from "react";
import { Box, useApp, useInput } from "ink";
import useStdoutDimensions from "ink-use-stdout-dimensions";
import Configuration from "../Configuration";
import Clients from "../Clients";
import Collections from "../Collections";
import Collection from "../Collections/Collection";
import Environment from "../Collections/Environment";
import Request from "../Collections/Request";
import Response from "../Response";
import StatusBarComponent from "./StatusBarComponent";
import MainView from "./MainView";

const UserInterface: FunctionComponent<{
  program: any;
  configuration: Configuration;
}> = ({ program, configuration }) => {
  const { exit } = useApp();
  const [columns, rows] = useStdoutDimensions();

  const [collection, setCollection] = useState<Collection>();
  const [selectedEnvironment, setSelectedEnvironment] = useState<Environment>();
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
    if (newCollection.environments.length > 0) {
      setSelectedEnvironment(newCollection.environments[0]);
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
      <MainView
        configuration={configuration}
        client={program.client}
        collection={collection}
        selectedEnvironment={selectedEnvironment}
        selectedRequest={selectedRequest}
        lastResponse={lastResponse}
        setLastResponse={setLastResponse}
      />
      <StatusBarComponent width={columns} />
    </Box>
  );
};

export default UserInterface;
