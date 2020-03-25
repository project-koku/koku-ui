import { Dropdown, DropdownItem, DropdownToggle } from '@patternfly/react-core';
import { AzureQuery, getQuery } from 'api/queries/azureQuery';
import { parseQuery } from 'api/queries/azureQuery';
import { tagKeyPrefix } from 'api/queries/query';
import { AzureReport } from 'api/reports/azureReports';
import { ReportType } from 'api/reports/report';
import { uniqBy } from 'lodash';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import {
  azureReportsActions,
  azureReportsSelectors,
} from 'store/reports/azureReports';
import { ComputedAzureReportItemsParams } from 'utils/computedReport/getComputedAzureReportItems';
import { getIdKeyForGroupBy } from 'utils/computedReport/getComputedAzureReportItems';
import { styles } from './groupBy.styles';

interface GroupByOwnProps {
  groupBy?: string;
  onItemClicked(value: string);
  queryString?: string;
}

interface GroupByStateProps {
  report?: AzureReport;
  reportFetchStatus?: FetchStatus;
}

interface GroupByDispatchProps {
  fetchReport?: typeof azureReportsActions.fetchReport;
}

interface GroupByState {
  currentItem?: string;
  isGroupByOpen: boolean;
}

type GroupByProps = GroupByOwnProps &
  GroupByStateProps &
  GroupByDispatchProps &
  InjectedTranslateProps;

const groupByOptions: {
  label: string;
  value: ComputedAzureReportItemsParams['idKey'];
}[] = [
  { label: 'subscription_guid', value: 'subscription_guid' },
  { label: 'service_name', value: 'service_name' },
  { label: 'resource_location', value: 'resource_location' },
];

const reportType = ReportType.tag;

class GroupByBase extends React.Component<GroupByProps> {
  protected defaultState: GroupByState = {
    currentItem: this.props.groupBy || 'subscription_guid',
    isGroupByOpen: false,
  };
  public state: GroupByState = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
    this.handleGroupByClick = this.handleGroupByClick.bind(this);
    this.handleGroupBySelect = this.handleGroupBySelect.bind(this);
    this.handleGroupByToggle = this.handleGroupByToggle.bind(this);
  }

  public componentDidMount() {
    const { fetchReport, queryString } = this.props;
    fetchReport(reportType, queryString);
    this.setState({
      currentItem: this.getGroupBy(),
    });
  }

  public componentDidUpdate(prevProps: GroupByProps) {
    const { fetchReport, groupBy, queryString } = this.props;
    if (
      prevProps.queryString !== queryString ||
      prevProps.groupBy !== groupBy
    ) {
      fetchReport(reportType, queryString);
      this.setState({ currentItem: this.getGroupBy() });
    }
  }

  public handleGroupByClick = value => {
    const { onItemClicked } = this.props;
    if (onItemClicked) {
      this.setState({
        currentItem: value,
      });
      onItemClicked(value);
    }
  };

  private getDropDownItems = () => {
    const { t } = this.props;

    return groupByOptions.map(option => (
      <DropdownItem
        component="button"
        key={option.value}
        onClick={() => this.handleGroupByClick(option.value)}
      >
        {t(`group_by.values.${option.label}`)}
      </DropdownItem>
    ));
  };

  private getDropDownTags = () => {
    const { report, t } = this.props;

    if (report && report.data) {
      // Workaround for https://github.com/project-koku/koku/issues/1797
      const keepData = report.data.map(
        ({ type, ...keepProps }: any) => keepProps
      );
      const data = uniqBy(keepData, 'key'); // prune duplicates
      return data.map(tag => (
        <DropdownItem
          component="button"
          key={`${tagKeyPrefix}${tag.key}`}
          onClick={() => this.handleGroupByClick(`${tagKeyPrefix}${tag.key}`)}
        >
          {t('group_by.tag_key', { value: tag.key })}
        </DropdownItem>
      ));
    } else {
      return [];
    }
  };

  private getGroupBy = () => {
    const queryFromRoute = parseQuery<AzureQuery>(location.search);
    let groupBy: string = getIdKeyForGroupBy(queryFromRoute.group_by);
    const groupByKeys =
      queryFromRoute && queryFromRoute.group_by
        ? Object.keys(queryFromRoute.group_by)
        : [];

    for (const key of groupByKeys) {
      const index = key.indexOf(tagKeyPrefix);
      if (index !== -1) {
        groupBy = key;
        break;
      }
    }
    return groupBy !== 'date' ? groupBy : 'subscription_guid';
  };

  private handleGroupBySelect = event => {
    this.setState({
      isGroupByOpen: !this.state.isGroupByOpen,
    });
  };

  private handleGroupByToggle = isGroupByOpen => {
    this.setState({
      isGroupByOpen,
    });
  };

  public render() {
    const { t } = this.props;
    const { currentItem, isGroupByOpen } = this.state;

    const dropdownItems = [
      ...this.getDropDownItems(),
      ...this.getDropDownTags(),
    ];

    const index = currentItem ? currentItem.indexOf(tagKeyPrefix) : -1;
    const label =
      index !== -1
        ? t('group_by.tag_key', {
            value: currentItem.slice(tagKeyPrefix.length),
          })
        : t(`group_by.values.${currentItem}`);

    return (
      <div style={styles.groupBySelector}>
        <label style={styles.groupBySelectorLabel}>{t('group_by.cost')}:</label>
        <Dropdown
          onSelect={this.handleGroupBySelect}
          toggle={
            <DropdownToggle onToggle={this.handleGroupByToggle}>
              {label}
            </DropdownToggle>
          }
          isOpen={isGroupByOpen}
          dropdownItems={dropdownItems}
        />
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  GroupByOwnProps,
  GroupByStateProps
>(state => {
  const queryString = getQuery({
    filter: {
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: -1,
    },
  });
  const report = azureReportsSelectors.selectReport(
    state,
    reportType,
    queryString
  );
  const reportFetchStatus = azureReportsSelectors.selectReportFetchStatus(
    state,
    reportType,
    queryString
  );
  return {
    queryString,
    report,
    reportFetchStatus,
  };
});

const mapDispatchToProps: GroupByDispatchProps = {
  fetchReport: azureReportsActions.fetchReport,
};

const GroupBy = translate()(
  connect(mapStateToProps, mapDispatchToProps)(GroupByBase)
);

export { GroupBy, GroupByProps };
