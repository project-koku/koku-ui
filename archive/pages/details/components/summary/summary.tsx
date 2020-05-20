import { Tab, Tabs } from '@patternfly/react-core';
import { ReportPathsType } from 'api/reports/report';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { SummaryView } from './summaryView';

interface SummaryOwnProps {
  availableTabs: string[];
  getIdKeyForTab: (tab: string) => string;
  filterBy: string | number;
  groupBy: string;
  reportPathsType: ReportPathsType;
}

interface SummaryState {
  activeTabKey: number;
}

type SummaryProps = SummaryOwnProps & InjectedTranslateProps;

class SummaryBase extends React.Component<SummaryProps> {
  public state: SummaryState = {
    activeTabKey: 0,
  };

  private handleTabClick = (event, tabIndex) => {
    this.setState({
      activeTabKey: tabIndex,
    });
  };

  private getAvailableTabs = () => {
    const { availableTabs, getIdKeyForTab, groupBy } = this.props;
    const tabs = [];

    availableTabs.forEach(tab => {
      if (groupBy !== getIdKeyForTab(tab)) {
        tabs.push(tab);
      }
    });
    return tabs;
  };

  private getTab = (tab: string, index: number) => {
    const { getIdKeyForTab } = this.props;

    return (
      <Tab
        eventKey={index}
        key={`${getIdKeyForTab(tab)}-tab`}
        title={this.getTabTitle(tab)}
      >
        {this.getTabItem(tab)}
      </Tab>
    );
  };

  private getTabItem = (tab: string) => {
    const { filterBy, getIdKeyForTab, groupBy, reportPathsType } = this.props;
    const { activeTabKey } = this.state;

    const availableTabs = this.getAvailableTabs();
    const activeTab = getIdKeyForTab(availableTabs[activeTabKey]);
    const currentTab = getIdKeyForTab(tab);

    if (activeTab === currentTab) {
      return (
        <SummaryView
          filterBy={filterBy}
          groupBy={currentTab}
          parentGroupBy={groupBy}
          reportPathsType={reportPathsType}
        />
      );
    } else {
      return null;
    }
  };

  private getTabs = () => {
    const availableTabs = this.getAvailableTabs();

    if (availableTabs) {
      return (
        <Tabs
          isFilled
          activeKey={this.state.activeTabKey}
          onSelect={this.handleTabClick}
        >
          {availableTabs.map((tab, index) => this.getTab(tab, index))}
        </Tabs>
      );
    } else {
      return null;
    }
  };

  private getTabTitle = (tab: string) => {
    const { getIdKeyForTab, t } = this.props;
    const key = getIdKeyForTab(tab) || '';

    return t('group_by.details', { groupBy: key });
  };

  public render() {
    return <>{this.getTabs()}</>;
  }
}

const Summary = translate()(SummaryBase);

export { Summary, SummaryProps };
