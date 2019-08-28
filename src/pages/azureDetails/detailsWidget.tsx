import { Tab, Tabs } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import {
  ComputedAzureReportItem,
  GetComputedAzureReportItemsParams,
} from 'utils/getComputedAzureReportItems';
import { DetailsWidgetView } from './detailsWidgetView';

interface DetailsWidgetOwnProps {
  availableTabs?: AzureDetailsTab[];
  groupBy: string;
  item: ComputedAzureReportItem;
}

interface DetailsWidgetState {
  activeTabKey: number;
}

type DetailsWidgetProps = DetailsWidgetOwnProps & InjectedTranslateProps;

export const getIdKeyForTab = (
  tab: AzureDetailsTab
): GetComputedAzureReportItemsParams['idKey'] => {
  switch (tab) {
    case AzureDetailsTab.accounts:
      return 'account';
    case AzureDetailsTab.regions:
      return 'region';
    case AzureDetailsTab.services:
      return 'service';
  }
};

export const enum AzureDetailsTab {
  accounts = 'accounts',
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
      if (groupBy !== getIdKeyForTab(tab)) {
        tabs.push(tab);
      }
    });
    return tabs;
  };

  private getTab = (tab: AzureDetailsTab, index: number) => {
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

  private getTabItem = (tab: AzureDetailsTab) => {
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

  private getTabTitle = (tab: AzureDetailsTab) => {
    const { t } = this.props;
    const key = getIdKeyForTab(tab) || '';

    return t('group_by.details', { groupBy: key });
  };

  public render() {
    return <>{this.getTabs()}</>;
  }
}

const mapStateToProps = createMapStateToProps<DetailsWidgetOwnProps, {}>(
  state => {
    return {
      availableTabs: [
        AzureDetailsTab.services,
        AzureDetailsTab.accounts,
        AzureDetailsTab.regions,
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
