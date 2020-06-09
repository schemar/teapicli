import React, { FunctionComponent, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Box } from "ink";
import Configuration from "../../Configuration";
import { editCollection } from "../../Shell/commands";
import { useStore } from "../../Store";
import CollectionComponent from "./CollectionComponent";
import EnvironmentsComponent from "./EnvironmentsComponent";
import RequestsComponent from "./RequestsComponent";
import SelectedRequestComponent from "./SelectedRequestComponent";
import ResponseComponent from "./ResponseComponent";
import Clients from "../../Clients";
import Collections from "../../Collections";
import Request from "../../Collections/Request";

const MainView: FunctionComponent<{
  configuration: Configuration;
  client: string;
}> = ({ configuration, client }) => {
  const { commandsStore, collectionStore } = useStore();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<[number, number]>();

  useEffect(() => {
    const commands = {
      send: () => {
        if (collectionStore.selectedRequest instanceof Request) {
          setLoading(true);
          setStartTime(process.hrtime());
          Clients.send(
            client,
            collectionStore.selectedRequest,
            collectionStore.selectedEnvironment
          ).then((response) => {
            setLoading(false);
            collectionStore.addResponse(response);
          });
        }
      },
      edit: () => {
        const { collection } = collectionStore;
        if (collection !== undefined) {
          const updatedCollection = editCollection(collection, configuration);
          if (updatedCollection !== undefined) {
            collectionStore.setCollection(updatedCollection);
          }
        }
      },
      write: () => {
        if (collectionStore.collection !== undefined) {
          Collections.write({
            collection: collectionStore.collection,
            exporterName: configuration.get("exporter"),
          });
        }
      },
    };

    commandsStore.registerCommands(commands);
    return () => {
      commandsStore.unregisterCommands(commands);
    };
  });

  return (
    <Box width="100%" height="100%">
      <Box width={30} flexDirection="column">
        <CollectionComponent />
        <EnvironmentsComponent />
        <RequestsComponent />
      </Box>
      <Box flexGrow={1} flexDirection="column">
        <Box height="50%">
          <SelectedRequestComponent />
        </Box>
        <Box flexGrow={1}>
          <ResponseComponent isLoading={isLoading} startTime={startTime} />
        </Box>
      </Box>
    </Box>
  );
};

export default observer(MainView);
