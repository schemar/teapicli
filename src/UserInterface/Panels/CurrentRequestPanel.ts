import { ScreenBuffer } from 'terminal-kit';
import Color from '../Color';
import Panel from './Panel';

export default class CurrentRequestPanel implements Panel {
  private width!: number;

  private height!: number;

  private readonly parent: Panel;

  private buffer!: ScreenBuffer;

  public constructor(parent: Panel) {
    this.parent = parent;

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

  public update(): void {
    this.buffer.draw({ delta: true });
    this.parent.update();
  }
}
