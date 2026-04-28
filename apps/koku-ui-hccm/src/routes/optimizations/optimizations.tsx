import { PageSection, Tab, Tabs, TabTitleText } from '@patternfly/react-core';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import { useIsEfficiencyToggleEnabled } from 'components/featureToggle';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import { routes } from 'routes';
import type { ChromeComponentProps } from 'utils/chrome';
import { withChrome } from 'utils/chrome';
import { formatPath } from 'utils/paths';

import { Efficiency } from './efficiency';
import { styles } from './optimizations.styles';
import { OptimizationsDetails } from './optimizationsDetails';

interface OptimizationsOwnProps extends ChromeComponentProps {
  // TBD...
}

type OptimizationsProps = OptimizationsOwnProps;

const Optimizations: React.FC<OptimizationsProps> = () => {
  const intl = useIntl();
  const location = useLocation();
  const navigate = useNavigate();
  const isEfficiencyToggleEnabled = useIsEfficiencyToggleEnabled();

  // Initialize from location state if available (e.g. page reload or direct link)
  const [activeTabKey, setActiveTabKey] = useState<number>(location?.state?.efficiencyState?.activeTabKey ?? 0);

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
    navigate(formatPath(routes.optimizations.path), {
      replace: true,
      state: {
        ...(location?.state || {}),
        efficiencyState: {
          ...(location?.state?.efficiencyState || {}),
          activeTabKey: tabIndex,
        },
      },
    });
  };

  if (!isEfficiencyToggleEnabled) {
    return <OptimizationsDetails />;
  }
  return (
    <>
      <PageSection style={styles.headerContainer}>
        <header>
          <div style={styles.headerContent}>
            <AsyncComponent scope="costManagementRos" module="./OptimizationsDetailsTitle" />
          </div>
          <div style={styles.tabs}>
            <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
              <Tab eventKey={0} title={<TabTitleText>{intl.formatMessage(messages.efficiency)}</TabTitleText>} />
              <Tab eventKey={1} title={<TabTitleText>{intl.formatMessage(messages.optimizations)}</TabTitleText>} />
            </Tabs>
          </div>
        </header>
      </PageSection>
      <PageSection>
        {activeTabKey === 0 && <Efficiency />}
        {activeTabKey === 1 && <OptimizationsDetails activeTabKey={1} isHeaderHidden={true} />}
      </PageSection>
    </>
  );
};

export default withChrome(Optimizations);
