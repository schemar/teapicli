import React, { FunctionComponent, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Box, useApp } from "ink";
import useStdoutDimensions from "ink-use-stdout-dimensions";
import Configuration from "../Configuration";
import { useStore, StoreProvider } from "../Store";
import { View } from "../Store/ViewsStore";
import Collections from "../Collections";
import FullScreen from "./FullScreen";

import StatusBarComponent from "./StatusBarComponent";
import MainView from "./MainView";
import Pager from "./Pager";
import Selector from "./Selector";

const UserInterface: FunctionComponent<{
  collectionPath: string;
  program: any;
  configuration: Configuration;
}> = ({ collectionPath, program, configuration }) => {
  const { exit } = useApp();
  const { commandsStore, collectionStore, viewsStore } = useStore();
  const [columns, rows] = useStdoutDimensions();

  useEffect(() => {
    const newCollection = Collections.read({
      filePath: collectionPath,
      importerName: configuration.get("importer"),
    });
    collectionStore.setCollection(newCollection);
  }, [program.collection, configuration, collectionPath]);

  useEffect(() => {
    const commands = {
      showResponse: () => {
        if (collectionStore.lastResponse !== undefined) {
          viewsStore.pushView(View.ResponsePager);
        }
      },
      selectRequest: () => {
        if (collectionStore.hasRequests) {
          viewsStore.pushView(View.RequestSelector);
        }
      },
      selectEnvironment: () => {
        if (collectionStore.hasEnvironments) {
          viewsStore.pushView(View.EnvironmentSelector);
        }
      },
    };

    commandsStore.registerCommands(commands);

    return () => {
      commandsStore.unregisterCommands(commands);
    };
  }, []);

  useEffect(() => {
    if (viewsStore.activeView === undefined) {
      exit();
    }
  }, [viewsStore.activeView, exit]);

  const onRequestSelect = (name: string) => {
    collectionStore.setSelectedRequestByName(name);
  };

  const onEnvironmentSelect = (name: string) => {
    collectionStore.setSelectedEnvironmentByName(name);
  };

  return (
    <FullScreen>
      <StoreProvider>
        <Box width={columns} height={rows - 1} flexDirection="column">
          {viewsStore.activeView === View.Main && (
            <MainView configuration={configuration} client={program.client} />
          )}
          {viewsStore.activeView === View.ResponsePager && (
            <Pager
              content={collectionStore.lastResponse!.body}
              width={columns}
              height={rows - 2}
            />
          )}
          {viewsStore.activeView === View.RequestSelector && (
            <Selector
              height={rows}
              items={collectionStore.collection!.requests}
              selectedItem={collectionStore.selectedRequest?.name}
              onSelect={onRequestSelect}
            />
          )}
          {viewsStore.activeView === View.EnvironmentSelector && (
            <Selector
              height={rows}
              items={collectionStore.collection!.environments}
              selectedItem={collectionStore.selectedEnvironment?.name}
              onSelect={onEnvironmentSelect}
            />
          )}
          <StatusBarComponent width={columns} configuration={configuration} />
        </Box>
      </StoreProvider>
    </FullScreen>
  );
};

export default observer(UserInterface);
