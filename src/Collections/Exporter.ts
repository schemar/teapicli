import Collection from "./Collection";

export default interface Exporter {
  export(collection: Collection): void;
} // eslint-disable-line semi
