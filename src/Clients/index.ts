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
  ): Promise<Response> {
    const client = Clients.getClient(clientName);

    const replacedRequest =
      environment !== undefined ? environment.applyTo(request) : request;

    return client.send(replacedRequest);
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
