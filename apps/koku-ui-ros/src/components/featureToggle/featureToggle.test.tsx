import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { useUnleashClient } from '@unleash/proxy-client-react';

import { createMockStoreCreator } from 'store/mockStore';
import { featureToggleReducer, featureToggleSelectors, featureToggleStateKey } from 'store/featureToggle';

import useFeatureToggle, { useIsDebugToggleEnabled, useIsNamespaceToggleEnabled } from './featureToggle';
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
    isEnabled.mockImplementation((toggle: string) => toggle === FeatureToggleType.debug);

    const store = createUIStore();
    const { result } = renderHook(
      () => ({
        debug: useIsDebugToggleEnabled(),
        namespace: useIsNamespaceToggleEnabled(),
      }),
      { wrapper: wrapperFor(store) }
    );

    expect(result.current.debug).toBe(true);
    expect(result.current.namespace).toBe(false);
    expect(isEnabled).toHaveBeenCalledWith(FeatureToggleType.debug);
    expect(isEnabled).toHaveBeenCalledWith(FeatureToggleType.namespace);
  });

  it('returns false when Unleash client is missing', () => {
    (useUnleashClient as jest.Mock).mockReturnValue(undefined);

    const store = createUIStore();
    const { result } = renderHook(() => useIsDebugToggleEnabled(), {
      wrapper: wrapperFor(store),
    });

    expect(result.current).toBe(false);
  });

  it('dispatches Unleash toggle values into the store', async () => {
    isEnabled.mockImplementation((toggle: string) => toggle === FeatureToggleType.namespace);

    const store = createUIStore();
    renderHook(() => useFeatureToggle(), { wrapper: wrapperFor(store) });

    await waitFor(() => {
      expect(featureToggleSelectors.selectIsNamespaceToggleEnabled(store.getState())).toBe(true);
      expect(featureToggleSelectors.selectIsDebugToggleEnabled(store.getState())).toBe(false);
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
