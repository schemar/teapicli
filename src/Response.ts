export default interface Response {
  readonly status: number;
  readonly headers: { [key: string]: string };
  readonly body: string;
}
