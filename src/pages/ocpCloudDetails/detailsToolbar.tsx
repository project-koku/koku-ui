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
import {
  ExternalLinkSquareAltIcon,
  FilterIcon,
  SearchIcon,
} from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import { getQuery, OcpCloudQuery } from 'api/ocpCloudQuery';
import { OcpCloudReport, OcpCloudReportType } from 'api/ocpCloudReports';
import { cloneDeep } from 'lodash';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import {
  ocpCloudReportsActions,
  ocpCloudReportsSelectors,
} from 'store/ocpCloudReports';
import { isEqual } from 'utils/equal';
import { styles } from './detailsToolbar.styles';

interface DetailsToolbarOwnProps {
  isExportDisabled: boolean;
  exportText: string;
  groupBy: string;
  onExportClicked();
  onFilterAdded(filterType: string, filterValue: string);
  onFilterRemoved(filterType: string, filterValue?: string);
  pagination?: React.ReactNode;
  query?: OcpCloudQuery;
  queryString?: string;
  report?: OcpCloudReport;
}

interface DetailsToolbarStateProps {
  report?: OcpCloudReport;
  reportFetchStatus?: FetchStatus;
}

interface DetailsToolbarDispatchProps {
  fetchReport?: typeof ocpCloudReportsActions.fetchReport;
}

interface Filters {
  cluster: string[];
  node: string[];
  project: string[];
  tag: { [key: string]: string[] };
}

interface DetailsToolbarState {
  categoryInput?: string;
  currentCategory?: string;
  currentTagKey?: string;
  filters: Filters;
  isCategoryDropdownOpen: boolean;
  isTagKeyDropdownOpen: boolean;
  isTagKeySelectExpanded: boolean;
  isTagValueSelectExpanded: boolean;
}

type DetailsToolbarProps = DetailsToolbarOwnProps &
  DetailsToolbarStateProps &
  DetailsToolbarDispatchProps &
  InjectedTranslateProps;

const categoryOptions: {
  label: string;
  value: string;
}[] = [
  { label: 'cluster', value: 'cluster' },
  { label: 'node', value: 'node' },
  { label: 'project', value: 'project' },
  { label: 'tag', value: 'tag' },
];

const defaultFilters: Filters = {
  cluster: [],
  node: [],
  project: [],
  tag: {},
};

const reportType = OcpCloudReportType.tag;
const tagKey = 'tag:'; // Show 'others' with group_by https://github.com/project-koku/koku-ui/issues/1090

export class DetailsToolbarBase extends React.Component<DetailsToolbarProps> {
  protected defaultState: DetailsToolbarState = {
    categoryInput: '',
    filters: cloneDeep(defaultFilters),
    isCategoryDropdownOpen: false,
    isTagKeyDropdownOpen: false,
    isTagKeySelectExpanded: false,
    isTagValueSelectExpanded: false,
  };
  public state: DetailsToolbarState = { ...this.defaultState };

  public componentDidMount() {
    const { fetchReport, queryString } = this.props;

    fetchReport(reportType, queryString);
    this.setState({
      currentCategory: this.getDefaultCategory(),
    });
  }

  public componentDidUpdate(prevProps: DetailsToolbarProps, prevState) {
    const { groupBy, query, reportFetchStatus } = this.props;

    if (
      (query && !isEqual(query, prevProps.query)) ||
      prevProps.reportFetchStatus !== reportFetchStatus
    ) {
      this.setState(() => {
        const filters = this.getActiveFilters(query);
        return prevProps.groupBy !== groupBy
          ? {
              currentCategory: this.getDefaultCategory(),
              filters,
            }
          : {
              filters,
            };
      });
    }
  }

  // Initialize

  private getDefaultCategory = () => {
    const { groupBy } = this.props;

    for (const option of categoryOptions) {
      if (
        groupBy === option.value ||
        (groupBy.indexOf(tagKey) !== -1 && option.value === 'tag')
      ) {
        return option.value;
      }
    }
    return undefined;
  };

  public getActiveFilters = (query: OcpCloudQuery) => {
    const filters = cloneDeep(defaultFilters);
    if (query.filter_by) {
      Object.keys(query.filter_by).forEach(key => {
        const values = Array.isArray(query.filter_by[key])
          ? [...query.filter_by[key]]
          : [query.filter_by[key]];

        if (key.indexOf(tagKey) !== -1) {
          filters.tag[key.substring(tagKey.length)] = values;
        } else {
          filters[key] = values;
        }
      });
    }
    return filters;
  };

  public onDelete = (type, id) => {
    if (type) {
      // Workaround for https://github.com/patternfly/patternfly-react/issues/3552
      // This prevents us from using an ID
      const filterType = type.toLowerCase();

      this.setState(
        (prevState: any) => {
          if (prevState.filters.tag[filterType]) {
            // Todo: use ID
            prevState.filters.tag[filterType] = prevState.filters.tag[
              filterType
            ].filter(s => s !== id);
          } else {
            prevState.filters[filterType] = prevState.filters[
              filterType
            ].filter(s => s !== id);
          }
          return {
            filters: prevState.filters,
          };
        },
        () => {
          const { filters } = this.state;
          const _filterType = filters.tag[filterType]
            ? `${tagKey}${filterType}`
            : filterType; // Todo: use ID
          this.props.onFilterRemoved(_filterType, id);
        }
      );
    } else {
      this.setState(
        {
          filters: cloneDeep(defaultFilters),
        },
        () => {
          this.props.onFilterRemoved(null); // Clear all
        }
      );
    }
  };

