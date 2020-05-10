import { ScreenBuffer, Terminal } from 'terminal-kit';
import Panel from './Panel';

export default class MainPanel implements Panel {
  private width!: number;

  private height!: number;

  private parent: Terminal;

  private buffer!: ScreenBuffer;

  public constructor(parent: Terminal) {
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
    this.width = this.parent.width;
    this.height = this.parent.height;
    this.buffer = new ScreenBuffer({
      dst: this.parent,
      height: this.parent.height,
      width: this.parent.width,
    });
    this.update();
  }

  public update(): void {
    // Without the timeout, the updated buffer will be empty.
    setTimeout(() => {
      this.buffer.draw({ delta: true });
    }, 1);
  }
}
