import {
  Button,
  ButtonType,
  ButtonVariant,
  Tab,
  Tabs,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { OcpOnAwsReport, OcpOnAwsReportType } from 'api/ocpOnAwsReports';
import {
  OcpOnAwsReportSummaryItem,
  OcpOnAwsReportSummaryItems,
} from 'components/reports/ocpOnAwsReportSummary';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import {
  ocpOnAwsDetailsActions,
  ocpOnAwsDetailsSelectors,
  OcpOnAwsDetailsTab,
  OcpOnAwsDetailsWidget as OcpOnAwsDetailsWidgetStatic,
} from 'store/ocpOnAwsDetails';
import { ocpOnAwsReportsSelectors } from 'store/ocpOnAwsReports';
import { getTestProps, testIds } from 'testIds';
import { formatValue } from 'utils/formatValue';
import {
  ComputedOcpOnAwsReportItem,
  getComputedOcpOnAwsReportItems,
  GetComputedOcpOnAwsReportItemsParams,
} from 'utils/getComputedOcpOnAwsReportItems';
import { styles } from './detailsWidget.styles';
import { DetailsWidgetModal } from './detailsWidgetModal';

interface DetailsWidgetOwnProps {
  groupBy: string;
  item: ComputedOcpOnAwsReportItem;
  widgetId: number;
}

interface DetailsWidgetStateProps extends OcpOnAwsDetailsWidgetStatic {
  query: string;
  report: OcpOnAwsReport;
  reportFetchStatus: FetchStatus;
}

interface DetailsWidgetState {
  activeTabKey: number;
  isDetailsChartModalOpen: boolean;
}

interface DetailsWidgetDispatchProps {
  fetchReports: typeof ocpOnAwsDetailsActions.fetchWidgetReports;
  updateTab: typeof ocpOnAwsDetailsActions.changeWidgetTab;
}

type DetailsWidgetProps = DetailsWidgetOwnProps &
  DetailsWidgetStateProps &
  DetailsWidgetDispatchProps &
  InjectedTranslateProps;

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

class DetailsWidgetBase extends React.Component<DetailsWidgetProps> {
  public state: DetailsWidgetState = {
    activeTabKey: 0,
    isDetailsChartModalOpen: false,
  };

  public componentDidMount() {
    const { fetchReports, id, updateTab, widgetId } = this.props;
    const availableTabs = this.getAvailableTabs();
    if (availableTabs) {
      updateTab(id, availableTabs[0]);
    }
    fetchReports(widgetId);
  }

  private handleDetailsChartModalClose = (isOpen: boolean) => {
    this.setState({ isDetailsChartModalOpen: isOpen });
  };

  private handleDetailsChartModalOpen = event => {
    this.setState({ isDetailsChartModalOpen: true });
    event.preventDefault();
  };

  private handleTabClick = (event, tabIndex) => {
    const { id, updateTab } = this.props;
    const availableTabs = this.getAvailableTabs();
    const tab = availableTabs[tabIndex];

    updateTab(id, tab);
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

  private getItems = (currentTab: string) => {
    const { report } = this.props;

    const computedItems = getComputedOcpOnAwsReportItems({
      report,
      idKey: currentTab as any,
    });
    return computedItems;
  };

  private getTab = (tab: OcpOnAwsDetailsTab, index: number) => {
    const { report } = this.props;

    const currentTab = getIdKeyForTab(tab as OcpOnAwsDetailsTab);

    return (
      <Tab
        eventKey={index}
        key={`${getIdKeyForTab(tab)}-tab`}
        title={this.getTabTitle(tab)}
      >
        <div className={css(styles.tabs)}>
          <OcpOnAwsReportSummaryItems
            idKey={currentTab}
            key={`${currentTab}-items`}
            report={report}
          >
            {({ items }) =>
              items.map(reportItem => this.getTabItem(tab, reportItem))
            }
          </OcpOnAwsReportSummaryItems>
        </div>
        {this.getViewAll(tab)}
      </Tab>
    );
  };

  private getTabItem = (tab: OcpOnAwsDetailsTab, reportItem) => {
    const { reportType, report, topItems } = this.props;
    const { activeTabKey } = this.state;

    const availableTabs = this.getAvailableTabs();
    const activeTab = getIdKeyForTab(availableTabs[activeTabKey]);
    const currentTab = getIdKeyForTab(tab);

    if (activeTab === currentTab) {
      return (
        <OcpOnAwsReportSummaryItem
          key={`${reportItem.id}-item`}
          formatOptions={topItems.formatOptions}
          formatValue={formatValue}
          label={reportItem.label ? reportItem.label.toString() : ''}
          totalValue={
            reportType === OcpOnAwsReportType.cost
              ? report.meta.total.cost.value
              : report.meta.total.usage.value
          }
          units={reportItem.units}
          value={
            reportType === OcpOnAwsReportType.cost
              ? reportItem.cost
              : reportItem.usage
          }
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

  private getViewAll = (tab: OcpOnAwsDetailsTab) => {
    const { item, groupBy, t } = this.props;
    const { isDetailsChartModalOpen } = this.state;

    const currentTab = getIdKeyForTab(tab as OcpOnAwsDetailsTab);
    const computedItems = this.getItems(currentTab);

    const otherIndex = computedItems.findIndex(i => {
      const id = i.id;
      if (id && id !== null) {
        return id.toString().includes('Other');
      }
    });

    if (otherIndex !== -1) {
      return (
        <div className={css(styles.viewAllContainer)}>
          <Button
            {...getTestProps(testIds.details.view_all_btn)}
            onClick={this.handleDetailsChartModalOpen}
            type={ButtonType.button}
            variant={ButtonVariant.link}
          >
            {t('ocp_on_aws_details.view_all', { value: currentTab })}
          </Button>
          <DetailsWidgetModal
            groupBy={groupBy}
            isOpen={isDetailsChartModalOpen}
            item={item}
            onClose={this.handleDetailsChartModalClose}
            tab={currentTab}
          />
        </div>
      );
    } else {
      return null;
    }
  };

  public render() {
    const { reportFetchStatus, t } = this.props;
    return (
      <>
        {Boolean(reportFetchStatus === FetchStatus.inProgress)
          ? `${t('loading')}...`
          : this.getTabs()}
      </>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  DetailsWidgetOwnProps,
  DetailsWidgetStateProps
>((state, { widgetId }) => {
  const widget = ocpOnAwsDetailsSelectors.selectWidget(state, widgetId);
  const queries = ocpOnAwsDetailsSelectors.selectWidgetQueries(state, widgetId);
  return {
    ...widget,
    query: queries.tabs,
    report: ocpOnAwsReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.tabs
    ),
    reportFetchStatus: ocpOnAwsReportsSelectors.selectReportFetchStatus(
      state,
      widget.reportType,
      queries.tabs
    ),
  };
});

const mapDispatchToProps: DetailsWidgetDispatchProps = {
  fetchReports: ocpOnAwsDetailsActions.fetchWidgetReports,
  updateTab: ocpOnAwsDetailsActions.changeWidgetTab,
};

const DetailsWidget = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DetailsWidgetBase)
);

export { DetailsWidget, DetailsWidgetProps };
