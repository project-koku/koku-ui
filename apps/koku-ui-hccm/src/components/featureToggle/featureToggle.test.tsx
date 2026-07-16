import { renderHook, waitFor } from '@testing-library/react';
import { useUnleashClient } from '@unleash/proxy-client-react';
import React from 'react';
import { Provider } from 'react-redux';

import { FeatureToggleReducer, FeatureToggleSelectors, FeatureToggleStateKey } from 'store/featureToggle';
import { createMockStoreCreator } from 'store/mockStore';

import {
  useFeatureToggle,
  useIsAwsEc2InstancesToggleEnabled,
  useIsDebugToggleEnabled,
  useIsDisplayToggleEnabled,
  useIsEfficiencyToggleEnabled,
  useIsExactFilterToggleEnabled,
  useIsExportsToggleEnabled,
  useIsGpuToggleEnabled,
  useIsMigToggleEnabled,
  useIsNamespaceToggleEnabled,
  useIsOrgAdmin,
  useIsPriceListRatesToggleEnabled,
  useIsPriceListToggleEnabled,
  useIsSystemsToggleEnabled,
  useIsWastedCostToggleEnabled,
} from './featureToggle';
import { FeatureToggleType } from './featureToggleType';

const mockGetUser = jest.fn(() =>
  Promise.resolve({
    identity: {
      user: { is_org_admin: true },
    },
  })
);

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: () => ({
    auth: {
      getUser: (...args: unknown[]) => mockGetUser(...args),
    },
  }),
}));

const createUIStore = createMockStoreCreator({
  [FeatureToggleStateKey]: FeatureToggleReducer,
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
    mockGetUser.mockReset();
    mockGetUser.mockResolvedValue({
      identity: {
        user: { is_org_admin: true },
      },
    });
  });

  it('reports Unleash toggle state for each flag', () => {
    isEnabled.mockImplementation((toggle: string) => toggle === FeatureToggleType.display);

    const store = createUIStore();
    const { result } = renderHook(
      () => ({
        awsEc2: useIsAwsEc2InstancesToggleEnabled(),
        debug: useIsDebugToggleEnabled(),
        display: useIsDisplayToggleEnabled(),
        efficiency: useIsEfficiencyToggleEnabled(),
        exactFilter: useIsExactFilterToggleEnabled(),
        exports: useIsExportsToggleEnabled(),
        gpu: useIsGpuToggleEnabled(),
        mig: useIsMigToggleEnabled(),
        namespace: useIsNamespaceToggleEnabled(),
        priceList: useIsPriceListToggleEnabled(),
        priceListRates: useIsPriceListRatesToggleEnabled(),
        systems: useIsSystemsToggleEnabled(),
        wastedCost: useIsWastedCostToggleEnabled(),
      }),
      { wrapper: wrapperFor(store) }
    );

    expect(result.current.display).toBe(true);
    expect(result.current.debug).toBe(false);
    expect(isEnabled).toHaveBeenCalledWith(FeatureToggleType.display);
    expect(isEnabled).toHaveBeenCalledWith(FeatureToggleType.awsEc2Instances);
  });

  it('returns false when Unleash client is missing', () => {
    (useUnleashClient as jest.Mock).mockReturnValue(undefined);

    const store = createUIStore();
    const { result } = renderHook(() => useIsDisplayToggleEnabled(), {
      wrapper: wrapperFor(store),
    });

    expect(result.current).toBe(false);
  });

  it('resolves org admin from chrome identity', async () => {
    const store = createUIStore();
    const { result } = renderHook(() => useIsOrgAdmin(), {
      wrapper: wrapperFor(store),
    });

    await waitFor(() => expect(result.current).toBe(true));
  });

  it('ignores org admin updates after unmount', async () => {
    let resolveUser: (value: unknown) => void = () => undefined;
    mockGetUser.mockImplementation(
      () =>
        new Promise(resolve => {
          resolveUser = resolve;
        })
    );

    const store = createUIStore();
    const { unmount } = renderHook(() => useIsOrgAdmin(), {
      wrapper: wrapperFor(store),
    });

    unmount();
    resolveUser({
      identity: {
        user: { is_org_admin: true },
      },
    });

    await Promise.resolve();
  });

  it('dispatches Unleash toggle values into the store', async () => {
    isEnabled.mockImplementation((toggle: string) => toggle === FeatureToggleType.systems);

    const store = createUIStore();
    renderHook(() => useFeatureToggle(), { wrapper: wrapperFor(store) });

    await waitFor(() => {
      expect(FeatureToggleSelectors.selectIsSystemsToggleEnabled(store.getState())).toBe(true);
      expect(FeatureToggleSelectors.selectIsDebugToggleEnabled(store.getState())).toBe(false);
    });
  });

  it('logs identity when the debug toggle is enabled', async () => {
    isEnabled.mockImplementation((toggle: string) => toggle === FeatureToggleType.debug);
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);

    const store = createUIStore();
    renderHook(() => useFeatureToggle(), { wrapper: wrapperFor(store) });

    await waitFor(() => {
      expect(logSpy).toHaveBeenCalledWith(
        'User identity:',
        expect.objectContaining({
          user: { is_org_admin: true },
        })
      );
    });

    logSpy.mockRestore();
  });
});
