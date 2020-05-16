import Client from "../Client";
import Request from "../Collections/Request";
import Response from "../Response";
import AxiosClient from "./AxiosClient";

export default class Clients {
  public static send(clientName: string, request: Request): Promise<Response> {
    const client = Clients.getClient(clientName);

    return client.send(request);
  }

  private static getClient(clientName: string): Client {
    switch (clientName) {
      case "axios":
        return new AxiosClient();
      default:
        throw new Error(`Unknown client, cannot continue: ${clientName}`);
    }
  }
}
