import { ScreenBuffer } from 'terminal-kit';
import Color from '../Color';
import Panel from './Panel';

export default class RequestsPanel implements Panel {
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
    this.drawBorder();
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

  public update(): void {
    this.buffer.draw({ delta: true });
    this.parent.update();
  }
}
