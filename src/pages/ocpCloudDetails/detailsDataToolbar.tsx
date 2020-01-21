import {
  Button,
  ButtonVariant,
  Dropdown,
  DropdownItem,
  DropdownPosition,
  DropdownToggle,
  InputGroup,
  Select,
  SelectOption,
  SelectVariant,
  TextInput,
} from '@patternfly/react-core';
import {
  DataToolbar,
  DataToolbarContent,
  DataToolbarFilter,
  DataToolbarGroup,
  DataToolbarItem,
  DataToolbarToggleGroup,
} from '@patternfly/react-core/dist/esm/experimental';
import { FilterIcon, SearchIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import { getQuery, OcpCloudQuery } from 'api/ocpCloudQuery';
import { OcpCloudReport, OcpCloudReportType } from 'api/ocpCloudReports';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import {
  ocpCloudReportsActions,
  ocpCloudReportsSelectors,
} from 'store/ocpCloudReports';
import { isEqual } from 'utils/equal';
import { GetComputedOcpCloudReportItemsParams } from 'utils/getComputedOcpCloudReportItems';
import { styles } from './detailsToolbar.styles';

interface DetailsDataToolbarOwnProps {
  isExportDisabled: boolean;
  exportText: string;
  groupBy: string;
  onExportClicked();
  onFilterAdded(filterType: string, filterValue: string);
  onFilterRemoved(filterType: string, filterValue: string);
  pagination?: React.ReactNode;
  query?: OcpCloudQuery;
  report?: OcpCloudReport;
  resultsTotal: number;
}

interface DetailsDataToolbarStateProps {
  report?: OcpCloudReport;
  reportFetchStatus?: FetchStatus;
}

interface DetailsDataToolbarDispatchProps {
  fetchReport?: typeof ocpCloudReportsActions.fetchReport;
}

interface Filters {
  cluster: string[];
  node: string[];
  project: string[];
  tags: { [key: string]: string[] };
}

interface DetailsDataToolbarState {
  currentCategory: string;
  currentTagKeyFilter: string;
  currentTagValueFilter: string;
  filters: Filters;
  inputValue: string;
  isCategoryDropdownOpen: boolean;
  isTagKeyDropdownOpen: boolean;
  isTagValueDropdownOpen: boolean;
}

type DetailsDataToolbarProps = DetailsDataToolbarOwnProps &
  InjectedTranslateProps;

const categoryOptions: {
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

export class DetailsDataToolbarBase extends React.Component<
  DetailsDataToolbarProps
> {
  protected defaultState: DetailsDataToolbarState = {
    currentCategory: this.props.groupBy,
    currentTagKeyFilter: '',
    currentTagValueFilter: '',
    filters: {
      cluster: [],
      node: [],
      project: [],
      tags: {},
    },
    inputValue: '',
    isCategoryDropdownOpen: false,
    isTagKeyDropdownOpen: false,
    isTagValueDropdownOpen: false,
  };
  public state: DetailsDataToolbarState = { ...this.defaultState };

  public componentDidUpdate(prevProps: DetailsDataToolbarProps, prevState) {
    const { groupBy, query, report } = this.props;
    if (report && !isEqual(report, prevProps.report)) {
      this.parseQuery(query);
    }
    if (groupBy !== prevProps.groupBy) {
      this.setState({
        currentCategory: groupBy,
      });
    }
  }

  // Initialize

  public parseQuery = (query: OcpCloudQuery) => {
    const filters = {
      cluster: [],
      node: [],
      project: [],
      tags: {},
    };
    if (query.filter_by) {
      Object.keys(query.filter_by).forEach(key => {
        const values = [...query.filter_by[key]];
        if (key.indexOf(tagKey) !== -1) {
          filters.tags[key] = values;
        } else {
          filters[key] = values;
        }
      });
    }
    this.setState({ filters });
  };

  // Filter by features

  public clearAllFilters = (event: React.FormEvent<HTMLButtonElement>) => {
    this.setState({ activeFilters: [] });
    this.props.onFilterRemoved(this.props.groupBy, '');
    event.preventDefault();
  };

  // Note: Active filters are set upon page refresh -- don't need to do that here
  public filterAdded = value => {
    const { currentCategory } = this.state;
    this.props.onFilterAdded(currentCategory, value);
  };

  public filterDeleted = (type, id) => {
    if (type) {
      this.setState((prevState: any) => {
        prevState.filters[type] = prevState.filters[type].filter(s => s !== id);
        return {
          filters: prevState.filters,
        };
      });
    } else {
      // this.props.onFilterRemoved(filter.field, '');
      this.setState({
        filters: {
          location: [],
          name: [],
          status: [],
        },
      });
    }
  };

  // Filter dropdown menus

  public getCategoryDropdown() {
    const { isCategoryDropdownOpen, currentCategory } = this.state;

    return (
      <DataToolbarItem>
        <Dropdown
          onSelect={this.handleCategorySelect}
          position={DropdownPosition.left}
          toggle={
            <DropdownToggle
              onToggle={this.handleCategoryToggle}
              style={{ width: '100%' }}
            >
              <FilterIcon /> {currentCategory}
            </DropdownToggle>
          }
          isOpen={isCategoryDropdownOpen}
          dropdownItems={categoryOptions.map(cat => (
            <DropdownItem key={cat.value}>t(`${cat}`)</DropdownItem>
          ))}
          style={{ width: '100%' }}
        />
      </DataToolbarItem>
    );
  }

  public getTagKeyDropdown() {
    const { isTagKeyDropdownOpen, currentTagKeyFilter } = this.state;

    return (
      <DataToolbarItem>
        <Dropdown
          onSelect={this.handleTagKeySelect}
          position={DropdownPosition.left}
          toggle={
            <DropdownToggle
              onToggle={this.handleTagKeyToggle}
              style={{ width: '100%' }}
            >
              <FilterIcon /> {currentTagKeyFilter}
            </DropdownToggle>
          }
          isOpen={isTagKeyDropdownOpen}
          dropdownItems={[
            <DropdownItem key="tagKey1">tagKey1</DropdownItem>,
            <DropdownItem key="tagKey2">tagKey2</DropdownItem>,
            <DropdownItem key="tagKey3">tagKey3</DropdownItem>,
          ]}
          style={{ width: '100%' }}
        />
      </DataToolbarItem>
    );
  }

  public getTagValueDropdown() {
    const { isTagValueDropdownOpen, currentTagValueFilter } = this.state;

    return (
      <DataToolbarItem>
        <Dropdown
          onSelect={this.handleTagValueSelect}
          position={DropdownPosition.left}
          toggle={
            <DropdownToggle
              onToggle={this.handleTagValueToggle}
              style={{ width: '100%' }}
            >
              <FilterIcon /> {currentTagValueFilter}
            </DropdownToggle>
          }
          isOpen={isTagValueDropdownOpen}
          dropdownItems={[
            <DropdownItem key="tagValue1">tagValue1</DropdownItem>,
            <DropdownItem key="tagValue2">tagValue2</DropdownItem>,
            <DropdownItem key="tagValue3">tagValue3</DropdownItem>,
          ]}
          style={{ width: '100%' }}
        />
      </DataToolbarItem>
    );
  }

  public handleCategorySelect = event => {
    this.setState({
      currentCategoryFilter: event.target.innerText,
      isCategoryDropdownOpen: !this.state.isCategoryDropdownOpen,
    });
  };

  public handleCategoryToggle = isOpen => {
    this.setState({
      isCategoryDropdownOpen: isOpen,
    });
  };

  public handleTagKeySelect = event => {
    this.setState({
      currentTagKeyFilter: event.target.innerText,
      isTagKeyDropdownOpen: !this.state.isTagKeyDropdownOpen,
    });
  };

  public handleTagKeyToggle = isOpen => {
    this.setState({
      isTagKeyDropdownOpen: isOpen,
    });
  };

  public handleTagValueSelect = event => {
    this.setState({
      currentTagValueFilter: event.target.innerText,
      isTagValueDropdownOpen: !this.state.isTagValueDropdownOpen,
    });
  };

  public handleTagValueToggle = isOpen => {
    this.setState({
      isTagValueDropdownOpen: isOpen,
    });
  };

  public onFilterInputChange = newValue => {
    this.setState({ inputValue: newValue });
  };

  public onFilterInput = (event, key) => {
    if (event.key && event.key !== 'Enter') {
      return;
    }

    const { inputValue } = this.state;
    this.setState((prevState: any) => {
      const prevFilters = prevState.filters[key];
      return {
        filters: {
          ...prevState.filters,
          ['name']: prevFilters.includes(inputValue)
            ? prevFilters.filter(value => value !== inputValue)
            : [...prevFilters, inputValue],
        },
        inputValue: '',
      };
    });
  };

  public getFilterInput = category => {
    const { t } = this.props;
    const { currentCategory, filters, inputValue } = this.state;

    return (
      <DataToolbarFilter
        chips={filters[category.value]}
        deleteChip={this.filterDeleted}
        categoryName={t(`${category.label}`)}
        showToolbarItem={currentCategory === category.value}
      >
        <InputGroup>
          <TextInput
            name={`${category.value}-input`}
            id={`${category.value}-input`}
            type="search"
            aria-label={t(
              `ocp_cloud_details.filter.${category.value}_input_aria_label`
            )}
            onChange={this.onFilterInputChange}
            value={inputValue}
            placeholder={t(
              `ocp_cloud_details.filter.${category.value}_placeholder`
            )}
            onKeyDown={evt => this.onFilterInput(evt, category.value)}
          />
          <Button
            variant={ButtonVariant.control}
            aria-label={t(
              `ocp_cloud_details.filter.${category.value}_button_aria_label`
            )}
            onClick={evt => this.onFilterInput(evt, category.value)}
          >
            <SearchIcon />
          </Button>
        </InputGroup>
      </DataToolbarFilter>
    );
  };

  // Tag Key filter

  public getFilterDropdown() {
    const { currentCategory, filters, isTagKeyDropdownOpen } = this.state;

    const locationMenuItems = [
      <SelectOption key="raleigh" value="Raleigh" />,
      <SelectOption key="westford" value="Westford" />,
      <SelectOption key="boston" value="Boston" />,
      <SelectOption key="brno" value="Brno" />,
      <SelectOption key="bangalore" value="Bangalore" />,
    ];

    return (
      <>
        {categoryOptions.map(cat => this.getFilterInput(cat))}
        <DataToolbarFilter
          chips={filters.tags}
          deleteChip={this.filterDeleted}
          categoryName="Location"
          showToolbarItem={currentCategory === 'tags'}
        >
          <Select
            aria-label="Tag keys"
            onToggle={this.onTagKeyToggle}
            onSelect={this.onTagKeySelect}
            selections={filters.location[0]}
            isExpanded={isTagKeyDropdownOpen}
            placeholderText="Any"
          >
            {locationMenuItems}
          </Select>
        </DataToolbarFilter>
      </>
    );
  }

  // XXXXXXXXXXXXXXXX

  public getFilterLabel = value => {
    let filterText = '';

    const index = filterText.indexOf(tagKey);
    if (index === 0) {
      filterText = 'Tag: ' + filterText.slice(tagKey.length) + ': ';
    } else {
      filterText =
        filterText.charAt(0).toUpperCase() + filterText.slice(1) + ': ';
    }

    if (value.filterCategory) {
      filterText += `${value.filterCategory.title ||
        value.filterCategory}-${value.filterValue.title || value.filterValue}`;
    } else if (value.title) {
      filterText += value.title;
    } else {
      filterText += value;
    }
    return filterText;
  };

  public handleExportClicked = () => {
    this.props.onExportClicked();
  };

  // public onValueKeyPress = (e: React.KeyboardEvent) => {
  //   const { currentValue } = this.state;
  //   if (e.key === 'Enter' && currentValue && currentValue.length > 0) {
  //     this.setState({ currentValue: '' });
  //     this.filterAdded(currentValue);
  //     e.stopPropagation();
  //     e.preventDefault();
  //   }
  // };

  // public selectFilterType = (filterType: string) => {
  //   const { currentFilterType } = this.state;
  //   if (currentFilterType !== filterType) {
  //     this.setState({
  //       currentValue: '',
  //       currentFilterType: filterType,
  //     });
  //   }
  // };

  // public updateCurrentValue = (currentValue: string) => {
  //   this.setState({ currentValue });
  // };

  // public renderInput() {
  //   const { t } = this.props;
  //   const { currentFilterType, currentValue } = this.state;
  //   if (!currentFilterType) {
  //     return null;
  //   }
  //
  //   const index = currentFilterType ? currentFilterType.indexOf(tagKey) : -1;
  //   const placeholder =
  //     index === 0
  //       ? t('ocp_cloud_details.filter.tag_placeholder')
  //       : t(`ocp_cloud_details.filter.${currentFilterType}_placeholder`);
  //
  //   return (
  //     <TextInput
  //       id="filter"
  //       onChange={this.updateCurrentValue}
  //       onKeyPress={this.onValueKeyPress}
  //       placeholder={placeholder}
  //       value={currentValue}
  //     />
  //   );
  // }

  public render() {
    // const { isExportDisabled, groupBy, pagination, t } = this.props;
    // const { activeFilters, currentFilterType } = this.state;
    // const showTextInput = currentFilterType.indexOf(tagKey) === -1;

    return (
      <div className={css(styles.toolbarContainer)}>
        <DataToolbar
          id="data-toolbar-with-chip-groups"
          clearAllFilters={this.clearAllFilters}
          collapseListedFiltersBreakpoint="xl"
        >
          <DataToolbarContent>
            <DataToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="xl">
              <DataToolbarGroup variant="filter-group">
                {this.getCategoryDropdown()}
                {this.buildFilterDropdown()}
              </DataToolbarGroup>
            </DataToolbarToggleGroup>
          </DataToolbarContent>
        </DataToolbar>
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  DetailsDataToolbarOwnProps,
  DetailsDataToolbarStateProps
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

const mapDispatchToProps: DetailsDataToolbarDispatchProps = {
  fetchReport: ocpCloudReportsActions.fetchReport,
};

const DetailsDataToolbar = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DetailsDataToolbarBase)
);

export { DetailsDataToolbar, DetailsDataToolbarProps };
