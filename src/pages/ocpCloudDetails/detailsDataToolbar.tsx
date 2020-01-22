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
  currentTagKey: string;
  filters: Filters;
  inputValue: string;
  isCategoryDropdownOpen: boolean;
  isTagKeyDropdownOpen: boolean;
  isTagKeySelectExpanded: boolean;
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
    currentCategory: '',
    currentTagKey: '',
    filters: {
      cluster: [],
      node: [],
      project: [],
      tags: {},
    },
    inputValue: '',
    isCategoryDropdownOpen: false,
    isTagKeyDropdownOpen: false,
    isTagKeySelectExpanded: false,
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

  // Note: Active filters are set upon page refresh -- don't need to do that here
  public onAdd = value => {
    const { currentCategory } = this.state;
    this.props.onFilterAdded(currentCategory, value);
  };

  public onDelete = (type, id) => {
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

  // Category dropdown

  public getCategoryDropdown() {
    const { isCategoryDropdownOpen, currentCategory } = this.state;

    return (
      <DataToolbarItem>
        <Dropdown
          onSelect={this.onCategorySelect}
          position={DropdownPosition.left}
          toggle={
            <DropdownToggle
              onToggle={this.onCategoryToggle}
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

  public onCategorySelect = event => {
    this.setState({
      currentCategoryFilter: event.target.innerText,
      isCategoryDropdownOpen: !this.state.isCategoryDropdownOpen,
    });
  };

  public onCategoryToggle = isOpen => {
    this.setState({
      isCategoryDropdownOpen: isOpen,
    });
  };

  public getCategoryInput = category => {
    const { t } = this.props;
    const { currentCategory, filters, inputValue } = this.state;

    return (
      <DataToolbarFilter
        chips={filters[category.value]}
        deleteChip={this.onDelete}
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
            onChange={this.onCategoryInputChange}
            value={inputValue}
            placeholder={t(
              `ocp_cloud_details.filter.${category.value}_placeholder`
            )}
            onKeyDown={evt => this.onCategoryInput(evt, category.value)}
          />
          <Button
            variant={ButtonVariant.control}
            aria-label={t(
              `ocp_cloud_details.filter.${category.value}_button_aria_label`
            )}
            onClick={evt => this.onCategoryInput(evt, category.value)}
          >
            <SearchIcon />
          </Button>
        </InputGroup>
      </DataToolbarFilter>
    );
  };

  public onCategoryInputChange = value => {
    // const { currentCategory } = this.state;
    this.setState({ inputValue: value });
    // this.props.onFilterAdded(currentCategory, value);
  };

  public onCategoryInput = (event, key) => {
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

  // Tag key dropdown

  public getTagKeyDropdown() {
    const { isTagKeyDropdownOpen, currentTagKey } = this.state;

    return (
      <DataToolbarItem>
        <Dropdown
          onSelect={this.onTagKeySelect}
          position={DropdownPosition.left}
          toggle={
            <DropdownToggle
              onToggle={this.onTagKeyToggle}
              style={{ width: '100%' }}
            >
              <FilterIcon /> {currentTagKey}
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

  public onTagKeySelect = event => {
    this.setState({
      currentTagKey: event.target.innerText,
      isTagKeyDropdownOpen: !this.state.isTagKeyDropdownOpen,
    });
  };

  public onTagKeyToggle = isOpen => {
    this.setState({
      isTagKeyDropdownOpen: isOpen,
    });
  };

  // Tag key value select

  public getTagKeyValueSelect() {
    const {
      currentCategory,
      currentTagKey,
      filters,
      isTagKeySelectExpanded,
    } = this.state;
    const selections = currentTagKey ? filters.tags[currentTagKey] : [];

    return (
      <DataToolbarFilter
        chips={filters.tags}
        deleteChip={this.onDelete}
        categoryName="Location"
        showToolbarItem={currentCategory === 'tags'}
      >
        <Select
          aria-label="Tag key values"
          onToggle={this.onTagValueToggle}
          onSelect={this.onTagValueSelect}
          selections={selections}
          isExpanded={isTagKeySelectExpanded}
          placeholderText="Any"
        >
          {selections.map(val => (
            <SelectOption key={val} value={val} />
          ))}
        </Select>
      </DataToolbarFilter>
    );
  }

  public onTagValueSelect = (event, selection) => {
    const { currentTagKey } = this.state;

    const checked = event.target.checked;
    this.setState((prevState: any) => {
      const prevSelections = prevState.tags[currentTagKey];
      return {
        filters: {
          ...prevState.filters,
          tags: {
            ...prevState.filters.tags,
            [currentTagKey]: checked
              ? [...prevSelections, selection]
              : prevSelections.filter(value => value !== selection),
          },
        },
      };
    });
    // this.props.onFilterAdded(currentTagKey, value);
  };

  public onTagValueToggle = isOpen => {
    this.setState({
      isTagKeySelectExpanded: isOpen,
    });
  };

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

  public render() {
    return (
      <div className={css(styles.toolbarContainer)}>
        <DataToolbar
          id="data-toolbar-with-chip-groups"
          clearAllFilters={this.onDelete}
          collapseListedFiltersBreakpoint="xl"
        >
          <DataToolbarContent>
            <DataToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="xl">
              <DataToolbarGroup variant="filter-group">
                {this.getCategoryDropdown()}
                {this.getTagKeyDropdown()}
                {this.getTagKeyValueSelect()}
                {categoryOptions.map(category =>
                  this.getCategoryInput(category)
                )}
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
