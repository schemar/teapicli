import React from "react";
import CommandsStore from "./CommandsStore";

class Store {
  public readonly commandsStore: CommandsStore;

  constructor() {
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

export { StoreProvider, useStore };
