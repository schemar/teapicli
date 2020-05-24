import React, { FunctionComponent, useEffect, useState } from "react";
import { Box } from "ink";
import useStdoutDimensions from "ink-use-stdout-dimensions";
import Configuration from "../Configuration";
import { useStore, StoreProvider } from "../Store";
import Collections from "../Collections";
import Collection from "../Collections/Collection";
import Environment from "../Collections/Environment";
import Request from "../Collections/Request";
import Response from "../Response";
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
  const { commandsStore } = useStore();
  const [columns, rows] = useStdoutDimensions();

  const [viewState, setViewState] = useState<ViewState>(ViewState.Main);
  const [collection, setCollection] = useState<Collection>();
  const [selectedEnvironment, setSelectedEnvironment] = useState<Environment>();
  const [selectedRequest, setSelectedRequest] = useState<Request>();
  const [lastResponse, setLastResponse] = useState<Response>();

  useEffect(() => {
    const newCollection = Collections.read({
      filePath: program.collection,
      importerName: configuration.get("importer"),
    });
    setCollection(newCollection);
  }, [program.collection, configuration]);

  useEffect(() => {
    if (collection !== undefined && collection.requests.length > 0) {
      setSelectedRequest(collection.requests[0]);
    }
    if (collection !== undefined && collection.environments.length > 0) {
      setSelectedEnvironment(collection.environments[0]);
    }
  }, [collection]);

  useEffect(() => {
    const commands = {
      showResponse: () => {
        if (lastResponse !== undefined) {
          setViewState(ViewState.ResponsePager);
        }
      },
      selectRequest: () => {
        if (collection?.requests && collection.requests.length > 1) {
          setViewState(ViewState.RequestSelector);
        }
      },
      selectEnvironment: () => {
        if (collection?.environments && collection.environments.length > 1) {
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
    collection!.requests.forEach((request) => {
      if (request.name === name) {
        setSelectedRequest(request);
      }
    });
    onWindowClose();
  };

  const onEnvironmentSelect = (name: string) => {
    collection!.environments.forEach((environment) => {
      if (environment.name === name) {
        setSelectedEnvironment(environment);
      }
    });
    onWindowClose();
  };

  return (
    <FullScreen>
      <StoreProvider>
        <Box width={columns} height={rows - 1} flexDirection="column">
          {viewState === ViewState.Main && (
            <MainView
              configuration={configuration}
              client={program.client}
              collection={collection}
              setCollection={setCollection}
              selectedEnvironment={selectedEnvironment}
              selectedRequest={selectedRequest}
              lastResponse={lastResponse}
              setLastResponse={setLastResponse}
            />
          )}
          {viewState === ViewState.ResponsePager && (
            <Pager
              content={lastResponse!.body}
              onClose={onWindowClose}
              width={columns}
              height={rows - 2}
            />
          )}
          {viewState === ViewState.RequestSelector && (
            <Selector
              height={rows}
              items={collection!.requests}
              selectedItem={selectedRequest?.name}
              onSelect={onRequestSelect}
              onClose={onWindowClose}
            />
          )}
          {viewState === ViewState.EnvironmentSelector && (
            <Selector
              height={rows}
              items={collection!.environments}
              selectedItem={selectedEnvironment?.name}
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

export default UserInterface;
