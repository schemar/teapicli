import { ScreenBuffer } from 'terminal-kit';
import { Events, Topic } from '../../Events';
import Color from '../Color';
import Panel from './Panel';
import { Collection } from '../../Collections';

export default class CollectionsPanel implements Panel {
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
    this.height = 3;
    this.buffer = new ScreenBuffer({
      dst: this.parent.getBuffer(),
      width: this.width,
      height: this.height,
      x: 0,
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
    'Collection:');
    this.drawBorder();
  }

  public update(): void {
    this.buffer.draw({ delta: true });
    this.parent.update();
  }

  private newCollection({ collection }: {collection: Collection.default}): void {
    this.buffer.put({
      x: 0,
      y: 1,
      dx: 1,
      dy: 0,
      wrap: false,
      attr: { bgDefaultColor: true, defaultColor: true },
    },
    collection.name);
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
    this.buffer.put(
      {
        x: this.width - 1,
        y: 0,
        dx: 0,
        dy: 1,
        wrap: false,
        attr: { bgDefaultColor: true, color: Color.Foreground },
      },
      '|||',
    );
    this.update();
  }
}
