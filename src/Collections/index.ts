import Collection from "./Collection";
import Importer from "./Importer";
import ApitecliImporter from "./Importers/ApitecliImporter";

export default class Collections {
  public static load({
    filePath,
    importerName,
  }: {
    filePath: string;
    importerName: string;
  }): Collection {
    const importer: Importer = this.getImporter(importerName);
    const collection = importer.import(filePath);

    return collection;
  }

  private static getImporter(importer: string): Importer {
    switch (importer) {
      case "apitecli":
        return new ApitecliImporter();
      default:
        throw new Error(`Unknown importer, cannot continue: ${importer}`);
    }
  }
}
