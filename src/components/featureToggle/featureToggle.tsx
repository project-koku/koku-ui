import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useUnleashClient } from '@unleash/proxy-client-react';
import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FeatureToggleActions } from 'store/featureToggle';

export const enum FeatureToggle {
  debug = 'cost-management.ui.debug',
  exports = 'cost-management.ui.exports', // Async exports https://issues.redhat.com/browse/COST-2223
  systems = 'cost-management.ui.systems', // Systems https://issues.redhat.com/browse/COST-5718
}

const useIsToggleEnabled = (toggle: FeatureToggle) => {
  const client = useUnleashClient();
  return client.isEnabled(toggle);
};

export const useIsDebugToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.debug);
};

export const useIsExportsToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.exports);
};

export const useIsSystemsToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.systems);
};

// The FeatureToggle component saves feature toggles in store for places where Unleash hooks not available
export const useFeatureToggle = () => {
  const dispatch = useDispatch();
  const { auth } = useChrome();

  const isDebugToggleEnabled = useIsDebugToggleEnabled();
  const isExportsToggleEnabled = useIsExportsToggleEnabled();
  const isSystemsToggleEnabled = useIsSystemsToggleEnabled();

  const fetchUser = callback => {
    auth.getUser().then(user => {
      callback((user as any).identity);
    });
  };

  useLayoutEffect(() => {
    // Workaround for code that doesn't use hooks
    dispatch(
      FeatureToggleActions.setFeatureToggle({
        isDebugToggleEnabled,
        isExportsToggleEnabled,
        isSystemsToggleEnabled,
      })
    );
    if (isDebugToggleEnabled) {
      // eslint-disable-next-line no-console
      fetchUser(identity => console.log('User identity:', identity));
    }
  }, [isDebugToggleEnabled, isExportsToggleEnabled, isSystemsToggleEnabled]);
};

export default useFeatureToggle;
