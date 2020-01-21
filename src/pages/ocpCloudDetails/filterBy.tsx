import { Select, SelectOption, SelectVariant } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
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
import { GetComputedOcpCloudReportItemsParams } from 'utils/getComputedOcpCloudReportItems';
import { styles } from './filterBy.styles';

interface FilterByOwnProps {
  groupBy?: string;
  onTagSelected(value: string);
  onTagValueSelected(value: string);
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
  currentTagItem?: any;
  currentTagValueItem?: any;
  isFilterByOpen: boolean;
  isFilterByTagOpen: boolean;
  isFilterByTagValueOpen: boolean;
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
  { label: 'tags', value: 'tags' },
];

const reportType = OcpCloudReportType.tag;
const tagKey = 'tag:'; // Show 'others' with group_by https://github.com/project-koku/koku-ui/issues/1090

class FilterByBase extends React.Component<FilterByProps> {
  protected defaultState: FilterByState = {
    isFilterByOpen: false,
    isFilterByTagOpen: false,
    isFilterByTagValueOpen: false,
  };
  public state: FilterByState = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
    this.handleFilterBySelect = this.handleFilterBySelect.bind(this);
    this.handleFilterByTagSelect = this.handleFilterByTagSelect.bind(this);
    this.handleFilterByTagToggle = this.handleFilterByTagToggle.bind(this);
    this.handleFilterByTagValueSelect = this.handleFilterByTagValueSelect.bind(
      this
    );
    this.handleFilterByTagValueToggle = this.handleFilterByTagValueToggle.bind(
      this
    );
    this.handleFilterByToggle = this.handleFilterByToggle.bind(this);
  }

  public componentDidMount() {
    const { fetchReport, queryString } = this.props;
    fetchReport(reportType, queryString);
    this.setState({
      currentItem: this.getFilterBy(),
      currentTagItem: this.getFilterByTag(),
      // currentTagValueItem: this.getFilterByTagValue(),
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
        // currentTagValueItem: this.getFilterByTagValue(),
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
        (groupBy.indexOf(tagKey) !== -1 && item.id === 'tags')
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

  // private getFilterByTagValue = () => {
  //   const items = this.getSelectTagValueOptions();
  //   return items[0];
  // };

  private getSelectOption = (id, label, isPlaceholder = false) => {
    return {
      id,
      toString: () => label,
      isPlaceholder,
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

  private getSelectTagValueItems = () => {
    const test = this.getSelectTagValueOptions();
    return test.map(option => (
      <SelectOption
        key={option.id}
        value={option}
        isPlaceholder={option.isPlaceholder}
      />
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
      return data.map(tag => {
        return this.getSelectOption(
          `${tagKey}${tag.key}`,
          t('group_by.tag_key', { key: tag.key })
        );
      });
    }
    return [];
  };

  private getSelectTagValueOptions = () => {
    const { report, t } = this.props;
    const { currentTagItem } = this.state;

    if (report && report.data) {
      const data = [...new Set([...report.data])]; // prune duplicates
      let tag;
      data.map(_tag => {
        if (currentTagItem && currentTagItem.id === `${tagKey}${_tag.key}`) {
          tag = _tag;
        }
      });
      if (tag && tag.values) {
        const options = [
          this.getSelectOption('', t('group_by.tag_placeholder'), true),
        ];
        tag.values.forEach(val => {
          options.push(
            this.getSelectOption(val, t('group_by.tag_value', { value: val }))
          );
        });
        return options;
      }
    }
    return [];
  };

  private handleFilterBySelect = (event, selection, isPlaceholder) => {
    const { groupBy, onTagSelected } = this.props;
    let selected = selection;

    if (selection.id === 'tags') {
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
    if (onTagSelected) {
      onTagSelected(selected.id);
    }
    this.setState({
      currentItem: selection,
      isFilterByOpen: false,
    });
  };

  private handleFilterByTagSelect = (event, selection, isPlaceholder) => {
    const { onTagSelected } = this.props;
    if (onTagSelected) {
      onTagSelected(selection.id);
    }
    this.setState({
      currentTagItem: selection,
      isFilterByTagOpen: false,
    });
  };

  private handleFilterByTagValueSelect = (event, selection, isPlaceholder) => {
    const { onTagValueSelected } = this.props;
    if (onTagValueSelected) {
      onTagValueSelected(selection.id);
    }
    this.setState({
      isFilterByTagValueOpen: false,
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

  private handleFilterByTagValueToggle = isFilterByTagValueOpen => {
    this.setState({
      isFilterByTagValueOpen,
    });
  };

  public render() {
    const { t } = this.props;
    const {
      currentItem,
      currentTagItem,
      isFilterByOpen,
      isFilterByTagOpen,
      isFilterByTagValueOpen,
    } = this.state;
    const showTagKeys =
      currentItem && currentItem.id ? currentItem.id === 'tags' : false;

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
        {Boolean(showTagKeys) && (
          <>
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
            <Select
              aria-label={t('ocp_details.toolbar.filter_tag_value_aria_label')}
              onSelect={this.handleFilterByTagValueSelect}
              onToggle={this.handleFilterByTagValueToggle}
              isExpanded={isFilterByTagValueOpen}
              variant={SelectVariant.single}
            >
              {this.getSelectTagValueItems()}
            </Select>
          </>
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
