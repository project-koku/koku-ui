import { PageSection, Tab, TabContent, Tabs, TabTitleText } from '@patternfly/react-core';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import { useIsEfficiencyToggleEnabled } from 'components/featureToggle';
import messages from 'locales/messages';
import type { RefObject } from 'react';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import type { ChromeComponentProps } from 'utils/chrome';
import { withChrome } from 'utils/chrome';
import { useQueryState } from 'utils/hooks';

import { Efficiency } from './efficiency';
import { styles } from './optimizations.styles';
import { OptimizationsDetails } from './optimizationsDetails';

const enum OptimizationsTab {
  efficiency = 'efficiency',
  optimizations = 'optimizations',
}

export const getIdKeyForTab = (tab: OptimizationsTab) => {
  switch (tab) {
    case OptimizationsTab.efficiency:
      return 'efficiency';
    case OptimizationsTab.optimizations:
      return 'optimizations';
  }
};

interface AvailableTab {
  contentRef: RefObject<any>;
  tab: OptimizationsTab;
}

interface OptimizationsOwnProps extends ChromeComponentProps {
  // TBD...
}

export interface OptimizationsMapProps {
  // TBD...
}

export interface OptimizationsStateProps {
  activeTabKeyState?: number;
}

type OptimizationsProps = OptimizationsOwnProps;

const Optimizations: React.FC<OptimizationsProps> = () => {
  const { activeTabKeyState = 0 } = useMapToProps();
  const [activeTabKey, setActiveTabKey] = useState(activeTabKeyState);
  const isEfficiencyToggleEnabled = useIsEfficiencyToggleEnabled();
  const intl = useIntl();

  const getAvailableTabs = () => {
    const availableTabs: AvailableTab[] = [
      {
        contentRef: React.createRef(),
        tab: OptimizationsTab.efficiency,
      },
      {
        contentRef: React.createRef(),
        tab: OptimizationsTab.optimizations,
      },
    ];
    return availableTabs;
  };

  const getTab = (tab: OptimizationsTab, contentRef, index: number) => {
    return (
      <Tab
        eventKey={index}
        key={`${getIdKeyForTab(tab)}-tab`}
        tabContentId={`tab-${index}`}
        tabContentRef={contentRef}
        title={<TabTitleText>{getTabTitle(tab)}</TabTitleText>}
      />
    );
  };

  const getTabContent = (availableTabs: AvailableTab[]) => {
    return availableTabs.map((val, index) => {
      return (
        <TabContent
          eventKey={index}
          key={`${getIdKeyForTab(val.tab)}-tabContent`}
          id={`tab-${index}`}
          ref={val.contentRef as any}
        >
          {getTabItem(val.tab, index)}
        </TabContent>
      );
    });
  };

  const getTabItem = (tab: OptimizationsTab, index: number) => {
    const emptyTab = <></>; // Lazily load tabs

    if (activeTabKey !== index) {
      return emptyTab;
    }

    const currentTab = getIdKeyForTab(tab);
    if (currentTab === OptimizationsTab.efficiency) {
      return <Efficiency />;
    } else if (currentTab === OptimizationsTab.optimizations) {
      return <OptimizationsDetails activeTabKey={activeTabKey} isHeaderHidden={true} />;
    } else {
      return emptyTab;
    }
  };

  const getTabs = (availableTabs: AvailableTab[]) => {
    return (
      <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
        {availableTabs.map((val, index) => getTab(val.tab, val.contentRef, index))}
      </Tabs>
    );
  };

  const getTabTitle = (tab: OptimizationsTab) => {
    if (tab === OptimizationsTab.efficiency) {
      return intl.formatMessage(messages.efficiency);
    } else if (tab === OptimizationsTab.optimizations) {
      return intl.formatMessage(messages.optimizations);
    }
  };

  const handleTabClick = (event, tabIndex) => {
    if (activeTabKey !== tabIndex) {
      setActiveTabKey(tabIndex);
    }
  };

  const availableTabs = getAvailableTabs();

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
          <div style={styles.tabs}>{getTabs(availableTabs)}</div>
        </header>
      </PageSection>
      <PageSection>{getTabContent(availableTabs)}</PageSection>
    </>
  );
};

export const useMapToProps = (): OptimizationsStateProps => {
  const queryState = useQueryState('optimizations');

  return {
    activeTabKeyState: queryState?.activeTabKey,
  };
};

export default withChrome(Optimizations);
