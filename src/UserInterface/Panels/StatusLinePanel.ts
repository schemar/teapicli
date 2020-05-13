import { ScreenBuffer } from 'terminal-kit';
import Color from '../Color';
import { Events, Topic } from '../../Events';
import Panel from './Panel';

export default class StatusLinePanel implements Panel {
  private width!: number;

  private height!: number;

  private readonly parent: Panel;

  private buffer!: ScreenBuffer;

  public constructor(parent: Panel) {
    this.parent = parent;
    this.init();

    Events.subscribe(Topic.Error, (data: any) => {
      this.buffer.put(
        {
          x: 0,
          y: 0,
          attr: { bgColor: Color.BakcgroundLight, color: Color.Error },
          wrap: false,
          dx: 1,
          dy: 0,
        },
        data.message,
      );
      this.update();
    });
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
    this.width = this.parent.getWidth();
    this.height = 1;
    this.buffer = new ScreenBuffer({
      dst: this.parent.getBuffer(),
      width: this.width,
      height: this.height,
      x: 0,
      y: (this.parent.getHeight() - 1),
    });
    this.buffer.fill({
      attr: { bgColor: Color.BakcgroundLight },
    });
    this.update();
  }

  public update(): void {
    this.buffer.draw({ delta: true });
    this.parent.update();
  }
}
