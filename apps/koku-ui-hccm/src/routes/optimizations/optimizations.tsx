import { PageSection, Tab, Tabs, TabTitleText } from '@patternfly/react-core';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import { RosType } from 'api/ros';
import { useIsEfficiencyToggleEnabled } from 'components/featureToggle';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { routes } from 'routes';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { rosActions, rosSelectors } from 'store/ros';
import type { ChromeComponentProps } from 'utils/chrome';
import { withChrome } from 'utils/chrome';
import { formatPath } from 'utils/paths';

import { Efficiency } from './efficiency';
import { styles } from './optimizations.styles';
import { OptimizationsDetails } from './optimizationsDetails';

interface OptimizationsOwnProps extends ChromeComponentProps {
  // TBD...
}

export interface OptimizationsStateProps {
  isRosAvailable?: boolean;
}

type OptimizationsProps = OptimizationsOwnProps;

const Optimizations: React.FC<OptimizationsProps> = () => {
  const intl = useIntl();
  const location = useLocation();
  const navigate = useNavigate();

  const isEfficiencyToggleEnabled = useIsEfficiencyToggleEnabled();

  // Initialize from location state if available (e.g. page reload or direct link)
  const [activeTabKey, setActiveTabKey] = useState<number>(location?.state?.efficiencyState?.activeTabKey ?? 0);

  const { isRosAvailable } = useMapToProps();

  // Sync activeTabKey whenever the location.key changes (i.e. any navigation —
  // push or replace — including clicks on the CPU-table link). We only update
  // when efficiencyState.activeTabKey is explicitly present so that internal
  // navigations from the remote MFE component don't inadvertently reset the tab.
  useEffect(() => {
    const nextTabKey = location?.state?.efficiencyState?.activeTabKey;
    if (nextTabKey !== undefined) {
      setActiveTabKey(nextTabKey);
    }
  }, [location.key]);

  const handleTabClick = (_event, tabIndex) => {
    // Immediately update local state so the tab header responds without waiting
    // for the navigation round-trip.
    setActiveTabKey(tabIndex);
    // Drop optimizationsDetailsState so filters are not restored when returning
    // to the optimizations tab. Links that intentionally set filter_by (e.g.
    // from the efficiency table) still navigate via Link, not this handler.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { optimizationsDetailsState: _omitted, ...restState } = location?.state || {};
    navigate(formatPath(routes.optimizations.path), {
      replace: true,
      state: {
        ...restState,
        efficiencyState: {
          ...(restState.efficiencyState || {}),
          activeTabKey: tabIndex,
        },
      },
    });
  };

  return (
    <>
      <PageSection style={styles.headerContainer}>
        <header>
          <div style={styles.headerContent}>
            <AsyncComponent scope="costManagementRos" module="./OptimizationsDetailsTitle" />
          </div>
          {isEfficiencyToggleEnabled && (
            <div style={styles.tabs}>
              <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
                <Tab eventKey={0} title={<TabTitleText>{intl.formatMessage(messages.efficiency)}</TabTitleText>} />
                {isRosAvailable && (
                  <Tab eventKey={1} title={<TabTitleText>{intl.formatMessage(messages.optimizations)}</TabTitleText>} />
                )}
              </Tabs>
            </div>
          )}
        </header>
      </PageSection>
      {isEfficiencyToggleEnabled ? (
        <PageSection>
          {activeTabKey === 0 && <Efficiency />}
          {activeTabKey === 1 && <OptimizationsDetails activeTabKey={1} />}
        </PageSection>
      ) : (
        <OptimizationsDetails />
      )}
    </>
  );
};

const useMapToProps = (): OptimizationsStateProps => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();

  const isRosAvailable = useSelector((state: RootState) =>
    rosSelectors.selectRosAvailable(state, RosType.openApi, undefined)
  );
  const rosFetchStatus = useSelector((state: RootState) =>
    rosSelectors.selectRosFetchStatus(state, RosType.openApi, undefined)
  );

  useEffect(() => {
    if (rosFetchStatus !== FetchStatus.inProgress) {
      dispatch(rosActions.fetchRos(RosType.openApi));
    }
  }, [dispatch]);

  return {
    isRosAvailable,
  };
};

export default withChrome(Optimizations);
