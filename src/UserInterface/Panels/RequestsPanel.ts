import { ScreenBuffer } from 'terminal-kit';
import { Events, Topic } from '../../Events';
import Color from '../Color';
import Panel from './Panel';
import { Collection, Request } from '../../Collections';

export default class RequestsPanel implements Panel {
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
    this.width = (this.parent.getWidth() / 4);
    // Height minus status line:
    this.height = (this.parent.getHeight() - 1);
    this.buffer = new ScreenBuffer({
      dst: this.parent.getBuffer(),
      width: this.width,
      height: this.height,
      x: (this.parent.getWidth() / 4), // Right of collections
      y: 0,
    });

    this.buffer.fill({
      attr: { bgDefaultColor: true },
    });
    this.buffer.put({
      x: 0,
      y: 0,
      dx: 1,
      dy: 0,
      wrap: false,
      attr: { bgDefaultColor: true, defaultColor: true },
    },
    'Requests:');

    this.drawBorder();
  }

  public update(): void {
    this.buffer.draw({ delta: true });
    this.parent.update();
  }

  private newCollection({ collection }: {collection: Collection.default}): void {
    let y = 1;
    collection.requests.forEach((request: Request.default) => {
      this.buffer.put({
        x: 0,
        y,
        dx: 1,
        dy: 0,
        wrap: false,
        attr: { bgDefaultColor: true, defaultColor: true },
      },
      request.name);
      y += 1;
    });
    this.update();
  }

  private drawBorder(): void {
    this.buffer.put(
      {
        x: this.width - 1,
        y: 0,
        dx: 0,
        dy: 1,
        wrap: false,
        attr: { bgDefaultColor: true, color: Color.Foreground },
      },
      '|'.repeat(this.height),
    );

    this.update();
  }
}
