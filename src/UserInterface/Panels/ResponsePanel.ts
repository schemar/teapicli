import { ScreenBuffer } from 'terminal-kit';
import Panel from './Panel';

export default class ResponsePanel implements Panel {
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
    // Minus current request and status line:
    this.height = (this.parent.getHeight() / 2) - 1;
    this.buffer = new ScreenBuffer({
      dst: this.parent.getBuffer(),
      width: this.width,
      height: this.height,
      x: (this.parent.getWidth() / 4) * 2, // Right of collections and requests.
      y: (this.parent.getHeight() / 2),
    });
    this.buffer.fill({
      attr: { bgDefaultColor: true },
    });
  }

  public update(): void {
    this.buffer.draw({ delta: true });
    this.parent.update();
  }
}
