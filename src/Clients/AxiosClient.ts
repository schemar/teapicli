import axios from "axios";
import Client from "../Client";
import Request from "../Collections/Request";
import Response from "../Response";

// File uses non-static methods to implement an interface:
/* eslint-disable class-methods-use-this */

export default class AxiosClient implements Client {
  public async send(request: Request): Promise<Response> {
    const response = await axios.request({
      url: request.url,
      method: request.method,
      headers: request.headers,
      data: request.body || undefined,
    });

    return {
      status: response.status,
      headers: response.headers,
      body:
        typeof response.data === "string"
          ? response.data
          : JSON.stringify(response.data, null, 2),
    };
  }
}
