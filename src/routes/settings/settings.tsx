import './settings.scss';

import { Tab, TabContent, Tabs, TabTitleText, Title, TitleSizes } from '@patternfly/react-core';
import type { Query } from 'api/queries/query';
import { getQueryRoute, parseQuery } from 'api/queries/query';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Calculations } from 'routes/settings/calculations';
import { CostModelsDetails } from 'routes/settings/costModels';
import { TagDetails } from 'routes/settings/tagDetails';
import { createMapStateToProps } from 'store/common';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

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

type SettingsOwnProps = RouterComponentProps & WrappedComponentProps;

interface SettingsDispatchProps {
  // TBD...
}

interface SettingsStateProps {
  query: Query;
  tabKey?: number;
}

interface AvailableTab {
  contentRef: React.ReactNode;
  tab: SettingsTab;
}

interface SettingsState {
  activeTabKey?: number;
}

type SettingsProps = SettingsOwnProps & SettingsStateProps & SettingsDispatchProps;

class SettingsBase extends React.Component<SettingsProps, SettingsState> {
  protected defaultState: SettingsState = {
    activeTabKey: 0,
  };
  public state: SettingsState = { ...this.defaultState };

  public componentDidMount() {
    const { tabKey } = this.props;

    this.setState({
      activeTabKey: tabKey,
    });
  }

  private getAvailableTabs = () => {
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

  private getRouteForQuery = (query: Query) => {
    const { router } = this.props;

    return `${router.location.pathname}?${getQueryRoute(query)}`;
  };

  private getTab = (tab: SettingsTab, contentRef, index: number) => {
    return (
      <Tab
        eventKey={index}
        key={`${getIdKeyForTab(tab)}-tab`}
        tabContentId={`tab-${index}`}
        tabContentRef={contentRef}
        title={<TabTitleText>{this.getTabTitle(tab)}</TabTitleText>}
      />
    );
  };

  private getTabContent = (availableTabs: AvailableTab[]) => {
    return availableTabs.map((val, index) => {
      return (
        <TabContent
          eventKey={index}
          key={`${getIdKeyForTab(val.tab)}-tabContent`}
          id={`tab-${index}`}
          ref={val.contentRef as any}
        >
          {this.getTabItem(val.tab, index)}
        </TabContent>
      );
    });
  };

  private getTabItem = (tab: SettingsTab, index: number) => {
    const { activeTabKey } = this.state;

    const emptyTab = <></>; // Lazily load tabs

    if (activeTabKey !== index) {
      return emptyTab;
    }

    const currentTab = getIdKeyForTab(tab);
    if (currentTab === SettingsTab.costModels) {
      return <CostModelsDetails />;
    } else if (currentTab === SettingsTab.calculations) {
      return <Calculations />;
    } else if (currentTab === SettingsTab.tags) {
      return <TagDetails />;
    } else if (currentTab === SettingsTab.costCategory) {
      return <CostCategory />;
    } else {
      return emptyTab;
    }
  };

  private getTabs = (availableTabs: AvailableTab[]) => {
    const { activeTabKey } = this.state;

    return (
      <Tabs activeKey={activeTabKey} onSelect={this.handleTabClick}>
        {availableTabs.map((val, index) => this.getTab(val.tab, val.contentRef, index))}
      </Tabs>
    );
  };

  private getTabTitle = (tab: SettingsTab) => {
    const { intl } = this.props;

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

  private handleTabClick = (event, tabIndex) => {
    const { query, router } = this.props;
    const { activeTabKey } = this.state;

    if (activeTabKey !== tabIndex) {
      this.setState(
        {
          activeTabKey: tabIndex,
        },
        () => {
          const newQuery = {
            ...JSON.parse(JSON.stringify(query)),
            tabKey: tabIndex,
          };
          router.navigate(this.getRouteForQuery(newQuery), { replace: true });
        }
      );
    }
  };

  public render() {
    const { intl } = this.props;

    const availableTabs = this.getAvailableTabs();
    const title = intl.formatMessage(messages.settingsTitle);

    return (
      <div className="tabsOverride">
        <header style={styles.header}>
          <div style={styles.headerContent}>
            <Title headingLevel="h1" size={TitleSizes['2xl']}>
              {title}
            </Title>
          </div>
          <div style={styles.tabs}>{this.getTabs(availableTabs)}</div>
        </header>
        <div>{this.getTabContent(availableTabs)}</div>
      </div>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<SettingsOwnProps, SettingsStateProps>((state, { router }) => {
  const queryFromRoute = parseQuery<Query>(router.location.search);
  const tabKey = queryFromRoute.tabKey && !Number.isNaN(queryFromRoute.tabKey) ? Number(queryFromRoute.tabKey) : 0;

  const query = {
    ...queryFromRoute,
  };

  return {
    query,
    tabKey,
  };
});

const mapDispatchToProps: SettingsDispatchProps = {
  // TBD...
};

const Settings = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(SettingsBase)));

export default Settings;
