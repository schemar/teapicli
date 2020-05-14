export default class Request {
  public readonly name: string;

  public readonly method: "get" | "post";

  public readonly url: string;

  public readonly body: string;

  public readonly headers: { [key: string]: string };

  constructor({
    name,
    method,
    url,
    body,
    headers,
  }: {
    name: string;
    method: "get" | "post";
    url: string;
    body: string;
    headers: { [key: string]: string };
  }) {
    this.name = name;
    this.method = method;
    this.url = url;
    this.body = body;
    this.headers = headers;
  }
}
