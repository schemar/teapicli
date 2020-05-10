import { ScreenBuffer } from 'terminal-kit';
import Color from '../Color';
import Panel from './Panel';

export default class EnvironmentsPanel implements Panel {
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
    // Height minust collections and status line:
    this.height = (this.parent.getHeight() - 4);
    this.buffer = new ScreenBuffer({
      dst: this.parent.getBuffer(),
      width: this.width,
      height: this.height,
      x: 0,
      y: 3, // Below collections panel.
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
