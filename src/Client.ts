import Request from "./Collections/Request";
import Response from "./Response";

export default interface Client {
  send(request: Request): Promise<Response>;
}
