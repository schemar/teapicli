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

enum ViewState {
  Main,
  ResponsePager,
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
    if (input === configuration.get("keys.showResponse")) {
      if (lastResponse !== undefined) {
        setViewState(ViewState.ResponsePager);
      }
    }
  });

  const onWindowClose = () => {
    setViewState(ViewState.Main);
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
      <StatusBarComponent width={columns} />
    </Box>
  );
};

export default UserInterface;
