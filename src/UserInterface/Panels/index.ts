import { Terminal } from 'terminal-kit';
import Panel from './Panel';
import MainPanel from './MainPanel';
import StatusLinePanel from './StatusLinePanel';
import CollectionsPanel from './CollectionsPanel';
import EnvironmentsPanel from './EnvironmentsPanel';
import RequestsPanel from './RequestsPanel';
import CurrentRequestPanel from './CurrentRequestPanel';
import ResponsePanel from './ResponsePanel';

export default class Panels {
  private readonly terminal: Terminal;

  private mainPanel: Panel;

  private collectionsPanel: Panel;

  private statusLinePanel: Panel;

  private environmentsPanel: Panel;

  private requestsPanel: Panel;

  private currentRequestPanel: Panel;

  private responsePanel: Panel;

  public constructor(terminal: Terminal) {
    this.terminal = terminal;

    this.mainPanel = new MainPanel(this.terminal);
    this.statusLinePanel = new StatusLinePanel(this.mainPanel);
    this.collectionsPanel = new CollectionsPanel(this.mainPanel);
    this.environmentsPanel = new EnvironmentsPanel(this.mainPanel);
    this.requestsPanel = new RequestsPanel(this.mainPanel);
    this.currentRequestPanel = new CurrentRequestPanel(this.mainPanel);
    this.responsePanel = new ResponsePanel(this.mainPanel);
  }

  public redrawAll(): void {
    this.mainPanel.init();
    this.statusLinePanel.init();
    this.collectionsPanel.init();
    this.environmentsPanel.init();
    this.requestsPanel.init();
    this.currentRequestPanel.init();
    this.responsePanel.init();
  }
}
