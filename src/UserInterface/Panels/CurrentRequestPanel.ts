import { ScreenBuffer } from 'terminal-kit';
import { Events, Topic } from '../../Events';
import Color from '../Color';
import Panel from './Panel';
import { Collection, Request } from '../../Collections';

export default class CurrentRequestPanel implements Panel {
  private width!: number;

  private height!: number;

  private readonly parent: Panel;

  private buffer!: ScreenBuffer;

  public constructor(parent: Panel) {
    this.parent = parent;

    Events.subscribe(Topic.NewCollection, this.newCollection.bind(this));

    this.init();
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }

  public getBuffer(): ScreenBuffer {
    return this.buffer;
  }

  public init(): void {
    this.width = this.parent.getWidth() - ((this.parent.getWidth() / 4) * 2);
    this.height = (this.parent.getHeight() / 2);
    this.buffer = new ScreenBuffer({
      dst: this.parent.getBuffer(),
      width: this.width,
      height: this.height,
      x: (this.parent.getWidth() / 4) * 2, // Right of collections and requests.
      y: 0,
    });
    this.buffer.fill({
      attr: { bgDefaultColor: true },
    });
    this.drawBorder();
  }

  public update(): void {
    this.buffer.draw({ delta: true });
    this.parent.update();
  }

  private newCollection({ collection }: {collection: Collection.default}): void {
    // FIXME: request selection
    const request: Request.default = collection.requests[0];
    this.buffer.put({
      x: 0,
      y: 0,
      dx: 1,
      dy: 0,
      wrap: true,
      attr: { bgDefaultColor: true, defaultColor: true },
    },
    `Request: ${request.name}`);
    this.buffer.put({
      x: 0,
      y: 2,
      dx: 1,
      dy: 0,
      wrap: true,
      attr: { bgDefaultColor: true, defaultColor: true },
    },
    `Method: ${request.method}`);
    this.buffer.put({
      x: 0,
      y: 3,
      dx: 1,
      dy: 0,
      wrap: true,
      attr: { bgDefaultColor: true, defaultColor: true },
    },
    `URL: ${request.url}`);
    this.buffer.put({
      x: 0,
      y: 4,
      dx: 1,
      dy: 0,
      wrap: true,
      attr: { bgDefaultColor: true, defaultColor: true },
    },
    'Headers:'); // TODO: add headers
    this.buffer.put({
      x: 0,
      y: 5,
      dx: 1,
      dy: 0,
      wrap: true,
      attr: { bgDefaultColor: true, defaultColor: true },
    },
    'Body:'); // TODO: add body
    this.update();
  }

  private drawBorder(): void {
    this.buffer.put(
      {
        x: 0,
        y: this.height - 1,
        dx: 1,
        dy: 0,
        wrap: false,
        attr: { bgDefaultColor: true, color: Color.Foreground },
      },
      '-'.repeat(this.width),
    );

    this.update();
  }
}
