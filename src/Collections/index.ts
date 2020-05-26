import { store } from "../Store";
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
  }): Collection | undefined {
    const importer: Importer | undefined = this.getImporter(importerName);
    try {
      return importer?.import(filePath);
    } catch (error) {
      store.messagesStore.error(`Cannot import collection: ${error}`);
    }

    return undefined;
  }

  public static write({
    collection,
    exporterName,
  }: {
    collection: Collection;
    exporterName: string;
  }): void {
    const exporter: Exporter | undefined = this.getExporter(exporterName);

    if (exporter !== undefined) {
      exporter.export(collection);
    }
  }

  private static getImporter(importer: string): Importer | undefined {
    switch (importer) {
      case "teapicli":
        return new TeapicliImporter();
      default:
        store.messagesStore.error(
          `Unknown importer, cannot import: ${importer}`
        );
        return undefined;
    }
  }

  private static getExporter(exporter: string): Exporter | undefined {
    switch (exporter) {
      case "teapicli":
        return new TeapicliExporter();
      default:
        store.messagesStore.error(
          `Unknown exporter, cannot export: ${exporter}`
        );
        return undefined;
    }
  }
}
