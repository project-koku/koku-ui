declare let insights: Insights;

interface Chrome {
  init: () => void;
  identifyApp: (appId: string) => void;
  navigation: (navFunc: any) => void;
  on: (event: string, eventFunc: any) => () => void;
}

interface Insights {
  chrome: Chrome;
}
