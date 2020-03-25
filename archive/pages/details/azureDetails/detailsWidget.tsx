import { Tab, Tabs } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { ComputedAzureReportItemsParams } from 'utils/computedReport/getComputedAzureReportItems';
import { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import { DetailsWidgetView } from './detailsWidgetView';

interface DetailsWidgetOwnProps {
  availableTabs?: AzureDetailsTab[];
  groupBy: string;
  item: ComputedReportItem;
}

interface DetailsWidgetState {
  activeTabKey: number;
}

type DetailsWidgetProps = DetailsWidgetOwnProps & InjectedTranslateProps;

export const getIdKeyForTab = (
  tab: AzureDetailsTab
): ComputedAzureReportItemsParams['idKey'] => {
  switch (tab) {
    case AzureDetailsTab.subscription_guids:
      return 'subscription_guid';
    case AzureDetailsTab.resource_locations:
      return 'resource_location';
    case AzureDetailsTab.service_names:
      return 'service_name';
  }
};

export const enum AzureDetailsTab {
  subscription_guids = 'subscription_guids',
  resource_locations = 'resource_locations',
  service_names = 'service_names',
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
        AzureDetailsTab.service_names,
        AzureDetailsTab.subscription_guids,
        AzureDetailsTab.resource_locations,
      ],
    };
  }
);

const DetailsWidget = translate()(
  connect(mapStateToProps, {})(DetailsWidgetBase)
);

export { DetailsWidget, DetailsWidgetProps };
