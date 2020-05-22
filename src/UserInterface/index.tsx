import React, { FunctionComponent, useEffect, useState } from "react";

import { Box, useInput } from "ink";
import useStdoutDimensions from "ink-use-stdout-dimensions";
import Configuration from "../Configuration";
import Collections from "../Collections";
import Collection from "../Collections/Collection";
import Environment from "../Collections/Environment";
import Request from "../Collections/Request";
import Response from "../Response";
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
    if (newCollection.requests.length > 0) {
      setSelectedRequest(newCollection.requests[0]);
    }
    if (newCollection.environments.length > 0) {
      setSelectedEnvironment(newCollection.environments[0]);
    }
  }, [program.collection, configuration]);

  useInput((input) => {
    if (input === configuration.get("keys.showResponse")) {
      if (lastResponse !== undefined) {
        setViewState(ViewState.ResponsePager);
      }
    } else if (input === configuration.get("keys.selectRequest")) {
      if (collection?.requests && collection.requests.length > 1) {
        setViewState(ViewState.RequestSelector);
      }
    } else if (input === configuration.get("keys.selectEnvironment")) {
      if (collection?.environments && collection.environments.length > 1) {
        setViewState(ViewState.EnvironmentSelector);
      }
    }
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
    <Box width={columns} height={rows - 1} flexDirection="column">
      {viewState === ViewState.Main && (
        <MainView
          configuration={configuration}
          client={program.client}
          collection={collection}
          selectedEnvironment={selectedEnvironment}
          selectedRequest={selectedRequest}
          lastResponse={lastResponse}
          setLastResponse={setLastResponse}
        />
      )}
      {viewState === ViewState.ResponsePager && (
        <Pager
          configuration={configuration}
          content={lastResponse!.body}
          onClose={onWindowClose}
          width={columns}
          height={rows - 2}
        />
      )}
      {viewState === ViewState.RequestSelector && (
        <Selector
          configuration={configuration}
          height={rows}
          items={collection!.requests}
          selectedItem={selectedRequest?.name}
          onSelect={onRequestSelect}
          onClose={onWindowClose}
        />
      )}
      {viewState === ViewState.EnvironmentSelector && (
        <Selector
          configuration={configuration}
          height={rows}
          items={collection!.environments}
          selectedItem={selectedEnvironment?.name}
          onSelect={onEnvironmentSelect}
          onClose={onWindowClose}
        />
      )}
      <StatusBarComponent width={columns} message="" />
    </Box>
  );
};

export default UserInterface;
