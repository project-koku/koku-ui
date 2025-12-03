import { getUserAccessQuery } from '@koku-ui/api/queries/userAccessQuery';
import type { UserAccess } from '@koku-ui/api/userAccess';
import { UserAccessType } from '@koku-ui/api/userAccess';
import messages from '@koku-ui/i18n/locales/messages';
import { PageSection, Tab, TabContent, Tabs, TabTitleText, Title, TitleSizes } from '@patternfly/react-core';
import type { AxiosError } from 'axios';
import type { RefObject } from 'react';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import { routes } from '../../routes';
import type { RootState } from '../../store';
import { FetchStatus } from '../../store/common';
import { userAccessQuery, userAccessSelectors } from '../../store/userAccess';
import { formatPath } from '../../utils/paths';
import { hasCostModelAccess, hasSettingsAccess } from '../../utils/userAccess';
import { NotAuthorized } from '../components/page/notAuthorized';
import { LoadingState } from '../components/state/loadingState';
import { Calculations } from './calculations';
import { CostCategory } from './costCategory';
import { CostModelsDetails } from './costModels';
import { PlatformProjects } from './platformProjects';
import { styles } from './settings.styles';
import { TagLabels } from './tagLabels';

const enum SettingsTab {
  costModels = 'cost_models',
  calculations = 'calculations',
  costCategory = 'cost_category',
  platformProjects = 'platform_projects',
  tags = 'tags',
}

export const getIdKeyForTab = (tab: SettingsTab) => {
  switch (tab) {
    case SettingsTab.costModels:
      return 'cost_models';
    case SettingsTab.calculations:
      return 'calculations';
    case SettingsTab.costCategory:
      return 'cost_category';
    case SettingsTab.platformProjects:
      return 'platform_projects';
    case SettingsTab.tags:
      return 'tags';
  }
};

interface AvailableTab {
  contentRef: RefObject<any>;
  tab: SettingsTab;
}

interface SettingsOwnProps {
  // TBD...
}

export interface SettingsMapProps {
  // TBD...
}

export interface SettingsStateProps {
  userAccess: UserAccess;
  userAccessError: AxiosError;
  userAccessFetchStatus: FetchStatus;
  userAccessQueryString: string;
}

type SettingsProps = SettingsOwnProps;

const Settings: React.FC<SettingsProps> = () => {
  const [activeTabKey, setActiveTabKey] = useState(0);
  const { userAccess, userAccessFetchStatus } = useMapToProps();
  const intl = useIntl();

  const canWrite = () => {
    let result = false;
    if (userAccess) {
      const data = (userAccess.data as any).find(d => d.type === 'settings');
      result = data?.access && data?.write;
    }
    return result;
  };

  const getAvailableTabs = () => {
    const availableTabs: AvailableTab[] = [
      {
        contentRef: React.createRef(),
        tab: SettingsTab.costModels,
      },
      {
        contentRef: React.createRef(),
        tab: SettingsTab.calculations,
      },
      {
        contentRef: React.createRef(),
        tab: SettingsTab.tags,
      },
      {
        contentRef: React.createRef(),
        tab: SettingsTab.costCategory,
      },
      {
        contentRef: React.createRef(),
        tab: SettingsTab.platformProjects,
      },
    ];
    return availableTabs;
  };

  const getTab = (tab: SettingsTab, contentRef, index: number) => {
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

  const getTabItem = (tab: SettingsTab, index: number) => {
    const notAuthorized = <NotAuthorized pathname={formatPath(routes.settings.path)} />;
    const emptyTab = <></>; // Lazily load tabs

    if (activeTabKey !== index) {
      return emptyTab;
    }

    const currentTab = getIdKeyForTab(tab);
    if (currentTab === SettingsTab.costModels) {
      return hasCostModelAccess(userAccess) ? (
        <CostModelsDetails />
      ) : (
        <NotAuthorized pathname={formatPath(routes.costModel.path)} />
      );
    } else if (currentTab === SettingsTab.calculations) {
      return hasSettingsAccess(userAccess) ? <Calculations canWrite={canWrite()} /> : notAuthorized;
    } else if (currentTab === SettingsTab.costCategory) {
      return hasSettingsAccess(userAccess) ? <CostCategory canWrite={canWrite()} /> : notAuthorized;
    } else if (currentTab === SettingsTab.platformProjects) {
      return hasSettingsAccess(userAccess) ? <PlatformProjects canWrite={canWrite()} /> : notAuthorized;
    } else if (currentTab === SettingsTab.tags) {
      return hasSettingsAccess(userAccess) ? <TagLabels canWrite={canWrite()} /> : notAuthorized;
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

  const getTabTitle = (tab: SettingsTab) => {
    if (tab === SettingsTab.calculations) {
      return intl.formatMessage(messages.currencyCalcuationsTitle);
    } else if (tab === SettingsTab.costCategory) {
      return intl.formatMessage(messages.costCategoryTitle);
    } else if (tab === SettingsTab.costModels) {
      return intl.formatMessage(messages.costModels);
    } else if (tab === SettingsTab.platformProjects) {
      return intl.formatMessage(messages.platformProjectsTitle);
    } else if (tab === SettingsTab.tags) {
      return intl.formatMessage(messages.tagLabelsTitle);
    }
  };

  const handleTabClick = (event, tabIndex) => {
    if (activeTabKey !== tabIndex) {
      setActiveTabKey(tabIndex);
    }
  };

  const availableTabs = getAvailableTabs();

  return (
    <>
      <PageSection style={styles.headerContainer}>
        <header>
          <div style={styles.headerContent}>
            <Title headingLevel="h1" size={TitleSizes['2xl']}>
              {intl.formatMessage(messages.settingsTitle)}
            </Title>
          </div>
          {userAccessFetchStatus === FetchStatus.inProgress ? (
            <LoadingState />
          ) : (
            <div style={styles.tabs}>{getTabs(availableTabs)}</div>
          )}
        </header>
      </PageSection>
      <PageSection>{getTabContent(availableTabs)}</PageSection>
    </>
  );
};

const useMapToProps = (): SettingsStateProps => {
  const userAccessQueryString = getUserAccessQuery(userAccessQuery);
  const userAccess = useSelector((state: RootState) =>
    userAccessSelectors.selectUserAccess(state, UserAccessType.all, userAccessQueryString)
  );
  const userAccessError = useSelector((state: RootState) =>
    userAccessSelectors.selectUserAccessError(state, UserAccessType.all, userAccessQueryString)
  );
  const userAccessFetchStatus = useSelector((state: RootState) =>
    userAccessSelectors.selectUserAccessFetchStatus(state, UserAccessType.all, userAccessQueryString)
  );

  return {
    userAccess,
    userAccessError,
    userAccessFetchStatus,
    userAccessQueryString,
  };
};

export default Settings;
