import React, { FunctionComponent, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Box, useApp } from "ink";
import useStdoutDimensions from "ink-use-stdout-dimensions";
import highlight from "cli-highlight";
import markdownTable from "markdown-table";
import { showPager } from "../Shell/commands";
import Configuration from "../Configuration";
import { useStore, StoreProvider } from "../Store";
import { View } from "../Store/ViewsStore";
import Collections from "../Collections";

import StatusBarComponent from "./StatusBarComponent";
import MessagesComponent from "./MessagesComponent";
import MainView from "./MainView";
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
      close: () => {
        viewsStore.popView();
      },
      listMessages: () => {
        viewsStore.pushView(View.Messages);
      },
      listAvailableCommands: () => {
        const configSchema = configuration.getSchema();
        const configProperties = configuration.getProperties();
        const tableHeader = [["Command", "Shortcut", "Description"]];
        const tableRows: string[][] = Object.keys(
          commandsStore.availableCommands
        )
          .sort()
          .map((command: string) => {
            const shortcut = (configProperties.keys as any)[command] as string;
            /* eslint-disable no-underscore-dangle */
            const description = (configSchema as any)._cvtProperties.keys
              ._cvtProperties[command].doc;
            /* eslint-enable no-underscore-dangle */
            return [command, shortcut, description];
          });
        showPager(highlight(markdownTable(tableHeader.concat(tableRows))));
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
    <StoreProvider>
      <Box width={columns} height={rows - 1} flexDirection="column">
        {viewsStore.activeView === View.Main && (
          <MainView configuration={configuration} client={program.client} />
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
        {viewsStore.activeView === View.Messages && (
          <MessagesComponent width={columns} height={rows - 1} />
        )}
        <StatusBarComponent width={columns} configuration={configuration} />
      </Box>
    </StoreProvider>
  );
};

export default observer(UserInterface);
