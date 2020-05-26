import React, { FunctionComponent, useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Box } from "ink";
import useStdoutDimensions from "ink-use-stdout-dimensions";
import Configuration from "../Configuration";
import { useStore, StoreProvider } from "../Store";
import Collections from "../Collections";
import FullScreen from "./FullScreen";

import StatusBarComponent from "./StatusBarComponent";
import MainView from "./MainView";
import Pager from "./Pager";
import Selector from "./Selector";

enum ViewState {
  Main,
  ResponsePager,
  RequestSelector,
  EnvironmentSelector,
}

const UserInterface: FunctionComponent<{
  program: any;
  configuration: Configuration;
}> = ({ program, configuration }) => {
  const { commandsStore, collectionStore } = useStore();
  const [columns, rows] = useStdoutDimensions();

  const [viewState, setViewState] = useState<ViewState>(ViewState.Main);

  useEffect(() => {
    const newCollection = Collections.read({
      filePath: program.collection,
      importerName: configuration.get("importer"),
    });
    collectionStore.setCollection(newCollection);
  }, [program.collection, configuration]);

  useEffect(() => {
    const commands = {
      showResponse: () => {
        if (collectionStore.lastResponse !== undefined) {
          setViewState(ViewState.ResponsePager);
        }
      },
      selectRequest: () => {
        if (collectionStore.hasRequests) {
          setViewState(ViewState.RequestSelector);
        }
      },
      selectEnvironment: () => {
        if (collectionStore.hasEnvironments) {
          setViewState(ViewState.EnvironmentSelector);
        }
      },
    };

    commandsStore.registerCommands(commands);

    return () => {
      commandsStore.unregisterCommands(commands);
    };
  });

  const onWindowClose = () => {
    setViewState(ViewState.Main);
  };

  const onRequestSelect = (name: string) => {
    collectionStore.setSelectedRequestByName(name);
    onWindowClose();
  };

  const onEnvironmentSelect = (name: string) => {
    collectionStore.setSelectedEnvironmentByName(name);
    onWindowClose();
  };

  return (
    <FullScreen>
      <StoreProvider>
        <Box width={columns} height={rows - 1} flexDirection="column">
          {viewState === ViewState.Main && (
            <MainView configuration={configuration} client={program.client} />
          )}
          {viewState === ViewState.ResponsePager && (
            <Pager
              content={collectionStore.lastResponse!.body}
              onClose={onWindowClose}
              width={columns}
              height={rows - 2}
            />
          )}
          {viewState === ViewState.RequestSelector && (
            <Selector
              height={rows}
              items={collectionStore.collection!.requests}
              selectedItem={collectionStore.selectedRequest?.name}
              onSelect={onRequestSelect}
              onClose={onWindowClose}
            />
          )}
          {viewState === ViewState.EnvironmentSelector && (
            <Selector
              height={rows}
              items={collectionStore.collection!.environments}
              selectedItem={collectionStore.selectedEnvironment?.name}
              onSelect={onEnvironmentSelect}
              onClose={onWindowClose}
            />
          )}
          <StatusBarComponent width={columns} configuration={configuration} />
        </Box>
      </StoreProvider>
    </FullScreen>
  );
};

export default observer(UserInterface);
