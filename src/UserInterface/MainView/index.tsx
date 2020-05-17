import React, { FunctionComponent } from "react";
import { Box, useInput, useApp } from "ink";
import Configuration from "../../Configuration";
import CollectionComponent from "./CollectionComponent";
import EnvironmentsComponent from "./EnvironmentsComponent";
import RequestsComponent from "./RequestsComponent";
import SelectedRequestComponent from "./SelectedRequestComponent";
import ResponseComponent from "./ResponseComponent";
import Clients from "../../Clients";
import Collection from "../../Collections/Collection";
import Request from "../../Collections/Request";
import Response from "../../Response";
import Environment from "../../Collections/Environment";

const MainView: FunctionComponent<{
  configuration: Configuration;
  client: string;
  collection?: Collection;
  selectedEnvironment?: Environment;
  selectedRequest?: Request;
  setLastResponse: (response: Response) => void;
  lastResponse?: Response;
}> = ({
  configuration,
  client,
  collection,
  selectedEnvironment,
  selectedRequest,
  lastResponse,
  setLastResponse,
}) => {
  const { exit } = useApp();
  useInput((input) => {
    if (input === configuration.get("keys.quit")) {
      exit();
    } else if (input === configuration.get("keys.send")) {
      if (selectedRequest instanceof Request) {
        Clients.send(client, selectedRequest).then(setLastResponse);
      }
    }
  });
  return (
    <Box width="100%" height="100%">
      <Box width={30} flexDirection="column">
        <CollectionComponent name={collection?.name} />
        <EnvironmentsComponent
          environments={collection?.environments}
          selectedEnvironment={selectedEnvironment}
        />
        <RequestsComponent
          requests={collection?.requests}
          selectedRequest={selectedRequest}
        />
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
  );
};

export default MainView;