import { Select, SelectOption, SelectVariant } from '@patternfly/react-core';
import { getQuery } from 'api/ocpCloudQuery';
// import { parseQuery } from 'api/ocpCloudQuery';
import { OcpCloudReport, OcpCloudReportType } from 'api/ocpCloudReports';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import {
  ocpCloudReportsActions,
  ocpCloudReportsSelectors,
} from 'store/ocpCloudReports';
import { GetComputedOcpCloudReportItemsParams } from 'utils/getComputedOcpCloudReportItems';
// import { getIdKeyForGroupBy } from 'utils/getComputedOcpCloudReportItems';

interface FilterByOwnProps {
  groupBy?: string;
  onItemClicked(value: string);
  queryString?: string;
}

interface FilterByStateProps {
  report?: OcpCloudReport;
  reportFetchStatus?: FetchStatus;
}

interface FilterByDispatchProps {
  fetchReport?: typeof ocpCloudReportsActions.fetchReport;
}

interface FilterByState {
  currentItem?: any;
  isFilterByOpen: boolean;
}

type FilterByProps = FilterByOwnProps &
  FilterByStateProps &
  FilterByDispatchProps &
  InjectedTranslateProps;

const filterByOptions: {
  label: string;
  value: GetComputedOcpCloudReportItemsParams['idKey'];
}[] = [
  { label: 'cluster', value: 'cluster' },
  { label: 'node', value: 'node' },
  { label: 'project', value: 'project' },
];

const reportType = OcpCloudReportType.tag;

const defaultGroupBy = 'project';
const tagKey = 'tag:'; // Show 'others' with group_by https://github.com/project-koku/koku-ui/issues/1090

class FilterByBase extends React.Component<FilterByProps> {
  protected defaultState: FilterByState = {
    isFilterByOpen: false,
  };
  public state: FilterByState = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
    this.handleFilterBySelect = this.handleFilterBySelect.bind(this);
    this.handleFilterByToggle = this.handleFilterByToggle.bind(this);
  }

  public componentDidMount() {
    const { fetchReport, queryString } = this.props;
    fetchReport(reportType, queryString);
    this.setState({
      currentItem: this.getFilterBy(),
    });
  }

  public componentDidUpdate(prevProps: FilterByProps) {
    const { fetchReport, reportFetchStatus, groupBy, queryString } = this.props;
    if (
      prevProps.groupBy !== groupBy ||
      prevProps.queryString !== queryString
    ) {
      fetchReport(reportType, queryString);
    }
    if (
      prevProps.groupBy !== groupBy ||
      prevProps.queryString !== queryString ||
      prevProps.reportFetchStatus !== reportFetchStatus
    ) {
      this.setState({
        currentItem: this.getFilterBy(),
      });
    }
  }

  private getFilterBy = () => {
    const groupBy = this.props.groupBy ? this.props.groupBy : defaultGroupBy;

    // Find i18n string
    const items = [...this.getSelectOptions(), ...this.getSelectTagOptions()];
    for (const item of items) {
      if (groupBy === item.id) {
        return item;
        break;
      }
    }
    return null;
  };

  private getSelectOption = (id, label) => {
    return {
      id,
      toString: () => label,
    };
  };

  private getSelectItems = () => {
    return this.getSelectOptions().map(option => (
      <SelectOption key={option.id} value={option} />
    ));
  };

  private getSelectTagItems = () => {
    return this.getSelectTagOptions().map(option => (
      <SelectOption key={option.id} value={option} />
    ));
  };

  private getSelectOptions = () => {
    const { t } = this.props;

    return filterByOptions.map(option => {
      return this.getSelectOption(
        `${option.value}`,
        t(`group_by.values.${option.label}`)
      );
    });
  };

  private getSelectTagOptions = () => {
    const { report, t } = this.props;

    if (report && report.data) {
      const data = [...new Set([...report.data])]; // prune duplicates
      return data.map(val => {
        return this.getSelectOption(
          `${tagKey}${val}`,
          t('group_by.tag', { key: val, interpolation: { escapeValue: false } })
        );
      });
    } else {
      return [];
    }
  };

  private handleFilterBySelect = (event, selection, isPlaceholder) => {
    const { onItemClicked } = this.props;
    if (onItemClicked) {
      this.setState({
        currentItem: selection,
        isFilterByOpen: false,
      });
      onItemClicked(selection);
    }
  };

  private handleFilterByToggle = isFilterByOpen => {
    this.setState({
      isFilterByOpen,
    });
  };

  public render() {
    const { t } = this.props;
    const { currentItem, isFilterByOpen } = this.state;

    const dropdownItems = [
      ...this.getSelectItems(),
      ...this.getSelectTagItems(),
    ];

    // Todo: make this a select?
    return (
      <Select
        aria-label={t('ocp_details.toolbar.filter_type_aria_label')}
        onSelect={this.handleFilterBySelect}
        onToggle={this.handleFilterByToggle}
        isExpanded={isFilterByOpen}
        selections={currentItem}
        variant={SelectVariant.single}
      >
        {dropdownItems}
      </Select>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  FilterByOwnProps,
  FilterByStateProps
>(state => {
  const queryString = getQuery({
    filter: {
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: -1,
    },
    key_only: true,
  });
  const report = ocpCloudReportsSelectors.selectReport(
    state,
    reportType,
    queryString
  );
  const reportFetchStatus = ocpCloudReportsSelectors.selectReportFetchStatus(
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

const mapDispatchToProps: FilterByDispatchProps = {
  fetchReport: ocpCloudReportsActions.fetchReport,
};

const FilterBy = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FilterByBase)
);

export { FilterBy, FilterByProps };
