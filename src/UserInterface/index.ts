import * as terminalKit from 'terminal-kit';
import { Events, Topic } from '../Events';
import Panels from './Panels';

export default class UserInterface {
    private term: terminalKit.Terminal;

    private panels: Panels;

    public constructor() {
      this.term = terminalKit.terminal;
      this.panels = new Panels(this.term);
    }

    public start(): void {
      this.term.fullscreen(true);
      this.term.windowTitle('apitecli');
      this.term.grabInput(true);
      this.term.hideCursor(true);

      this.term.on('resize', () => {
        this.panels.redrawAll();
      });

      this.term.on('key', (name: string) => {
        if (name === 'CTRL_C') {
          Events.publish(Topic.Error, { message: 'Received <c-c>' });
          this.terminate();
        }

        if (name === 'r') {
          this.panels.redrawAll();
        }

        if (name === 'q') {
          this.terminate();
        }
      });
    }

    private terminate(): void {
      this.term.hideCursor(false);
      this.term.grabInput(false);
      setTimeout(() => { process.exit(); }, 100);

      this.term.on('key', (name: string) => {
        // <c-c> while terminating forces an exit:
        if (name === 'CTRL_C') {
          process.exit(1);
        }
      });
    }
}
