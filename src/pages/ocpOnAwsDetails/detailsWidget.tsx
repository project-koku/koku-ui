import { Tab, Tabs } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import {
  ComputedOcpOnAwsReportItem,
  GetComputedOcpOnAwsReportItemsParams,
} from 'utils/getComputedOcpOnAwsReportItems';
import { DetailsWidgetView } from './detailsWidgetView';

interface DetailsWidgetOwnProps {
  availableTabs?: OcpOnAwsDetailsTab[];
  groupBy: string;
  item: ComputedOcpOnAwsReportItem;
}

interface DetailsWidgetState {
  activeTabKey: number;
}

type DetailsWidgetProps = DetailsWidgetOwnProps & InjectedTranslateProps;

export const getIdKeyForTab = (
  tab: OcpOnAwsDetailsTab
): GetComputedOcpOnAwsReportItemsParams['idKey'] => {
  switch (tab) {
    case OcpOnAwsDetailsTab.accounts:
      return 'account';
    case OcpOnAwsDetailsTab.projects:
      return 'project';
    case OcpOnAwsDetailsTab.regions:
      return 'region';
    case OcpOnAwsDetailsTab.services:
      return 'service';
  }
};

export const enum OcpOnAwsDetailsTab {
  accounts = 'accounts',
  projects = 'projects',
  regions = 'regions',
  services = 'services',
}

class DetailsWidgetBase extends React.Component<DetailsWidgetProps> {
  public state: DetailsWidgetState = {
    activeTabKey: 0,
  };

  private handleTabClick = (event, tabIndex) => {
    this.setState({
      activeTabKey: tabIndex,
    });
  };

  private getAvailableTabs = () => {
    const { availableTabs, groupBy } = this.props;
    const tabs = [];

    availableTabs.forEach(tab => {
      if (
        !(
          (groupBy === 'project' || groupBy === 'node') &&
          getIdKeyForTab(tab).toString() === 'project'
        )
      ) {
        tabs.push(tab);
      }
    });
    return tabs;
  };

  private getTab = (tab: OcpOnAwsDetailsTab, index: number) => {
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

  private getTabItem = (tab: OcpOnAwsDetailsTab) => {
    const { groupBy, item } = this.props;
    const { activeTabKey } = this.state;

    const availableTabs = this.getAvailableTabs();
    const activeTab = getIdKeyForTab(availableTabs[activeTabKey]);
    const currentTab = getIdKeyForTab(tab);

    if (activeTab === currentTab) {
      return (
        <DetailsWidgetView
          groupBy={currentTab}
          item={item}
          parentGroupBy={groupBy}
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

  private getTabTitle = (tab: OcpOnAwsDetailsTab) => {
    const { t } = this.props;
    const key = getIdKeyForTab(tab) || '';

    return t('group_by.top_ocp_on_aws', { groupBy: key });
  };

  public render() {
    return <>{this.getTabs()}</>;
  }
}

const mapStateToProps = createMapStateToProps<DetailsWidgetOwnProps, {}>(
  state => {
    return {
      availableTabs: [
        OcpOnAwsDetailsTab.projects,
        OcpOnAwsDetailsTab.services,
        OcpOnAwsDetailsTab.accounts,
        OcpOnAwsDetailsTab.regions,
      ],
    };
  }
);

const DetailsWidget = translate()(
  connect(
    mapStateToProps,
    {}
  )(DetailsWidgetBase)
);

export { DetailsWidget, DetailsWidgetProps };
