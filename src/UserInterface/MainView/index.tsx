import { execSync } from "child_process";
import fs from "fs";
import React, { FunctionComponent, useEffect, useState } from "react";
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
import Response from "../../Response";
import Environment from "../../Collections/Environment";

const MainView: FunctionComponent<{
  configuration: Configuration;
  client: string;
  collection?: Collection;
  setCollection: (collection: Collection) => void;
  selectedEnvironment?: Environment;
  selectedRequest?: Request;
  setLastResponse: (response: Response) => void;
  lastResponse?: Response;
}> = ({
  configuration,
  client,
  collection,
  setCollection,
  selectedEnvironment,
  selectedRequest,
  lastResponse,
  setLastResponse,
}) => {
  const { exit } = useApp();
  const { commandsStore } = useStore();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<[number, number]>();

  useEffect(() => {
    const commands = {
      quit: exit,
      send: () => {
        if (selectedRequest instanceof Request) {
          setLoading(true);
          setStartTime(process.hrtime());
          Clients.send(client, selectedRequest, selectedEnvironment).then(
            (response) => {
              setLoading(false);
              setLastResponse(response);
            }
          );
        }
      },
      edit: () => {
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
          const updatedCollectionWithOriginalPath = new Collection({
            ...updatedCollection,
            path: collection.path,
          });
          setCollection(updatedCollectionWithOriginalPath);

          // Delete the temporary copy:
          fs.unlinkSync(tempPath);
        }
      },
      write: () => {
        if (collection !== undefined) {
          Collections.write({
            collection,
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
          <ResponseComponent
            isLoading={isLoading}
            startTime={startTime}
            response={lastResponse}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default MainView;
