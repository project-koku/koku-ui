import './dataToolbar.scss';

import type { SelectOptionObject, ToolbarChipGroup } from '@patternfly/react-core';
import {
  Button,
  ButtonVariant,
  Dropdown,
  DropdownItem,
  DropdownPosition,
  DropdownToggle,
  DropdownToggleCheckbox,
  InputGroup,
  Select,
  SelectOption,
  SelectVariant,
  Switch,
  TextInput,
  Toolbar,
  ToolbarContent,
  ToolbarFilter,
  ToolbarGroup,
  ToolbarItem,
  ToolbarToggleGroup,
} from '@patternfly/react-core';
import { ExportIcon } from '@patternfly/react-icons/dist/esm/icons/export-icon';
import { FilterIcon } from '@patternfly/react-icons/dist/esm/icons/filter-icon';
import { SearchIcon } from '@patternfly/react-icons/dist/esm/icons/search-icon';
import type { Org } from 'api/orgs/org';
import type { Query } from 'api/queries/query';
import type { ResourcePathsType, ResourceType } from 'api/resources/resource';
import { isResourceTypeValid } from 'api/resources/resourceUtils';
import type { Tag } from 'api/tags/tag';
import type { TagPathsType } from 'api/tags/tag';
import messages from 'locales/messages';
import { cloneDeep } from 'lodash';
import { uniq, uniqBy } from 'lodash';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { ResourceTypeahead } from 'routes/views/components/resourceTypeahead';
import type { Filter } from 'routes/views/utils/filter';
import { createMapStateToProps } from 'store/common';
import { featureFlagsSelectors } from 'store/featureFlags';
import type { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import { isEqual } from 'utils/equal';
import { orgUnitIdKey, orgUnitNameKey, platformCategoryKey, tagKey, tagPrefix } from 'utils/props';

import { DataKebab } from './dataKebab';
import { styles } from './dataToolbar.styles';
import { TagValue } from './tagValue';

interface Filters {
  [key: string]: Filter[] | { [key: string]: Filter[] };
}

interface DataToolbarOwnProps {
  categoryOptions?: ToolbarChipGroup[]; // Options for category menu
  dateRange?: React.ReactNode; // Optional date range controls to display in toolbar
  datePicker?: React.ReactNode; // Optional date picker controls to display in toolbar
  groupBy?: string; // Sync category selection with groupBy value
  isAllSelected?: boolean;
  isBulkSelectDisabled?: boolean;
  isDisabled?: boolean;
  isExportDisabled?: boolean; // Show export icon as disabled
  itemsPerPage?: number;
  itemsTotal?: number;
  onBulkSelected?: (action: string) => void;
  onColumnManagementClicked?: () => void;
  onExportClicked?: () => void;
  onFilterAdded?: (filter: Filter) => void;
  onFilterRemoved?: (filterType: Filter) => void;
  onPlatformCostsChanged?: (checked: boolean) => void;
  orgReport?: Org; // Report containing AWS organizational unit data
  pagination?: React.ReactNode; // Optional pagination controls to display in toolbar
  query?: Query; // Query containing filter_by params used to restore state upon page refresh
  resourcePathsType?: ResourcePathsType;
  selectedItems?: ComputedReportItem[];
  showBulkSelect?: boolean; // Show bulk select
  showColumnManagement?: boolean; // Show column management
  showExport?: boolean; // Show export icon
  showFilter?: boolean; // Show export icon
  showPlatformCosts?: boolean; // Show platform costs switch
  style?: React.CSSProperties;
  tagReport?: Tag; // Data containing tag key and value data
  tagReportPathsType?: TagPathsType;
}

interface DataToolbarState {
  categoryInput?: string;
  currentCategory?: string;
  currentOrgUnit?: string;
  currentTagKey?: string;
  currentExclude?: string;
  filters?: Filters;
  isBulkSelectOpen?: boolean;
  isCategorySelectOpen?: boolean;
  isExcludeSelectOpen?: boolean;
  isOrgUnitSelectExpanded?: boolean;
  isPlatformCostsChecked?: boolean;
  isTagValueDropdownOpen?: boolean;
  isTagKeySelectExpanded?: boolean;
  isTagValueSelectExpanded?: boolean;
  tagKeyValueInput?: string;
}

interface DataToolbarStateProps {
  isNegativeFilteringFeatureEnabled?: boolean;
  isPlatformCostsFeatureEnabled?: boolean;
}

interface GroupByOrgOption extends SelectOptionObject {
  id?: string;
}

interface CategoryOption extends SelectOptionObject {
  toString(): string; // label
  value?: string;
}

interface ExcludeOption extends SelectOptionObject {
  toString(): string; // label
  value?: string;
}

type DataToolbarProps = DataToolbarOwnProps & DataToolbarStateProps & WrappedComponentProps;

const defaultFilters = {
  tag: {},
};

// eslint-disable-next-line no-shadow
const enum ExcludeType {
  exclude = 'exclude',
  include = 'include',
}

export class DataToolbarBase extends React.Component<DataToolbarProps, DataToolbarState> {
  protected defaultState: DataToolbarState = {
    categoryInput: '',
    filters: cloneDeep(defaultFilters),
    isBulkSelectOpen: false,
    isCategorySelectOpen: false,
    isExcludeSelectOpen: false,
    isOrgUnitSelectExpanded: false,
    isPlatformCostsChecked: this.props.query ? this.props.query.category === platformCategoryKey : false,
    isTagValueDropdownOpen: false,
    isTagKeySelectExpanded: false,
    isTagValueSelectExpanded: false,
    tagKeyValueInput: '',
  };
  public state: DataToolbarState = { ...this.defaultState };

  public componentDidMount() {
    this.setState({
      currentCategory: this.getDefaultCategory(),
      currentExclude: ExcludeType.include,
    });
  }

  public componentDidUpdate(prevProps: DataToolbarProps) {
    const { categoryOptions, groupBy, orgReport, query, tagReport } = this.props;

    if (
      groupBy !== prevProps.groupBy ||
      (categoryOptions && !isEqual(categoryOptions, prevProps.categoryOptions)) ||
      (query && !isEqual(query, prevProps.query)) ||
      (orgReport && !isEqual(orgReport, prevProps.orgReport)) ||
      (tagReport && !isEqual(tagReport, prevProps.tagReport))
    ) {
      this.setState(() => {
        const filters = this.getActiveFilters(query);
        return categoryOptions !== prevProps.categoryOptions || prevProps.groupBy !== groupBy
          ? {
              categoryInput: '',
              currentCategory: this.getDefaultCategory(),
              currentOrgUnit: '',
              currentTagKey: '',
              filters,
              tagKeyValueInput: '',
              ...(prevProps.groupBy !== groupBy && { isPlatformCostsChecked: false }),
            }
          : {
              filters,
            };
      });
    }
  }

  // Initialize

  private getDefaultCategory = () => {
    const { categoryOptions, groupBy, query } = this.props;

    if (!categoryOptions) {
      return 'name';
    }
    if (query && query.group_by && query.group_by[orgUnitIdKey]) {
      return orgUnitIdKey;
    }
    for (const option of categoryOptions) {
      if (groupBy === option.key || (groupBy && groupBy.indexOf(tagPrefix) !== -1 && option.key === tagKey)) {
        return option.key;
      }
    }
    return categoryOptions[0].key;
  };

  private getFilter = (filterType: string, filterValue: string, isExcludes = false): Filter => {
    return { type: filterType, value: filterValue, isExcludes };
  };

  private getFilters = (filterType: string, filterValues: string[], isExcludes = false): Filter[] => {
    return filterValues.map(value => this.getFilter(filterType, value, isExcludes));
  };

  private getActiveFilters = query => {
    const filters = cloneDeep(defaultFilters);

    const parseFilters = (key, values, isExcludes = false) => {
      if (key.indexOf(tagPrefix) !== -1) {
        if (filters.tag[key.substring(tagPrefix.length)]) {
          filters.tag[key.substring(tagPrefix.length)] = [
            ...filters.tag[key.substring(tagPrefix.length)],
            ...this.getFilters(key, values, isExcludes),
          ];
        } else {
          filters.tag[key.substring(tagPrefix.length)] = this.getFilters(key, values, isExcludes);
        }
      } else if (filters[key]) {
        filters[key] = [...filters[key], ...this.getFilters(key, values, isExcludes)];
      } else {
        filters[key] = this.getFilters(key, values, isExcludes);
      }
    };

    if (query && query.filter_by) {
      Object.keys(query.filter_by).forEach(key => {
        const values = Array.isArray(query.filter_by[key]) ? [...query.filter_by[key]] : [query.filter_by[key]];
        parseFilters(key, values);
      });
    }
    if (query && query.exclude) {
      Object.keys(query.exclude).forEach(key => {
        const values = Array.isArray(query.exclude[key]) ? [...query.exclude[key]] : [query.exclude[key]];
        parseFilters(key, values, true);
      });
    }
    return filters;
  };

  private getChips = (filters: Filter[]): string[] => {
    const { intl } = this.props;

    const chips = [];
    if (filters) {
      filters.forEach(item => {
        chips.push({
          key: item.value,
          node: item.isExcludes ? intl.formatMessage(messages.excludeLabel, { value: item.value }) : item.value,
        });
      });
    }
    return chips;
  };

  private onDelete = (type: any, chip: any) => {
    const { intl } = this.props;
    const { filters } = this.state;

    // Todo: workaround for https://github.com/patternfly/patternfly-react/issues/3552
    // This prevents us from using a localized string, if necessary
    let _type = type && type.key ? type.key : type;
    if (_type && _type.indexOf(tagPrefix) !== -1) {
      _type = _type.slice(tagPrefix.length);
    }

    if (_type) {
      const excludePrefix = intl.formatMessage(messages.excludeLabel, { value: '' });
      let id = chip && chip.key ? chip.key : chip;
      if (id && id.indexOf(excludePrefix) !== -1) {
        const isExcludes = id ? id.indexOf(excludePrefix) !== -1 : false;
        id = isExcludes ? id.slice(excludePrefix.length) : id;
      }

      let filter;
      if (filters.tag[_type]) {
        filter = filters.tag[_type].find(item => item.value === id);
      } else if (filters[_type]) {
        filter = (filters[_type] as Filter[]).find(item => item.value === id);
      }

      this.setState(
        (prevState: any) => {
          if (prevState.filters.tag[_type]) {
            // Todo: use ID
            prevState.filters.tag[_type] = prevState.filters.tag[_type].filter(item => item.value !== id);
          } else if (prevState.filters[_type]) {
            prevState.filters[_type] = prevState.filters[_type].filter(item => item.value !== id);
          }
          return {
            filters: prevState.filters,
          };
        },
        () => {
          this.props.onFilterRemoved(filter);
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

  private hasFilters = () => {
    const { filters } = this.state;

    if (filters) {
      for (const filterKey of Object.keys(filters)) {
        if (filterKey === tagKey) {
          for (const tagFilterKey of Object.keys(filters[filterKey])) {
            if (filters[filterKey][tagFilterKey]) {
              return true;
            }
          }
        } else {
          return true;
        }
      }
    }
    return false;
  };

  // Bulk select

  public getBulkSelect = () => {
    const { intl, isAllSelected, isBulkSelectDisabled, isDisabled, itemsPerPage, itemsTotal, selectedItems } =
      this.props;
    const { isBulkSelectOpen } = this.state;

    const numSelected = isAllSelected ? itemsTotal : selectedItems ? selectedItems.length : 0;
    const allSelected = (isAllSelected || numSelected === itemsTotal) && itemsTotal > 0;
    const anySelected = numSelected > 0;
    const someChecked = anySelected ? null : false;
    const isChecked = allSelected ? true : someChecked;

    const dropdownItems = [
      <DropdownItem key="item-1" onClick={() => this.handleOnBulkSelectClicked('none')}>
        {intl.formatMessage(messages.toolBarBulkSelectNone)}
      </DropdownItem>,
      <DropdownItem key="item-2" onClick={() => this.handleOnBulkSelectClicked('page')}>
        {intl.formatMessage(messages.toolBarBulkSelectPage, { value: itemsPerPage })}
      </DropdownItem>,
      <DropdownItem key="item-3" onClick={() => this.handleOnBulkSelectClicked('all')}>
        {intl.formatMessage(messages.toolBarBulkSelectAll, { value: itemsTotal })}
      </DropdownItem>,
    ];

    return (
      <Dropdown
        onSelect={this.handleOnBulkSelect}
        position={DropdownPosition.left}
        toggle={
          <DropdownToggle
            isDisabled={isDisabled || isBulkSelectDisabled}
            splitButtonItems={[
              <DropdownToggleCheckbox
                id="bulk-select"
                key="bulk-select"
                aria-label={intl.formatMessage(
                  anySelected ? messages.toolBarBulkSelectAriaDeselect : messages.toolBarBulkSelectAriaSelect
                )}
                isChecked={isChecked}
                onClick={() => {
                  anySelected ? this.handleOnBulkSelectClicked('none') : this.handleOnBulkSelectClicked('all');
                }}
              />,
            ]}
            onToggle={this.handleOnBulkSelectToggle}
          >
            {numSelected !== 0 && (
              <React.Fragment>{intl.formatMessage(messages.selected, { value: numSelected })}</React.Fragment>
            )}
          </DropdownToggle>
        }
        isOpen={isBulkSelectOpen}
        dropdownItems={dropdownItems}
      />
    );
  };

  private handleOnBulkSelectClicked = (action: string) => {
    const { onBulkSelected } = this.props;

    if (onBulkSelected) {
      onBulkSelected(action);
    }
  };

  private handleOnBulkSelect = () => {
    this.setState({
      isBulkSelectOpen: !this.state.isBulkSelectOpen,
    });
  };

  private handleOnBulkSelectToggle = isOpen => {
    this.setState({
      isBulkSelectOpen: isOpen,
    });
  };

  // Category select

  public getCategorySelect(hasFilters: boolean) {
    const { categoryOptions, isDisabled } = this.props;
    const { currentCategory, isCategorySelectOpen } = this.state;

    if (!categoryOptions) {
      return null;
    }

    const selectOptions = this.getCategorySelectOptions();
    const selection = selectOptions.find((option: CategoryOption) => option.value === currentCategory);

    return (
      <ToolbarItem>
        <Select
          id="category-select"
          isDisabled={isDisabled && !hasFilters}
          isOpen={isCategorySelectOpen}
          onSelect={this.handleOnCategorySelect}
          onToggle={this.handleOnCategoryToggle}
          selections={selection}
          toggleIcon={<FilterIcon />}
          variant={SelectVariant.single}
        >
          {selectOptions.map(option => (
            <SelectOption key={option.value} value={option} />
          ))}
        </Select>
      </ToolbarItem>
    );
  }

  private getCategorySelectOptions = (): CategoryOption[] => {
    const { categoryOptions } = this.props;

    const options: CategoryOption[] = [];

    categoryOptions.map(option => {
      options.push({
        toString: () => option.name,
        value: option.key,
      });
    });
    return options;
  };

  private handleOnCategorySelect = (event, selection: CategoryOption) => {
    this.setState({
      categoryInput: '',
      currentCategory: selection.value,
      currentTagKey: undefined,
      isCategorySelectOpen: !this.state.isCategorySelectOpen,
    });
  };

  private handleOnCategoryToggle = isOpen => {
    this.setState({
      isCategorySelectOpen: isOpen,
    });
  };

  // Category input
  public getCategoryInput = (categoryOption: ToolbarChipGroup, hasFilters: boolean) => {
    const { intl, isDisabled, resourcePathsType } = this.props;
    const { currentCategory, filters, categoryInput } = this.state;

    return (
      <ToolbarFilter
        categoryName={categoryOption}
        chips={this.getChips(filters[categoryOption.key] as Filter[])}
        deleteChip={this.onDelete}
        key={categoryOption.key}
        showToolbarItem={currentCategory === categoryOption.key}
      >
        <InputGroup>
          {isResourceTypeValid(resourcePathsType, categoryOption.key as ResourceType) ? (
            <ResourceTypeahead
              ariaLabel={intl.formatMessage(messages.filterByInputAriaLabel, { value: categoryOption.key })}
              isDisabled={isDisabled && !hasFilters}
              onSelect={value => this.onCategoryInputSelect(value, categoryOption.key)}
              placeholder={intl.formatMessage(messages.filterByPlaceholder, { value: categoryOption.key })}
              resourcePathsType={resourcePathsType}
              resourceType={categoryOption.key as ResourceType}
            />
          ) : (
            <>
              <TextInput
                isDisabled={isDisabled && !hasFilters}
                name={`category-input-${categoryOption.key}`}
                id={`category-input-${categoryOption.key}`}
                type="search"
                aria-label={intl.formatMessage(messages.filterByInputAriaLabel, { value: categoryOption.key })}
                onChange={this.handleOnCategoryInputChange}
                value={categoryInput}
                placeholder={intl.formatMessage(messages.filterByPlaceholder, { value: categoryOption.key })}
                onKeyDown={evt => this.onCategoryInput(evt, categoryOption.key)}
              />
              <Button
                isDisabled={isDisabled && !hasFilters}
                variant={ButtonVariant.control}
                aria-label={intl.formatMessage(messages.filterByButtonAriaLabel, { value: categoryOption.key })}
                onClick={evt => this.onCategoryInput(evt, categoryOption.key)}
              >
                <SearchIcon />
              </Button>
            </>
          )}
        </InputGroup>
      </ToolbarFilter>
    );
  };

  private getDefaultCategoryOptions = (): ToolbarChipGroup[] => {
    const { intl } = this.props;

    return [{ name: intl.formatMessage(messages.names, { count: 1 }), key: 'name' }];
  };

  // Remove trailing commas -- see https://issues.redhat.com/browse/COST-3641
  private cleanInput = (value: string) => {
    const val = value.replace(/,\s*$/, '').replace(/&\s*$/, '');
    if (val.length === 0) {
      return undefined;
    }
    return val;
  };

  private handleOnCategoryInputChange = (value: string) => {
    const val = this.cleanInput(value);
    if (val) {
      this.setState({ categoryInput: val });
    }
  };

  private onCategoryInput = (event, key) => {
    const { categoryInput, currentCategory, currentExclude } = this.state;

    if ((event && event.key && event.key !== 'Enter') || categoryInput.trim() === '') {
      return;
    }

    const isExcludes = currentExclude === ExcludeType.exclude;
    const filter = this.getFilter(currentCategory, categoryInput, isExcludes);
    this.setState(
      (prevState: any) => {
        const prevItems = prevState.filters[key] ? prevState.filters[key] : [];
        return {
          filters: {
            ...prevState.filters,
            [currentCategory]:
              prevItems && prevItems.find(item => item.value === categoryInput)
                ? prevItems
                : prevItems
                ? [...prevItems, filter]
                : [filter],
          },
        };
      },
      () => {
        this.props.onFilterAdded(filter);
      }
    );
  };

  private onCategoryInputSelect = (value, key) => {
    const { currentCategory, currentExclude } = this.state;

    const val = this.cleanInput(value);
    if (!val) {
      return;
    }

    const isExcludes = currentExclude === ExcludeType.exclude;
    const filter = this.getFilter(currentCategory, val, isExcludes);
    this.setState(
      (prevState: any) => {
        const prevItems = prevState.filters[key] ? prevState.filters[key] : [];
        return {
          filters: {
            ...prevState.filters,
            [currentCategory]:
              prevItems && prevItems.find(item => item.value === val)
                ? prevItems
                : prevItems
                ? [...prevItems, filter]
                : [filter],
          },
        };
      },
      () => {
        this.props.onFilterAdded(filter);
      }
    );
  };

  // Exclude select

  public getExcludeSelect(hasFilters: boolean) {
    const { isDisabled } = this.props;
    const { currentExclude, isExcludeSelectOpen } = this.state;

    const selectOptions = this.getExcludeSelectOptions();
    const selection = selectOptions.find((option: ExcludeOption) => option.value === currentExclude);

    return (
      <ToolbarItem>
        <Select
          id="exclude-select"
          isDisabled={isDisabled && !hasFilters}
          isOpen={isExcludeSelectOpen}
          onSelect={this.handleOnExcludeSelect}
          onToggle={this.handleOnExcludeToggle}
          selections={selection}
          variant={SelectVariant.single}
        >
          {selectOptions.map(option => (
            <SelectOption key={option.value} value={option} />
          ))}
        </Select>
      </ToolbarItem>
    );
  }

  private getExcludeSelectOptions = (): ExcludeOption[] => {
    const { intl } = this.props;

    const excludeOptions = [
      { name: intl.formatMessage(messages.excludeValues, { value: 'excludes' }), key: ExcludeType.exclude },
      { name: intl.formatMessage(messages.excludeValues, { value: 'includes' }), key: ExcludeType.include },
    ];

    const options: ExcludeOption[] = [];
    excludeOptions.map(option => {
      options.push({
        toString: () => option.name,
        value: option.key,
      });
    });
    return options;
  };

  private handleOnExcludeSelect = (event, selection: ExcludeOption) => {
    this.setState({
      currentExclude: selection.value,
      isExcludeSelectOpen: !this.state.isExcludeSelectOpen,
    });
  };

  private handleOnExcludeToggle = isOpen => {
    this.setState({
      isExcludeSelectOpen: isOpen,
    });
  };

  // Org unit select
  public getOrgUnitSelect = (hasFilters: boolean) => {
    const { intl, isDisabled } = this.props;
    const { currentCategory, filters, isOrgUnitSelectExpanded } = this.state;

    const options: GroupByOrgOption[] = this.getOrgUnitOptions().map(option => ({
      id: option.key,
      toString: () => option.name,
      compareTo: value =>
        filters[orgUnitIdKey] ? (filters[orgUnitIdKey] as any).find(filter => filter.value === value.id) : false,
    }));

    const chips = []; // Get selected items as PatternFly's ToolbarChip type
    const selections = []; // Select options and selections must be same type
    if (filters[orgUnitIdKey] && Array.isArray(filters[orgUnitIdKey])) {
      (filters[orgUnitIdKey] as any).map(filter => {
        const option = options.find(item => item.id === filter.value);
        if (option) {
          selections.push(option);
          chips.push({
            key: option.id,
            node: filter.isExcludes
              ? intl.formatMessage(messages.excludeLabel, { value: option.toString() })
              : option.toString(),
          });
        }
      });
    }

    // Todo: selectOverride is a workaround for https://github.com/patternfly/patternfly-react/issues/4477
    // and https://github.com/patternfly/patternfly-react/issues/6371
    return (
      <ToolbarFilter
        categoryName={{
          key: orgUnitIdKey,
          name: intl.formatMessage(messages.filterByValues, { value: 'org_unit_id' }),
        }}
        chips={chips}
        deleteChip={this.onDelete}
        key={orgUnitIdKey}
        showToolbarItem={currentCategory === orgUnitIdKey}
      >
        <Select
          isDisabled={isDisabled && !hasFilters}
          className="selectOverride"
          variant={SelectVariant.checkbox}
          aria-label={intl.formatMessage(messages.filterByOrgUnitAriaLabel)}
          onToggle={this.handleOnOrgUnitToggle}
          onSelect={this.handleOnOrgUnitSelect}
          selections={selections}
          isOpen={isOrgUnitSelectExpanded}
          placeholderText={intl.formatMessage(messages.filterByOrgUnitPlaceholder)}
        >
          {options.map(option => (
            <SelectOption description={option.id} key={option.id} value={option} />
          ))}
        </Select>
      </ToolbarFilter>
    );
  };

  private getOrgUnitOptions(): ToolbarChipGroup[] {
    const { orgReport } = this.props;

    let options = [];
    if (!(orgReport && orgReport.data)) {
      return options;
    }

    // Sort all names first
    const sortedData = orgReport.data.sort((a, b) => {
      if (a[orgUnitNameKey] < b[orgUnitNameKey]) {
        return -1;
      }
      if (a[orgUnitNameKey] > b[orgUnitNameKey]) {
        return 1;
      }
      return 0;
    });

    // Move roots first
    const roots = sortedData.filter(org => org.level === 0);

    const filteredOrgs = sortedData.filter(org => org.level !== 0);
    roots.map(root => {
      const item = sortedData.find(org => org[orgUnitIdKey] === root[orgUnitIdKey]);
      filteredOrgs.unshift(item);
    });

    if (filteredOrgs.length > 0) {
      options = filteredOrgs.map(org => {
        return {
          key: org[orgUnitIdKey],
          name: org[orgUnitNameKey],
        };
      });
    }
    return options;
  }

  private handleOnOrgUnitSelect = (event, selection) => {
    const { currentExclude, filters } = this.state;

    const checked = event.target.checked;
    let filter;
    if (checked) {
      const isExcludes = currentExclude === ExcludeType.exclude;
      filter = this.getFilter(orgUnitIdKey, selection.id, isExcludes);
    } else if (filters[orgUnitIdKey]) {
      filter = (filters[orgUnitIdKey] as Filter[]).find(item => item.value === selection.id);
    }

    this.setState(
      (prevState: any) => {
        const prevItems = prevState.filters[orgUnitIdKey] ? prevState.filters[orgUnitIdKey] : [];
        return {
          filters: {
            ...prevState.filters,
            tag: {
              ...prevState.filters.tag,
            },
            [orgUnitIdKey]: checked ? [...prevItems, filter] : prevItems.filter(item => item.value !== filter.value),
          },
        };
      },
      () => {
        if (checked) {
          this.props.onFilterAdded(filter);
        } else {
          this.props.onFilterRemoved(filter);
        }
      }
    );
  };

  private handleOnOrgUnitToggle = isOpen => {
    this.setState({
      isOrgUnitSelectExpanded: isOpen,
    });
  };

  // Tag key select

  public getTagKeySelect = (hasFilters: boolean) => {
    const { intl, isDisabled } = this.props;
    const { currentCategory, currentTagKey, isTagKeySelectExpanded } = this.state;

    if (currentCategory !== tagKey) {
      return null;
    }

    const selectOptions = this.getTagKeyOptions().map(selectOption => {
      return <SelectOption key={selectOption.key} value={selectOption.key} />;
    });

    return (
      <ToolbarItem>
        <Select
          isDisabled={isDisabled && !hasFilters}
          variant={SelectVariant.typeahead}
          typeAheadAriaLabel={intl.formatMessage(messages.filterByTagKeyAriaLabel)}
          onClear={this.handleOnTagKeyClear}
          onToggle={this.handleOnTagKeyToggle}
          onSelect={this.handleOnTagKeySelect}
          isOpen={isTagKeySelectExpanded}
          placeholderText={intl.formatMessage(messages.filterByTagKeyPlaceholder)}
          selections={currentTagKey}
        >
          {selectOptions}
        </Select>
      </ToolbarItem>
    );
  };

  private getTagKeyOptions(): ToolbarChipGroup[] {
    const { tagReport } = this.props;

    let data = [];
    let options = [];

    if (!(tagReport && tagReport.data)) {
      return options;
    }

    // If the key_only param is used, we have an array of strings
    let hasTagKeys = false;
    for (const item of tagReport.data) {
      if (item.hasOwnProperty('key')) {
        hasTagKeys = true;
        break;
      }
    }

    // Workaround for https://github.com/project-koku/koku/issues/1797
    if (hasTagKeys) {
      const keepData = tagReport.data.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ type, ...keepProps }: any) => keepProps
      );
      data = uniqBy(keepData, 'key');
    } else {
      data = uniq(tagReport.data);
    }

    if (data.length > 0) {
      options = data.map(item => {
        const key = hasTagKeys ? item.key : item;
        return {
          key,
          name: key, // tag keys not localized
        };
      });
    }
    return options;
  }

  private handleOnTagKeyClear = () => {
    this.setState({
      currentTagKey: undefined,
      isTagKeySelectExpanded: false,
    });
  };

  private handleOnTagKeySelect = (event, selection) => {
    this.setState({
      currentTagKey: selection,
      isTagKeySelectExpanded: !this.state.isTagKeySelectExpanded,
    });
  };

  private handleOnTagKeyToggle = isOpen => {
    this.setState({
      isTagKeySelectExpanded: isOpen,
    });
  };

  // Tag value select

  public getTagValueSelect = (tagKeyOption: ToolbarChipGroup, hasFilters: boolean) => {
    const { isDisabled, tagReportPathsType } = this.props;
    const { currentCategory, currentTagKey, filters, tagKeyValueInput } = this.state;

    // Todo: categoryName workaround for https://issues.redhat.com/browse/COST-2094
    const categoryName = {
      name: tagKeyOption.name,
      key: `${tagPrefix}${tagKeyOption.key}`,
    };

    return (
      <ToolbarFilter
        categoryName={categoryName}
        chips={this.getChips(filters.tag[tagKeyOption.key])}
        deleteChip={this.onDelete}
        key={tagKeyOption.key}
        showToolbarItem={currentCategory === tagKey && currentTagKey === tagKeyOption.key}
      >
        <TagValue
          isDisabled={isDisabled && !hasFilters}
          onTagValueSelect={this.onTagValueSelect}
          onTagValueInput={this.onTagValueInput}
          onTagValueInputChange={this.onTagValueInputChange}
          selections={filters.tag[tagKeyOption.key] ? filters.tag[tagKeyOption.key].map(filter => filter.value) : []}
          tagKey={currentTagKey}
          tagKeyValue={tagKeyValueInput}
          tagReportPathsType={tagReportPathsType}
        />
      </ToolbarFilter>
    );
  };

  private onTagValueInputChange = value => {
    this.setState({ tagKeyValueInput: value });
  };

  private onTagValueInput = event => {
    const { currentExclude, currentTagKey, tagKeyValueInput } = this.state;

    if ((event.key && event.key !== 'Enter') || tagKeyValueInput.trim() === '') {
      return;
    }

    const isExcludes = currentExclude === ExcludeType.exclude;
    const filter = this.getFilter(`${tagPrefix}${currentTagKey}`, tagKeyValueInput, isExcludes);

    this.setState(
      (prevState: any) => {
        const prevItems = prevState.filters.tag[currentTagKey] ? prevState.filters.tag[currentTagKey] : [];
        for (const item of prevItems) {
          if (item.value === tagKeyValueInput) {
            return {
              ...prevState.filters,
              tagKeyValueInput: '',
            };
          }
        }
        return {
          filters: {
            ...prevState.filters,
            tag: {
              ...prevState.filters.tag,
              [currentTagKey]: [...prevItems, filter],
            },
          },
          tagKeyValueInput: '',
        };
      },
      () => {
        this.props.onFilterAdded(filter);
      }
    );
  };

  private onTagValueSelect = (event, selection) => {
    const { currentExclude, currentTagKey, filters } = this.state;

    const checked = event.target.checked;
    let filter;
    if (checked) {
      const isExcludes = currentExclude === ExcludeType.exclude;
      filter = this.getFilter(`${tagPrefix}${currentTagKey}`, selection, isExcludes);
    } else if (filters.tag[currentTagKey]) {
      filter = filters.tag[currentTagKey].find(item => item.value === selection);
    }

    this.setState(
      (prevState: any) => {
        const prevItems = prevState.filters.tag[currentTagKey] ? prevState.filters.tag[currentTagKey] : [];
        return {
          filters: {
            ...prevState.filters,
            tag: {
              ...prevState.filters.tag,
              [currentTagKey]: checked ? [...prevItems, filter] : prevItems.filter(item => item.value !== filter.value),
            },
          },
        };
      },
      () => {
        if (checked) {
          this.props.onFilterAdded(filter);
        } else {
          this.props.onFilterRemoved(filter);
        }
      }
    );
  };

  // Column management

  public getColumnManagement = () => {
    const { intl, isDisabled } = this.props;
    return (
      <ToolbarItem visibility={{ default: 'hidden', '2xl': 'visible', xl: 'visible', lg: 'hidden' }}>
        <Button isDisabled={isDisabled} onClick={this.handleColumnManagementClicked} variant={ButtonVariant.link}>
          {intl.formatMessage(messages.detailsColumnManagementTitle)}
        </Button>
      </ToolbarItem>
    );
  };

  // Export button

  public getExportButton = () => {
    const { isDisabled, isExportDisabled } = this.props;

    return (
      <ToolbarItem
        spacer={{
          default: 'spacerNone',
        }}
      >
        <Button
          aria-label="Export data"
          isDisabled={isDisabled || isExportDisabled}
          onClick={this.handleExportClicked}
          variant={ButtonVariant.plain}
        >
          <ExportIcon />
        </Button>
      </ToolbarItem>
    );
  };

  // Platform costs

  public getPlatformCosts = () => {
    const { intl, isDisabled } = this.props;
    const { isPlatformCostsChecked } = this.state;
    return (
      <ToolbarItem visibility={{ default: 'hidden', '2xl': 'visible', xl: 'visible', lg: 'hidden' }}>
        <Switch
          id="platform-costs"
          label={intl.formatMessage(messages.sumPlatformCosts)}
          isChecked={isPlatformCostsChecked}
          isDisabled={isDisabled}
          onChange={this.handlePlatformCostsChanged}
        />
      </ToolbarItem>
    );
  };

  // Kebab

  public getKebab = () => {
    const { showColumnManagement, showPlatformCosts } = this.props;
    const { isPlatformCostsChecked } = this.state;

    const options = [];
    if (showColumnManagement) {
      options.push({
        label: messages.detailsColumnManagementTitle,
        onClick: this.handleColumnManagementClicked,
      });
    }
    if (showPlatformCosts) {
      options.push({
        label: messages.sumPlatformCosts,
        onClick: () => this.handlePlatformCostsChanged(!isPlatformCostsChecked),
      });
    }
    return (
      <ToolbarItem visibility={{ xl: 'hidden' }}>
        <DataKebab options={options} />
      </ToolbarItem>
    );
  };

  private handleColumnManagementClicked = () => {
    const { onColumnManagementClicked } = this.props;
    if (onColumnManagementClicked) {
      onColumnManagementClicked();
    }
  };

  private handleExportClicked = () => {
    const { onExportClicked } = this.props;
    if (onExportClicked) {
      onExportClicked();
    }
  };

  private handlePlatformCostsChanged = (checked: boolean) => {
    const { onPlatformCostsChanged } = this.props;
    const { isPlatformCostsChecked } = this.state;
    this.setState({ isPlatformCostsChecked: !isPlatformCostsChecked }, () => {
      if (onPlatformCostsChanged) {
        onPlatformCostsChanged(checked);
      }
    });
  };

  public render() {
    const {
      categoryOptions,
      dateRange,
      datePicker,
      isNegativeFilteringFeatureEnabled,
      isPlatformCostsFeatureEnabled,
      pagination,
      showBulkSelect,
      showColumnManagement,
      showExport,
      showFilter,
      showPlatformCosts,
      style,
    } = this.props;
    const options = categoryOptions ? categoryOptions : this.getDefaultCategoryOptions();
    const hasFilters = this.hasFilters();

    // Todo: clearAllFilters workaround https://github.com/patternfly/patternfly-react/issues/4222
    return (
      <div style={style ? style : styles.toolbarContainer}>
        <Toolbar
          className="toolbarOverride"
          clearAllFilters={this.onDelete as any}
          collapseListedFiltersBreakpoint="xl"
        >
          <ToolbarContent>
            {showBulkSelect && <ToolbarItem variant="bulk-select">{this.getBulkSelect()}</ToolbarItem>}
            {showFilter && (
              <ToolbarToggleGroup breakpoint="xl" toggleIcon={<FilterIcon />}>
                <ToolbarGroup variant="filter-group">
                  {this.getCategorySelect(hasFilters)}
                  {isNegativeFilteringFeatureEnabled && this.getExcludeSelect(hasFilters)}
                  {this.getTagKeySelect(hasFilters)}
                  {this.getTagKeyOptions().map(option => this.getTagValueSelect(option, hasFilters))}
                  {this.getOrgUnitSelect(hasFilters)}
                  {options &&
                    options
                      .filter(option => option.key !== tagKey && option.key !== orgUnitIdKey)
                      .map(option => this.getCategoryInput(option, hasFilters))}
                </ToolbarGroup>
              </ToolbarToggleGroup>
            )}
            {(showExport || showColumnManagement) && (
              <ToolbarGroup>
                {showColumnManagement && this.getColumnManagement()}
                {showPlatformCosts && isPlatformCostsFeatureEnabled && this.getPlatformCosts()}
                {showExport && this.getExportButton()}
                {(showColumnManagement || showPlatformCosts) && this.getKebab()}
              </ToolbarGroup>
            )}
            {(dateRange || datePicker) && (
              <ToolbarGroup>
                {dateRange}
                {datePicker}
              </ToolbarGroup>
            )}
            <ToolbarItem alignment={{ default: 'alignRight' }} variant="pagination">
              {pagination}
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<DataToolbarOwnProps, DataToolbarStateProps>(state => {
  return {
    isNegativeFilteringFeatureEnabled: featureFlagsSelectors.selectIsNegativeFilteringFeatureEnabled(state),
    isPlatformCostsFeatureEnabled: featureFlagsSelectors.selectIsPlatformCostsFeatureEnabled(state),
  };
});

const DataToolbar = injectIntl(connect(mapStateToProps, {})(DataToolbarBase));

export default DataToolbar;
