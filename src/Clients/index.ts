import { store } from "../Store";
import Client from "../Client";
import Request from "../Collections/Request";
import Environment from "../Collections/Environment";
import Response from "../Response";
import AxiosClient from "./AxiosClient";

export default class Clients {
  public static send(
    clientName: string,
    request: Request,
    environment?: Environment
  ): Promise<Response | undefined> {
    const client = Clients.getClient(clientName);
    if (client === undefined) {
      return Promise.resolve(undefined);
    }

    const replacedRequest =
      environment !== undefined ? environment.applyTo(request) : request;

    return client.send(replacedRequest);
  }

  private static getClient(clientName: string): Client | undefined {
    switch (clientName) {
      case "axios":
        return new AxiosClient();
      default:
        store.messagesStore.error(
          `Unknown client, cannot continue: ${clientName}`
        );
    }

    return undefined;
  }
}
