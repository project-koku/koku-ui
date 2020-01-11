import { Select, SelectOption, SelectVariant } from '@patternfly/react-core';
import { getQuery } from 'api/ocpCloudQuery';
import { OcpCloudReport, OcpCloudReportType } from 'api/ocpCloudReports';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import {
  ocpCloudReportsActions,
  ocpCloudReportsSelectors,
} from 'store/ocpCloudReports';

interface FilterTagByOwnProps {
  disabled?: boolean;
  groupBy?: string;
  onItemClicked(value: { id: string });
  queryString?: string;
}

interface FilterTagByStateProps {
  report?: OcpCloudReport;
  reportFetchStatus?: FetchStatus;
}

interface FilterTagByDispatchProps {
  fetchReport?: typeof ocpCloudReportsActions.fetchReport;
}

interface FilterTagByState {
  currentItem?: any;
  isFilterTagByOpen: boolean;
}

type FilterTagByProps = FilterTagByOwnProps &
  FilterTagByStateProps &
  FilterTagByDispatchProps &
  InjectedTranslateProps;

const reportType = OcpCloudReportType.tag;

const tagKey = 'tag:'; // Show 'others' with group_by https://github.com/project-koku/koku-ui/issues/1090

class FilterTagByBase extends React.Component<FilterTagByProps> {
  protected defaultState: FilterTagByState = {
    isFilterTagByOpen: false,
  };
  public state: FilterTagByState = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
    this.handleFilterTagBySelect = this.handleFilterTagBySelect.bind(this);
    this.handleFilterTagByToggle = this.handleFilterTagByToggle.bind(this);
  }

  public componentDidMount() {
    const { fetchReport, queryString } = this.props;
    fetchReport(reportType, queryString);
    this.setState({
      currentItem: this.getFilterTagBy(),
    });
  }

  public componentDidUpdate(prevProps: FilterTagByProps) {
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
        currentItem: this.getFilterTagBy(),
      });
    }
  }

  private getFilterTagBy = () => {
    // Find i18n string
    const items = [...this.getSelectOptions()];
    for (const item of items) {
      if (this.props.groupBy === item.id) {
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

  private getSelectOptions = () => {
    const { report, t } = this.props;

    if (report && report.data) {
      const data = [...new Set([...report.data])]; // prune duplicates
      return data.map(val => {
        return this.getSelectOption(
          `${tagKey}${val}`,
          t('group_by.tag', { key: val, interpolation: { escapeValue: false } }) // Todo: temporary fix
        );
      });
    } else {
      return [];
    }
  };

  private handleFilterTagBySelect = (event, selection, isPlaceholder) => {
    const { onItemClicked } = this.props;
    if (onItemClicked) {
      this.setState({
        currentItem: selection,
        isFilterTagByOpen: false,
      });
      onItemClicked(selection);
    }
  };

  private handleFilterTagByToggle = isFilterTagByOpen => {
    this.setState({
      isFilterTagByOpen,
    });
  };

  public render() {
    const { disabled, t } = this.props;
    const { currentItem, isFilterTagByOpen } = this.state;

    const dropdownItems = [...this.getSelectItems()];

    // Todo: make this a select?
    return (
      <Select
        aria-label={t('ocp_details.toolbar.filter_tag_type_aria_label')}
        isDisabled={disabled}
        onSelect={this.handleFilterTagBySelect}
        onToggle={this.handleFilterTagByToggle}
        isExpanded={isFilterTagByOpen}
        selections={currentItem}
        variant={SelectVariant.single}
      >
        {dropdownItems}
      </Select>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  FilterTagByOwnProps,
  FilterTagByStateProps
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

const mapDispatchToProps: FilterTagByDispatchProps = {
  fetchReport: ocpCloudReportsActions.fetchReport,
};

const FilterTagBy = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FilterTagByBase)
);

export { FilterTagBy, FilterTagByProps };
