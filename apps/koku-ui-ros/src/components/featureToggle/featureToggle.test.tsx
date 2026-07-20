import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { useUnleashClient } from '@unleash/proxy-client-react';

import { createMockStoreCreator } from 'store/mockStore';
import { featureToggleReducer, featureToggleSelectors, featureToggleStateKey } from 'store/featureToggle';

import useFeatureToggle, {
  useIsBoxPlotToggleEnabled,
  useIsDebugToggleEnabled,
  useIsNamespaceToggleEnabled,
  useIsProjectLinkToggleEnabled,
} from './featureToggle';
import { FeatureToggleType } from './featureToggleType';

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: () => ({
    auth: {
      getUser: jest.fn(() =>
        Promise.resolve({
          identity: { account_number: '123456' },
        })
      ),
    },
  }),
}));

const createUIStore = createMockStoreCreator({
  [featureToggleStateKey]: featureToggleReducer,
});

const wrapperFor =
  (store: ReturnType<typeof createUIStore>) =>
  ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;

describe('featureToggle hooks', () => {
  const isEnabled = jest.fn();

  beforeEach(() => {
    isEnabled.mockReset();
    isEnabled.mockReturnValue(false);
    (useUnleashClient as jest.Mock).mockReturnValue({ isEnabled });
  });

  it('reports Unleash toggle state for each flag', () => {
    isEnabled.mockImplementation((toggle: string) => toggle === FeatureToggleType.boxPlot);

    const store = createUIStore();
    const { result } = renderHook(
      () => ({
        boxPlot: useIsBoxPlotToggleEnabled(),
        debug: useIsDebugToggleEnabled(),
        namespace: useIsNamespaceToggleEnabled(),
        projectLink: useIsProjectLinkToggleEnabled(),
      }),
      { wrapper: wrapperFor(store) }
    );

    expect(result.current.boxPlot).toBe(true);
    expect(result.current.debug).toBe(false);
    expect(isEnabled).toHaveBeenCalledWith(FeatureToggleType.boxPlot);
    expect(isEnabled).toHaveBeenCalledWith(FeatureToggleType.namespace);
  });

  it('returns false when Unleash client is missing', () => {
    (useUnleashClient as jest.Mock).mockReturnValue(undefined);

    const store = createUIStore();
    const { result } = renderHook(() => useIsBoxPlotToggleEnabled(), {
      wrapper: wrapperFor(store),
    });

    expect(result.current).toBe(false);
  });

  it('dispatches Unleash toggle values into the store', async () => {
    isEnabled.mockImplementation((toggle: string) => toggle === FeatureToggleType.projectLink);

    const store = createUIStore();
    renderHook(() => useFeatureToggle(), { wrapper: wrapperFor(store) });

    await waitFor(() => {
      expect(featureToggleSelectors.selectIsProjectLinkToggleEnabled(store.getState())).toBe(true);
      expect(featureToggleSelectors.selectIsBoxPlotToggleEnabled(store.getState())).toBe(false);
    });
  });

  it('logs identity when the debug toggle is enabled', async () => {
    isEnabled.mockImplementation((toggle: string) => toggle === FeatureToggleType.debug);
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);

    const store = createUIStore();
    renderHook(() => useFeatureToggle(), { wrapper: wrapperFor(store) });

    await waitFor(() => {
      expect(logSpy).toHaveBeenCalledWith('User identity:', { account_number: '123456' });
    });

    logSpy.mockRestore();
  });
});
