import { Select, SelectOption, SelectVariant } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { getQuery } from 'api/ocpQuery';
import { OcpReport, OcpReportType } from 'api/ocpReports';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { ocpReportsActions, ocpReportsSelectors } from 'store/ocpReports';
import { styles } from './filterBy.styles';

interface FilterByOwnProps {
  groupBy?: string;
  onItemClicked(value: string);
  queryString?: string;
}

interface FilterByStateProps {
  report?: OcpReport;
  reportFetchStatus?: FetchStatus;
}

interface FilterByDispatchProps {
  fetchReport?: typeof ocpReportsActions.fetchReport;
}

interface FilterByState {
  currentItem?: any;
  currentTagItem?: any;
  isFilterByOpen: boolean;
  isFilterByTagOpen: boolean;
}

type FilterByProps = FilterByOwnProps &
  FilterByStateProps &
  FilterByDispatchProps &
  InjectedTranslateProps;

const filterByOptions: {
  label: string;
  value: string;
}[] = [
  { label: 'cluster', value: 'cluster' },
  { label: 'node', value: 'node' },
  { label: 'project', value: 'project' },
  { label: 'tag', value: 'tag' },
];

const reportType = OcpReportType.tag;
const tagKey = 'tag:'; // Show 'others' with group_by https://github.com/project-koku/koku-ui/issues/1090

class FilterByBase extends React.Component<FilterByProps> {
  protected defaultState: FilterByState = {
    isFilterByOpen: false,
    isFilterByTagOpen: false,
  };
  public state: FilterByState = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
    this.handleFilterBySelect = this.handleFilterBySelect.bind(this);
    this.handleFilterByTagSelect = this.handleFilterByTagSelect.bind(this);
    this.handleFilterByTagToggle = this.handleFilterByTagToggle.bind(this);
    this.handleFilterByToggle = this.handleFilterByToggle.bind(this);
  }

  public componentDidMount() {
    const { fetchReport, queryString } = this.props;
    fetchReport(reportType, queryString);
    this.setState({
      currentItem: this.getFilterBy(),
      currentTagItem: this.getFilterByTag(),
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
        currentTagItem: this.getFilterByTag(),
      });
    }
  }

  private getFilterBy = () => {
    const { groupBy } = this.props;

    // Find i18n string
    const items = this.getSelectOptions();
    for (const item of items) {
      if (
        groupBy === item.id ||
        (groupBy.indexOf(tagKey) !== -1 && item.id === 'tag')
      ) {
        return item;
      }
    }
    return null;
  };

  private getFilterByTag = () => {
    const { groupBy } = this.props;

    // Find i18n string
    const items = this.getSelectTagOptions();
    for (const item of items) {
      if (groupBy === item.id) {
        return item;
      }
    }
    return items[0];
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
        t(`filter_by.values.${option.label}`)
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
          t('filter_by.tag', { value: val })
        );
      });
    } else {
      return [];
    }
  };

  private handleFilterBySelect = (event, selection, isPlaceholder) => {
    const { groupBy, onItemClicked } = this.props;
    let selected = selection;

    if (selection.id === 'tag') {
      const items = this.getSelectTagOptions();
      if (groupBy.indexOf(tagKey) !== -1) {
        for (const item of items) {
          if (groupBy === item.id) {
            selected = item;
          }
        }
      } else {
        selected = items[0];
      }
    }
    if (onItemClicked) {
      onItemClicked(selected.id);
    }
    this.setState({
      currentItem: selection,
      isFilterByOpen: false,
    });
  };

  private handleFilterByTagSelect = (event, selection, isPlaceholder) => {
    const { onItemClicked } = this.props;
    if (onItemClicked) {
      onItemClicked(selection.id);
    }
    this.setState({
      currentTagItem: selection,
      isFilterByTagOpen: false,
    });
  };

  private handleFilterByToggle = isFilterByOpen => {
    this.setState({
      isFilterByOpen,
    });
  };

  private handleFilterByTagToggle = isFilterByTagOpen => {
    this.setState({
      isFilterByTagOpen,
    });
  };

  public render() {
    const { t } = this.props;
    const {
      currentItem,
      currentTagItem,
      isFilterByOpen,
      isFilterByTagOpen,
    } = this.state;
    const filterByTag =
      currentItem && currentItem.id ? currentItem.id === 'tag' : false;

    return (
      <div className={css(styles.filterContainer)}>
        <Select
          aria-label={t('ocp_details.toolbar.filter_type_aria_label')}
          onSelect={this.handleFilterBySelect}
          onToggle={this.handleFilterByToggle}
          isExpanded={isFilterByOpen}
          selections={currentItem}
          variant={SelectVariant.single}
        >
          {this.getSelectItems()}
        </Select>
        {Boolean(filterByTag) && (
          <Select
            aria-label={t('ocp_details.toolbar.filter_tag_type_aria_label')}
            onSelect={this.handleFilterByTagSelect}
            onToggle={this.handleFilterByTagToggle}
            isExpanded={isFilterByTagOpen}
            selections={currentTagItem}
            variant={SelectVariant.single}
          >
            {this.getSelectTagItems()}
          </Select>
        )}
      </div>
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
  const report = ocpReportsSelectors.selectReport(
    state,
    reportType,
    queryString
  );
  const reportFetchStatus = ocpReportsSelectors.selectReportFetchStatus(
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
  fetchReport: ocpReportsActions.fetchReport,
};

const FilterBy = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FilterByBase)
);

export { FilterBy, FilterByProps };
