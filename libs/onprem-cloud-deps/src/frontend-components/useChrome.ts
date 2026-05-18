/** Minimal chrome shape from host `window.insights.chrome` (no global Window augmentation required). */
type InsightsChrome = {
  updateDocumentTitle?: (title?: string) => void;
  auth?: {
    getUser?: () => Promise<unknown>;
    getToken?: () => Promise<string>;
  };
  getUserPermissions?: () => Promise<unknown[]>;
  getEnvironment?: () => string;
  getEnvironmentDetails?: () => Promise<unknown>;
  on?: (...args: unknown[]) => void;
  appNavClick?: (...args: unknown[]) => void;
  quickStarts?: {
    set?: (...args: unknown[]) => void;
    toggle?: (...args: unknown[]) => void;
    Catalog?: () => null;
  };
};

const getInsightsChrome = (): InsightsChrome | undefined =>
  (window as Window & { insights?: { chrome?: InsightsChrome } }).insights?.chrome;

/**
 * Stable chrome API object. IAM hooks (usePlatformAuth, useIdentity, RBACHook) depend on
 * referential equality; returning a new object each call caused infinite re-renders in IamV1.
 */
const chromeApi = {
  updateDocumentTitle: (title?: string) => {
    getInsightsChrome()?.updateDocumentTitle?.(title);
  },
  auth: {
    getUser: async () =>
      (await getInsightsChrome()?.auth?.getUser?.()) ?? {
        identity: { user: { is_org_admin: true } },
      },
    getToken: async () => (await getInsightsChrome()?.auth?.getToken?.()) ?? '',
  },
  getUserPermissions: async () => (await getInsightsChrome()?.getUserPermissions?.()) ?? [],
  getEnvironment: () => getInsightsChrome()?.getEnvironment?.() ?? 'prod',
  getEnvironmentDetails: async () => (await getInsightsChrome()?.getEnvironmentDetails?.()) ?? {},
  on: () => {},
  appNavClick: () => {},
  quickStarts: getInsightsChrome()?.quickStarts ?? {
    set: () => {},
    toggle: () => {},
    Catalog: () => null,
  },
};

export const useChrome = () => chromeApi;

export default useChrome;
