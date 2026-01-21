import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useUnleashClient } from '@unleash/proxy-client-react';
import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { featureToggleActions } from 'store/featureToggle';

export const enum FeatureToggle {
  boxPlot = 'cost-management.koku-ui-ros.box-plot', // https://issues.redhat.com/browse/COST-4619
  debug = 'cost-management.koku-ui-ros.debug', // Logs user data (e.g., account ID) in browser console
  namespace = 'cost-management.koku-ui-ros.namespace', // Namespace recommendations https://issues.redhat.com/browse/COST-6267
  projectLink = 'cost-management.koku-ui-ros.project-link', // Optimizations breakdown project link https://issues.redhat.com/browse/COST-4527
}

const useIsToggleEnabled = (toggle: FeatureToggle) => {
  const client = useUnleashClient();
  return client.isEnabled(toggle);
};

export const useIsDebugToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.debug);
};

export const useIsBoxPlotToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.boxPlot);
};

export const useIsProjectLinkToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.projectLink);
};

export const useIsNamespaceToggleEnabled = () => {
  return useIsToggleEnabled(FeatureToggle.namespace);
};

// The FeatureToggle component saves feature toggles in store for places where Unleash hooks not available
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
