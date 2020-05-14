import Collection from "./Collection";

export default interface Importer {
  import(filePath: string): Collection;
} // eslint-disable-line semi
