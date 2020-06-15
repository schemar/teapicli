import { execSync } from "child_process";
import fs from "fs";

import Configuration from "../Configuration";
import Collection from "../Collections/Collection";
import Collections from "../Collections";

const getTempPath = (fileName: string, fileExtension: string): string => {
  // Make sure the temporary path exists:
  const tempDir = `${execSync('dirname "$(mktemp -u)"')
    .toString("utf-8")
    .replace(/(\n|\r)+$/, "")}/teapicli`;
  execSync(`mkdir -p ${tempDir}`);

  // Store a copy of the collection in a temp path:
  const tempPath = `${tempDir}/${fileName}_${process.pid.toString(
    10
  )}${fileExtension}`;

  return tempPath;
};

const showPager = (content: string) => {
  const tempDir = `${execSync('dirname "$(mktemp -u)"')
    .toString("utf-8")
    .replace(/(\n|\r)+$/, "")}/teapicli`;
  execSync(`mkdir -p ${tempDir}`);

  // Store a copy of the response in a temp path:
  const tempPath = `${tempDir}/pager_${process.pid.toString(10)}`;
  fs.writeFileSync(tempPath, content);
  const pager = process.env.PAGER ?? "less";
  execSync(`${pager} ${tempPath}`, { stdio: "inherit" });
  // Delete the temporary copy:
  fs.unlinkSync(tempPath);
};

const editCollection = (
  collection: Collection,
  configuration: Configuration
): Collection | undefined => {
  const tempPath = getTempPath("collection", ".json");
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

  let updatedCollectionWithOriginalPath: Collection | undefined;
  if (updatedCollection !== undefined) {
    updatedCollectionWithOriginalPath = new Collection({
      ...updatedCollection,
      path: collection.path,
    });
  }

  // Delete the temporary copy:
  fs.unlinkSync(tempPath);
  return updatedCollectionWithOriginalPath;
};
export { editCollection, showPager };
