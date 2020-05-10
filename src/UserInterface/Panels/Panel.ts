import { ScreenBuffer } from 'terminal-kit';

export default interface Panel {
  getWidth(): number;
  getHeight(): number;
  getBuffer(): ScreenBuffer;
  init(): void;
  update(): void;
} // eslint-disable-line semi
