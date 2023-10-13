declare let insights: Insights;

interface Chrome {
  appNavClick: ({ id: string, secondaryNav: boolean }) => void;
  init: () => void;
  identifyApp: (appId: string) => void;
  isBeta: () => boolean;
  isProd: () => boolean;
  navigation: (navFunc: any) => void;
  on: (event: string, eventFunc: any) => () => void;
  appAction: (pageName: string) => void;
  appObjectId: (params: string) => void;
  visibilityFunctions: {
    hasPermissions: (permissions: string[]) => Promise<boolean>;
  };
}

interface Insights {
  chrome: Chrome;
}
