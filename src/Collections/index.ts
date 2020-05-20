import Collection from "./Collection";
import Importer from "./Importer";
import TeapicliImporter from "./Importers/TeapicliImporter";

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
      case "teapicli":
        return new TeapicliImporter();
      default:
        throw new Error(`Unknown importer, cannot continue: ${importer}`);
    }
  }
}
