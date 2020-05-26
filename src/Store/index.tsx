import React from "react";
import CollectionStore from "./CollectionStore";
import CommandsStore from "./CommandsStore";
import MessagesStore from "./MessagesStore";

class Store {
  public readonly collectionStore: CollectionStore;

  public readonly messagesStore: MessagesStore;

  public readonly commandsStore: CommandsStore;

  constructor() {
    this.collectionStore = new CollectionStore();
    this.messagesStore = new MessagesStore();
    this.commandsStore = new CommandsStore();
  }
}

const store = new Store();

const storeContext = React.createContext<Store>(store);

/** Provider component to wrap app with. Provides context for `useStore` hook. */
const StoreProvider = ({ children }: any) => {
  return (
    <storeContext.Provider value={store}>{children}</storeContext.Provider>
  );
};

/** Hook to make the store available in function components. */
const useStore = () => {
  const storeInContext = React.useContext(storeContext);
  if (!storeInContext) {
    throw new Error("useStore must be used within a StoreProvider.");
  }
  return storeInContext;
};

export { StoreProvider, store, useStore };
