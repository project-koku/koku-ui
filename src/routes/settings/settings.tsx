import './settings.scss';

import { Tab, TabContent, Tabs, TabTitleText, Title, TitleSizes } from '@patternfly/react-core';
import { getUserAccessQuery } from 'api/queries/userAccessQuery';
import type { UserAccess } from 'api/userAccess';
import { UserAccessType } from 'api/userAccess';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { routes } from 'routes';
import { Loading } from 'routes/components/page/loading';
import { NotAuthorized } from 'routes/components/page/notAuthorized';
import { Calculations } from 'routes/settings/calculations';
import { CostModelsDetails } from 'routes/settings/costModels';
import { TagDetails } from 'routes/settings/tagDetails';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { userAccessQuery, userAccessSelectors } from 'store/userAccess';
import type { ChromeComponentProps } from 'utils/chrome';
import { withChrome } from 'utils/chrome';
import { formatPath } from 'utils/paths';
import { hasCostModelAccess } from 'utils/userAccess';

import { CostCategory } from './costCategory';
import { styles } from './settings.styles';

// eslint-disable-next-line no-shadow
const enum SettingsTab {
  costModels = 'cost_models',
  calculations = 'calculations',
  costCategory = 'cost_category',
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
    case SettingsTab.tags:
      return 'tags';
  }
};

interface AvailableTab {
  contentRef: React.ReactNode;
  tab: SettingsTab;
}

interface SettingsOwnProps extends ChromeComponentProps {
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

const Settings: React.FC<SettingsProps> = ({ chrome }) => {
  const [activeTabKey, setActiveTabKey] = useState(0);
  const { userAccess, userAccessFetchStatus } = useMapToProps();
  const intl = useIntl();

  const getAvailableTabs = () => {
    const availableTabs = [
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
      return chrome.isOrgAdmin || hasCostModelAccess(userAccess) ? (
        <CostModelsDetails />
      ) : (
        <NotAuthorized pathname={formatPath(routes.costModel.path)} />
      );
    } else if (currentTab === SettingsTab.calculations) {
      return chrome.isOrgAdmin ? <Calculations /> : notAuthorized;
    } else if (currentTab === SettingsTab.tags) {
      return chrome.isOrgAdmin ? <TagDetails /> : notAuthorized;
    } else if (currentTab === SettingsTab.costCategory) {
      return chrome.isOrgAdmin ? <CostCategory /> : notAuthorized;
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
    if (tab === SettingsTab.costModels) {
      return intl.formatMessage(messages.costModels);
    } else if (tab === SettingsTab.calculations) {
      return intl.formatMessage(messages.currencyCalcuationsTitle);
    } else if (tab === SettingsTab.tags) {
      return intl.formatMessage(messages.tagLabelsTitle);
    } else if (tab === SettingsTab.costCategory) {
      return intl.formatMessage(messages.costCategoryTitle);
    }
  };

  const handleTabClick = (event, tabIndex) => {
    if (activeTabKey !== tabIndex) {
      setActiveTabKey(tabIndex);
    }
  };

  const availableTabs = getAvailableTabs();

  return (
    <div className="tabsOverride">
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Title headingLevel="h1" size={TitleSizes['2xl']}>
            {intl.formatMessage(messages.settingsTitle)}
          </Title>
        </div>
        {userAccessFetchStatus === FetchStatus.inProgress ? (
          <Loading />
        ) : (
          <div style={styles.tabs}>{getTabs(availableTabs)}</div>
        )}
      </header>
      <div>{getTabContent(availableTabs)}</div>
    </div>
  );
};

// eslint-disable-next-line no-empty-pattern
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

export default withChrome(Settings);
