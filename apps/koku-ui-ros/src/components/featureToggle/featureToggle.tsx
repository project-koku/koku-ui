import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useUnleashClient } from '@unleash/proxy-client-react';
import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { featureToggleActions } from 'store/featureToggle';

import { FeatureToggleType } from './featureToggleType';

const useIsToggleEnabled = (toggle: FeatureToggleType) => {
  const client = useUnleashClient();
  return client?.isEnabled?.(toggle) ?? false;
};

export const useIsDebugToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggleType.debug);
};

export const useIsBoxPlotToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggleType.boxPlot);
};

export const useIsProjectLinkToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggleType.projectLink);
};

export const useIsNamespaceToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggleType.namespace);
};

// FeatureToggle saves feature toggles in store for places where the Unleash hook is not available
const useFeatureToggle = () => {
  const dispatch = useDispatch();
  const { auth } = useChrome();

  const isDebugToggleEnabled = useIsDebugToggleEnabled();
  const isBoxPlotToggleEnabled = useIsBoxPlotToggleEnabled();
  const isNamespaceToggleEnabled = useIsNamespaceToggleEnabled();
  const isProjectLinkToggleEnabled = useIsProjectLinkToggleEnabled();

  const fetchUser = callback => {
    auth.getUser().then(user => {
      callback((user as any).identity);
    });
  };

  useLayoutEffect(() => {
    // Workaround for code that doesn't use hooks
    dispatch(
      featureToggleActions.setFeatureToggle({
        isDebugToggleEnabled,
        isBoxPlotToggleEnabled,
        isNamespaceToggleEnabled,
        isProjectLinkToggleEnabled,
      })
    );
    if (isDebugToggleEnabled) {
      // eslint-disable-next-line no-console
      fetchUser(identity => console.log('User identity:', identity));
    }
  }, [isDebugToggleEnabled, isBoxPlotToggleEnabled, isNamespaceToggleEnabled, isProjectLinkToggleEnabled]);
};

export default useFeatureToggle;