  // Category dropdown

  public getCategoryDropdown() {
    const { t } = this.props;
    const { isCategoryDropdownOpen, currentCategory } = this.state;

    const index = currentCategory ? currentCategory.indexOf('tag') : -1;
    const label =
      index !== -1
        ? t('filter_by.values.tag')
        : t(`filter_by.values.${currentCategory}`);

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
              <FilterIcon /> {label}
            </DropdownToggle>
          }
          isOpen={isCategoryDropdownOpen}
          dropdownItems={categoryOptions.map(option => (
            <DropdownItem
              key={option.value}
              onClick={() => this.onCategoryClick(option.value)}
            >
              {t(`filter_by.values.${option.label}`)}
            </DropdownItem>
          ))}
          style={{ width: '100%' }}
        />
      </DataToolbarItem>
    );
  }

  public onCategoryClick = value => {
    this.setState({
      currentCategory: value,
    });
  };

  public onCategorySelect = event => {
    this.setState({
      categoryInput: '',
      currentTagKey: undefined,
      isCategoryDropdownOpen: !this.state.isCategoryDropdownOpen,
    });
  };

  public onCategoryToggle = isOpen => {
    this.setState({
      isCategoryDropdownOpen: isOpen,
    });
  };

  // Category input

  public getCategoryInput = categoryOption => {
    const { t } = this.props;
    const { currentCategory, filters, categoryInput } = this.state;

    return (
      <DataToolbarFilter
        categoryName={t(`filter_by.values.${categoryOption.label}`)}
        chips={filters[categoryOption.value]}
        deleteChip={this.onDelete}
        key={categoryOption.value}
        showToolbarItem={
          currentCategory !== 'tag' && currentCategory === categoryOption.value
        }
      >
        <InputGroup>
          <TextInput
            name={`${categoryOption.value}-input`}
            id={`${categoryOption.value}-input`}
            type="search"
            aria-label={t(`filter_by.${categoryOption.value}_input_aria_label`)}
            onChange={this.onCategoryInputChange}
            value={categoryInput}
            placeholder={t(`filter_by.${categoryOption.value}_placeholder`)}
            onKeyDown={evt => this.onCategoryInput(evt, categoryOption.value)}
          />
          <Button
            variant={ButtonVariant.control}
            aria-label={t(
              `filter_by.${categoryOption.value}_button_aria_label`
            )}
            onClick={evt => this.onCategoryInput(evt, categoryOption.value)}
          >
            <SearchIcon />
          </Button>
        </InputGroup>
      </DataToolbarFilter>
    );
  };

  public onCategoryInputChange = value => {
    this.setState({ categoryInput: value });
  };

  public onCategoryInput = (event, key) => {
    const { categoryInput, currentCategory } = this.state;

    if (event.key && event.key !== 'Enter') {
      return;
    }
    this.setState(
      (prevState: any) => {
        const prevFilters = prevState.filters[key];
        return {
          filters: {
            ...prevState.filters,
            [currentCategory]: prevFilters.includes(categoryInput)
              ? prevFilters
              : [...prevFilters, categoryInput],
          },
          categoryInput: '',
        };
      },
      () => {
        this.props.onFilterAdded(currentCategory, categoryInput);
      }
    );
  };

  // Tag key select

  public getTagKeySelect = () => {
    const { t } = this.props;
    const {
      currentCategory,
      currentTagKey,
      isTagKeySelectExpanded,
    } = this.state;

    if (currentCategory !== 'tag') {
      return null;
    }

    const selectOptions = this.getTagKeyOptions().map(selectOption => {
      return (
        <SelectOption key={selectOption.value} value={selectOption.value} />
      );
    });

    return (
      <Select
        variant={SelectVariant.typeahead}
        aria-label={t('filter_by.tag_key_aria_label')}
        onClear={this.onTagKeyClear}
        onToggle={this.onTagKeyToggle}
        onSelect={this.onTagKeySelect}
        isExpanded={isTagKeySelectExpanded}
        placeholderText={t('filter_by.tag_key_placeholder')}
        selections={currentTagKey}
      >
        {selectOptions}
      </Select>
    );
  };

  public getTagKeyOptions() {
    const { report } = this.props;

    let data = [];
    if (report && report.data) {
      data = [...new Set([...report.data])]; // prune duplicates
    }

    let options = [];
    if (data.length > 0) {
      options = data.map(tag => {
        return {
          value: tag.key,
        };
      });
    }
    return options;
  }

  public onTagKeyClear = () => {
    this.setState({
      currentTagKey: undefined,
      isTagKeySelectExpanded: false,
    });
  };

  public onTagKeySelect = (event, selection, isPlaceholder) => {
    this.setState({
      currentTagKey: selection,
      isTagKeySelectExpanded: !this.state.isTagKeySelectExpanded,
    });
  };

  public onTagKeyToggle = isOpen => {
    this.setState({
      isTagKeySelectExpanded: isOpen,
    });
  };

  // Tag value select

  public getTagValueSelect = tagKeyOption => {
    const { t } = this.props;
    const {
      currentCategory,
      currentTagKey,
      filters,
      isTagValueSelectExpanded,
    } = this.state;

    const selectOptions = this.getTagValueOptions().map(selectOption => {
      return (
        <SelectOption key={selectOption.value} value={selectOption.value} />
      );
    });

    // Width prop is a workaround for https://github.com/patternfly/patternfly-react/issues/3574
    return (
      <DataToolbarFilter
        categoryName={tagKeyOption.value}
        chips={filters.tag[tagKeyOption.value]}
        deleteChip={this.onDelete}
        key={tagKeyOption.value}
        showToolbarItem={
          currentCategory === 'tag' && currentTagKey === tagKeyOption.value
        }
      >
        <Select
          variant={SelectVariant.checkbox}
          aria-label={t('filter_by.tag_value_aria_label')}
          onToggle={this.onTagValueToggle}
          onSelect={this.onTagValueSelect}
          selections={
            filters.tag[tagKeyOption.value]
              ? filters.tag[tagKeyOption.value]
              : []
          }
          isExpanded={isTagValueSelectExpanded}
          placeholderText={t('filter_by.tag_value_placeholder')}
          width={200}
        >
          {selectOptions}
        </Select>
      </DataToolbarFilter>
    );
  };

  public getTagValueOptions() {
    const { report } = this.props;
    const { currentTagKey } = this.state;

    let data = [];
    if (report && report.data) {
      data = [...new Set([...report.data])]; // prune duplicates
    }

    let options = [];
    if (data.length > 0) {
      for (const tag of data) {
        if (currentTagKey === tag.key) {
          options = tag.values.map(val => {
            return {
              value: val,
            };
          });
          break;
        }
      }
    }
    return options;
  }

  public onTagValueSelect = (event, selection) => {
    const { currentTagKey } = this.state;

    const checked = event.target.checked;
    this.setState(
      (prevState: any) => {
        const prevSelections = prevState.filters.tag[currentTagKey]
          ? prevState.filters.tag[currentTagKey]
          : [];
        return {
          filters: {
            ...prevState.filters,
            tag: {
              ...prevState.filters.tag,
              [currentTagKey]: checked
                ? [...prevSelections, selection]
                : prevSelections.filter(value => value !== selection),
            },
          },
        };
      },
      () => {
        if (checked) {
          this.props.onFilterAdded(`${tagKey}${currentTagKey}`, selection);
        } else {
          this.onDelete(currentTagKey, selection);
        }
      }
    );
  };

  public onTagValueToggle = isOpen => {
    this.setState({
      isTagValueSelectExpanded: isOpen,
    });
  };

  // Export button

  public getExportButton = () => {
    const { isExportDisabled, t } = this.props;

    return (
      <DataToolbarItem>
        <Button
          isDisabled={isExportDisabled}
          onClick={this.handleExportClicked}
          variant={ButtonVariant.link}
        >
          <span className={css(styles.export)}>
            {t('ocp_details.toolbar.export')}
          </span>
          <ExternalLinkSquareAltIcon />
        </Button>
      </DataToolbarItem>
    );
  };

  public handleExportClicked = () => {
    this.props.onExportClicked();
  };

  public render() {
    const { pagination } = this.props;

    return (
      <div className={css(styles.toolbarContainer)}>
        <DataToolbar
          id="ocp-cloud-details-toolbar"
          clearAllFilters={this.onDelete}
          collapseListedFiltersBreakpoint="xl"
        >
          <DataToolbarContent>
            <DataToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="xl">
              <DataToolbarGroup variant="filter-group">
                {this.getCategoryDropdown()}
                {this.getTagKeySelect()}
                {this.getTagKeyOptions().map(option =>
                  this.getTagValueSelect(option)
                )}
                {categoryOptions
                  .filter(option => option.value !== 'tag')
                  .map(option => this.getCategoryInput(option))}
              </DataToolbarGroup>
              <DataToolbarGroup>{this.getExportButton()}</DataToolbarGroup>
            </DataToolbarToggleGroup>
            <DataToolbarItem
              variant="pagination"
              breakpointMods={[{ modifier: 'align-right' }]}
            >
              {pagination}
            </DataToolbarItem>
          </DataToolbarContent>
        </DataToolbar>
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  DetailsToolbarOwnProps,
  DetailsToolbarStateProps
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

const mapDispatchToProps: DetailsToolbarDispatchProps = {
  fetchReport: ocpCloudReportsActions.fetchReport,
};

const DetailsToolbar = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DetailsToolbarBase)
);

export { DetailsToolbar, DetailsToolbarProps };
