import Collection from "./Collection";
import Importer from "./Importer";
import Exporter from "./Exporter";
import TeapicliImporter from "./Importers/TeapicliImporter";
import TeapicliExporter from "./Exporters/TeapicliExporter";

export default class Collections {
  public static read({
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

  public static write({
    collection,
    exporterName,
  }: {
    collection: Collection;
    exporterName: string;
  }): void {
    const exporter: Exporter = this.getExporter(exporterName);
    exporter.export(collection);
  }

  private static getImporter(importer: string): Importer {
    switch (importer) {
      case "teapicli":
        return new TeapicliImporter();
      default:
        throw new Error(`Unknown importer, cannot continue: ${importer}`);
    }
  }

  private static getExporter(exporter: string): Exporter {
    switch (exporter) {
      case "teapicli":
        return new TeapicliExporter();
      default:
        throw new Error(`Unknown exporter, cannot continue: ${exporter}`);
    }
  }
}
