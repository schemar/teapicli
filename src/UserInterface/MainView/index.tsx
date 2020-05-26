import { execSync } from "child_process";
import fs from "fs";
import React, { FunctionComponent, useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Box, useApp } from "ink";
import Configuration from "../../Configuration";
import { useStore } from "../../Store";
import CollectionComponent from "./CollectionComponent";
import EnvironmentsComponent from "./EnvironmentsComponent";
import RequestsComponent from "./RequestsComponent";
import SelectedRequestComponent from "./SelectedRequestComponent";
import ResponseComponent from "./ResponseComponent";
import Clients from "../../Clients";
import Collections from "../../Collections";
import Collection from "../../Collections/Collection";
import Request from "../../Collections/Request";

const MainView: FunctionComponent<{
  configuration: Configuration;
  client: string;
}> = ({ configuration, client }) => {
  const { exit } = useApp();
  const { commandsStore, collectionStore } = useStore();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<[number, number]>();

  useEffect(() => {
    const commands = {
      quit: exit,
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
          // Make sure the temporary path exists:
          const tempDir = `${execSync('dirname "$(mktemp -u)"')
            .toString("utf-8")
            .replace(/(\n|\r)+$/, "")}/teapicli`;
          execSync(`mkdir -p ${tempDir}`);

          // Store a copy of the collection in a temp path:
          const tempPath = `${tempDir}/collection_${process.pid.toString(
            10
          )}.json`;
          const copy = new Collection({ ...collection, path: tempPath });
          Collections.write({
            collection: copy,
            exporterName: configuration.get("exporter"),
          });

          // Edit the temporary copy:
          const editor = process.env.EDITOR ?? "vi";
          execSync(`${editor} ${tempPath}`, { stdio: "inherit" });

          // Update the collection from the temporary copy:
          const updatedCollection = Collections.read({
            filePath: tempPath,
            importerName: configuration.get("importer"),
          });

          if (updatedCollection !== undefined) {
            const updatedCollectionWithOriginalPath = new Collection({
              ...updatedCollection,
              path: collection.path,
            });
            collectionStore.setCollection(updatedCollectionWithOriginalPath);
          }

          // Delete the temporary copy:
          fs.unlinkSync(tempPath);
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
