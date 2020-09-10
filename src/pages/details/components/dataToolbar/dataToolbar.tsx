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
  SelectOptionObject,
  SelectVariant,
  TextInput,
  Toolbar,
  ToolbarChipGroup,
  ToolbarContent,
  ToolbarFilter,
  ToolbarGroup,
  ToolbarItem,
  ToolbarToggleGroup,
} from '@patternfly/react-core';
import { ExportIcon } from '@patternfly/react-icons/dist/js/icons/export-icon';
import { FilterIcon } from '@patternfly/react-icons/dist/js/icons/filter-icon';
import { SearchIcon } from '@patternfly/react-icons/dist/js/icons/search-icon';
import {
  orgUnitIdKey,
  orgUnitNameKey,
  Query,
  tagKey,
  tagPrefix,
} from 'api/queries/query';
import { cloneDeep } from 'lodash';
import { uniq, uniqBy } from 'lodash';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { isEqual } from 'utils/equal';
import { selectOverride, styles } from './dataToolbar.styles';
import { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import { Report } from 'api/reports/report';

interface Filters {
  [key: string]: string[] | { [key: string]: string[] };
}

interface DataToolbarOwnProps {
  categoryOptions?: ToolbarChipGroup[]; // Options for category menu
  groupBy?: string; // Sync category selection with groupBy value
  isAllSelected?: boolean;
  isBulkSelectDisabled?: boolean;
  isExportDisabled?: boolean; // Show export icon as disabled
  itemsPerPage?: number;
  itemsTotal?: number;
  onBulkSelected(action: string);
  onExportClicked();
  onFilterAdded(filterType: string, filterValue: string);
  onFilterRemoved(filterType: string, filterValue?: string);
  orgReport?: Report; // Report containing AWS organizational unit data
  pagination?: React.ReactNode; // Optional pagination controls to display in toolbar
  query?: Query; // Query containing filter_by params used to restore state upon page refresh
  tagReport?: Report; // Report containing tag key and value data
  selectedItems?: ComputedReportItem[];
  showExport?: boolean; // Show export icon
}

interface DataToolbarState {
  categoryInput?: string;
  currentCategory?: string;
  currentOrgUnit?: string;
  currentTagKey?: string;
  filters: Filters;
  isBulkSelectOpen: boolean;
  isCategoryDropdownOpen: boolean;
  isOrgUnitSelectExpanded: boolean;
  isTagValueDropdownOpen: boolean;
  isTagKeySelectExpanded: boolean;
  isTagValueSelectExpanded: boolean;
  tagKeyValueInput?: string;
}

interface GroupByOrgOption extends SelectOptionObject {
  id?: string;
}

type DataToolbarProps = DataToolbarOwnProps & InjectedTranslateProps;

const defaultFilters = {
  tag: {},
};

// If the number of tag keys are greater or equal, then show text input Vs select
// See https://github.com/project-koku/koku/pull/2069
const tagKeyValueLimit = 50;

export class DataToolbarBase extends React.Component<DataToolbarProps> {
  protected defaultState: DataToolbarState = {
    categoryInput: '',
    filters: cloneDeep(defaultFilters),
    isBulkSelectOpen: false,
    isCategoryDropdownOpen: false,
    isOrgUnitSelectExpanded: false,
    isTagValueDropdownOpen: false,
    isTagKeySelectExpanded: false,
    isTagValueSelectExpanded: false,
    tagKeyValueInput: '',
  };
  public state: DataToolbarState = { ...this.defaultState };

  public componentDidMount() {
    this.setState({
      currentCategory: this.getDefaultCategory(),
    });
  }

  public componentDidUpdate(prevProps: DataToolbarProps) {
    const {
      categoryOptions,
      groupBy,
      orgReport,
      query,
      tagReport,
    } = this.props;

    if (
      categoryOptions !== prevProps.categoryOptions ||
      groupBy !== prevProps.groupBy ||
      (query && !isEqual(query, prevProps.query)) ||
      (orgReport && !isEqual(orgReport, prevProps.orgReport)) ||
      (tagReport && !isEqual(tagReport, prevProps.tagReport))
    ) {
      this.setState(() => {
        const filters = this.getActiveFilters(query);
        return categoryOptions !== prevProps.categoryOptions ||
          prevProps.groupBy !== groupBy
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
    const { categoryOptions, groupBy, query } = this.props;

    if (!categoryOptions) {
      return 'name';
    }
    if (query && query.group_by && query.group_by[orgUnitIdKey]) {
      return orgUnitIdKey;
    }
    for (const option of categoryOptions) {
      if (
        groupBy === option.key ||
        (groupBy && groupBy.indexOf(tagPrefix) !== -1 && option.key === tagKey)
      ) {
        return option.key;
      }
    }
    return categoryOptions[0].key;
  };

  private getActiveFilters = query => {
    const filters = cloneDeep(defaultFilters);

    if (query && query.filter_by) {
      Object.keys(query.filter_by).forEach(key => {
        const values = Array.isArray(query.filter_by[key])
          ? [...query.filter_by[key]]
          : [query.filter_by[key]];

        if (key.indexOf(tagPrefix) !== -1) {
          filters.tag[key.substring(tagPrefix.length)] = values;
        } else {
          filters[key] = values;
        }
      });
    }
    return filters;
  };

  private onDelete = (type: any, chip: any) => {
    // Todo: workaround for https://github.com/patternfly/patternfly-react/issues/3552
    // This prevents us from using a localized string, if necessary
    const filterType = type && type.key ? type.key : type;
    const id = chip && chip.key ? chip.key : chip;

    if (filterType) {
      this.setState(
        (prevState: any) => {
          if (prevState.filters.tag[filterType]) {
            // Todo: use ID
            prevState.filters.tag[filterType] = prevState.filters.tag[
              filterType
            ].filter(s => s !== id);
          } else if (prevState.filters[filterType]) {
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
            ? `${tagPrefix}${filterType}`
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

  // Bulk select

  public getBulkSelect = () => {
    const {
      isAllSelected,
      isBulkSelectDisabled = false,
      itemsPerPage,
      itemsTotal,
      selectedItems,
      t,
    } = this.props;
    const { isBulkSelectOpen } = this.state;

    const numSelected = isAllSelected
      ? itemsTotal
      : selectedItems
      ? selectedItems.length
      : 0;
    const allSelected =
      (isAllSelected || numSelected === itemsTotal) && itemsTotal > 0;
    const anySelected = numSelected > 0;
    const someChecked = anySelected ? null : false;
    const isChecked = allSelected ? true : someChecked;

    const dropdownItems = [
      <DropdownItem
        key="item-1"
        onClick={() => this.onBulkSelectClicked('none')}
      >
        {t('toolbar.bulk_select.select_none')}
      </DropdownItem>,
      <DropdownItem
        key="item-2"
        onClick={() => this.onBulkSelectClicked('page')}
      >
        {t('toolbar.bulk_select.select_page', {
          value: itemsPerPage,
        })}
      </DropdownItem>,
      <DropdownItem
        key="item-3"
        onClick={() => this.onBulkSelectClicked('all')}
      >
        {t('toolbar.bulk_select.select_all', { value: itemsTotal })}
      </DropdownItem>,
    ];

    return (
      <Dropdown
        onSelect={this.onBulkSelect}
        position={DropdownPosition.left}
        toggle={
          <DropdownToggle
            isDisabled={isBulkSelectDisabled}
            splitButtonItems={[
              <DropdownToggleCheckbox
                id="bulk-select"
                key="bulk-select"
                aria-label={
                  anySelected
                    ? t('toolbar.bulk_select.aria_deselect')
                    : t('toolbar.bulk_select.aria_select')
                }
                isChecked={isChecked}
                onClick={() => {
                  anySelected
                    ? this.onBulkSelectClicked('none')
                    : this.onBulkSelectClicked('all');
                }}
              ></DropdownToggleCheckbox>,
            ]}
            onToggle={this.onBulkSelectToggle}
          >
            {numSelected !== 0 && (
              <React.Fragment>{numSelected} selected</React.Fragment>
            )}
          </DropdownToggle>
        }
        isOpen={isBulkSelectOpen}
        dropdownItems={dropdownItems}
      />
    );
  };

  private onBulkSelectClicked = (action: string) => {
    const { onBulkSelected } = this.props;

    if (onBulkSelected) {
      onBulkSelected(action);
    }
  };

  private onBulkSelect = () => {
    this.setState({
      isBulkSelectOpen: !this.state.isBulkSelectOpen,
    });
  };

  private onBulkSelectToggle = isOpen => {
    this.setState({
      isBulkSelectOpen: isOpen,
    });
  };

  // Category dropdown

  public getCategoryDropdown() {
    const { categoryOptions } = this.props;
    const { isCategoryDropdownOpen } = this.state;

    if (!categoryOptions) {
      return null;
    }
    return (
      <ToolbarItem>
        <Dropdown
          onSelect={this.onCategorySelect}
          position={DropdownPosition.left}
          toggle={
            <DropdownToggle
              onToggle={this.onCategoryToggle}
              style={{ width: '100%' }}
            >
              <FilterIcon /> {this.getCurrentCategoryOption().name}
            </DropdownToggle>
          }
          isOpen={isCategoryDropdownOpen}
          dropdownItems={
            categoryOptions &&
            categoryOptions.map(option => (
              <DropdownItem
                key={option.key}
                onClick={() => this.onCategoryClick(option.key)}
              >
                {option.name}
              </DropdownItem>
            ))
          }
          style={{ width: '100%' }}
        />
      </ToolbarItem>
    );
  }

  private getCurrentCategoryOption = (): ToolbarChipGroup => {
    const { categoryOptions } = this.props;
    const { currentCategory } = this.state;

    if (!categoryOptions) {
      return undefined;
    }
    for (const option of categoryOptions) {
      if (currentCategory === option.key) {
        return option;
      }
    }
    return categoryOptions[0];
  };

  private onCategoryClick = value => {
    this.setState({
      currentCategory: value,
    });
  };

  private onCategorySelect = () => {
    this.setState({
      categoryInput: '',
      currentTagKey: undefined,
      isCategoryDropdownOpen: !this.state.isCategoryDropdownOpen,
    });
  };

  private onCategoryToggle = isOpen => {
    this.setState({
      isCategoryDropdownOpen: isOpen,
    });
  };

  // Category input

  public getCategoryInput = categoryOption => {
    const { t } = this.props;
    const { currentCategory, filters, categoryInput } = this.state;

    return (
      <ToolbarFilter
        categoryName={categoryOption}
        chips={filters[categoryOption.key] as any}
        deleteChip={this.onDelete}
        key={categoryOption.key}
        showToolbarItem={currentCategory === categoryOption.key}
      >
        <InputGroup>
          <TextInput
            name={`${categoryOption.key}-input`}
            id={`${categoryOption.key}-input`}
            type="search"
            aria-label={t(`filter_by.${categoryOption.key}_input_aria_label`)}
            onChange={this.onCategoryInputChange}
            value={categoryInput}
            placeholder={t(`filter_by.${categoryOption.key}_placeholder`)}
            onKeyDown={evt => this.onCategoryInput(evt, categoryOption.key)}
          />
          <Button
            variant={ButtonVariant.control}
            aria-label={t(`filter_by.${categoryOption.key}_button_aria_label`)}
            onClick={evt => this.onCategoryInput(evt, categoryOption.key)}
          >
            <SearchIcon />
          </Button>
        </InputGroup>
      </ToolbarFilter>
    );
  };

  private getDefaultCategoryOptions = (): ToolbarChipGroup[] => {
    const { t } = this.props;

    return [{ name: t('filter_by.values.name'), key: 'name' }];
  };

  private onCategoryInputChange = value => {
    this.setState({ categoryInput: value });
  };

  private onCategoryInput = (event, key) => {
    const { categoryInput, currentCategory } = this.state;

    if ((event.key && event.key !== 'Enter') || categoryInput.trim() === '') {
      return;
    }
    this.setState(
      (prevState: any) => {
        const prevFilters = prevState.filters[key];
        return {
          filters: {
            ...prevState.filters,
            [currentCategory]:
              prevFilters && prevFilters.includes(categoryInput)
                ? prevFilters
                : prevFilters
                ? [...prevFilters, categoryInput]
                : [categoryInput],
          },
          categoryInput: '',
        };
      },
      () => {
        this.props.onFilterAdded(currentCategory, categoryInput);
      }
    );
  };

  // Org unit select

  public getOrgUnitSelect = () => {
    const { t } = this.props;
    const { currentCategory, filters, isOrgUnitSelectExpanded } = this.state;

    const options: GroupByOrgOption[] = this.getOrgUnitOptions().map(
      option => ({
        id: option.key,
        toString: () => option.name,
        compareTo: value =>
          filters[orgUnitIdKey]
            ? (filters[orgUnitIdKey] as any).find(val => val === value.id)
            : false,
      })
    );

    const chips = []; // Get selected items as PatternFly's ToolbarChip type
    const selections = []; // Select options and selections must be same type
    if (filters[orgUnitIdKey] && Array.isArray(filters[orgUnitIdKey])) {
      (filters[orgUnitIdKey] as any).map(id => {
        const option = options.find(val => val.id === id);
        if (option) {
          selections.push(option);
          chips.push({
            key: option.id,
            node: option.toString(),
          });
        }
      });
    }

    // Todo: selectOverride is a workaround for https://github.com/patternfly/patternfly-react/issues/4477
    return (
      <ToolbarFilter
        categoryName={{
          key: orgUnitIdKey,
          name: t('filter_by.values.org_unit_id'),
        }}
        chips={chips}
        deleteChip={this.onDelete}
        key={orgUnitIdKey}
        showToolbarItem={currentCategory === orgUnitIdKey}
      >
        <Select
          className={selectOverride}
          variant={SelectVariant.checkbox}
          aria-label={t('filter_by.org_unit_aria_label')}
          onToggle={this.onOrgUnitToggle}
          onSelect={this.onOrgUnitSelect}
          selections={selections}
          isOpen={isOrgUnitSelectExpanded}
          placeholderText={t('filter_by.org_unit_placeholder')}
        >
          {options.map(option => (
            <SelectOption
              description={option.id}
              key={option.id}
              value={option}
            />
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
      const item = sortedData.find(
        org => org[orgUnitIdKey] === root[orgUnitIdKey]
      );
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

  private onOrgUnitSelect = (event, selection) => {
    const checked = event.target.checked;

    this.setState(
      (prevState: any) => {
        const prevSelections = prevState.filters[orgUnitIdKey]
          ? prevState.filters[orgUnitIdKey]
          : [];
        return {
          filters: {
            ...prevState.filters,
            tag: {
              ...prevState.filters.tag,
            },
            [orgUnitIdKey]: checked
              ? [...prevSelections, selection.id]
              : prevSelections.filter(value => value !== selection.id),
          },
        };
      },
      () => {
        if (checked) {
          this.props.onFilterAdded(orgUnitIdKey, selection.id);
        } else {
          this.onDelete(orgUnitIdKey, selection.id);
        }
      }
    );
  };

  private onOrgUnitToggle = isOpen => {
    this.setState({
      isOrgUnitSelectExpanded: isOpen,
    });
  };

  // Tag key select

  public getTagKeySelect = () => {
    const { t } = this.props;
    const {
      currentCategory,
      currentTagKey,
      isTagKeySelectExpanded,
    } = this.state;

    if (currentCategory !== tagKey) {
      return null;
    }

    const selectOptions = this.getTagKeyOptions().map(selectOption => {
      return <SelectOption key={selectOption.key} value={selectOption.key} />;
    });

    return (
      <ToolbarItem>
        <Select
          variant={SelectVariant.typeahead}
          aria-label={t('filter_by.tag_key_aria_label')}
          onClear={this.onTagKeyClear}
          onToggle={this.onTagKeyToggle}
          onSelect={this.onTagKeySelect}
          isOpen={isTagKeySelectExpanded}
          placeholderText={t('filter_by.tag_key_placeholder')}
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
        ({ type, ...keepProps }) => keepProps
      );
      data = uniqBy(keepData, 'key');
    } else {
      data = uniq(tagReport.data);
    }

    if (data.length > 0) {
      options = data.map(tag => {
        const key = hasTagKeys ? tag.key : tag;
        return {
          key,
          name: key, // tag keys not localized
        };
      });
    }
    return options;
  }

  private onTagKeyClear = () => {
    this.setState({
      currentTagKey: undefined,
      isTagKeySelectExpanded: false,
    });
  };

  private onTagKeySelect = (event, selection) => {
    this.setState({
      currentTagKey: selection,
      isTagKeySelectExpanded: !this.state.isTagKeySelectExpanded,
    });
  };

  private onTagKeyToggle = isOpen => {
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
      tagKeyValueInput,
    } = this.state;

    const selectOptions = this.getTagValueOptions().map(selectOption => {
      return <SelectOption key={selectOption.key} value={selectOption.key} />;
    });

    return (
      <ToolbarFilter
        categoryName={tagKeyOption}
        chips={filters.tag[tagKeyOption.key]}
        deleteChip={this.onDelete}
        key={tagKeyOption.key}
        showToolbarItem={
          currentCategory === tagKey && currentTagKey === tagKeyOption.key
        }
      >
        {selectOptions.length < tagKeyValueLimit ? (
          <Select
            variant={SelectVariant.checkbox}
            aria-label={t('filter_by.tag_value_aria_label')}
            onToggle={this.onTagValueToggle}
            onSelect={this.onTagValueSelect}
            selections={
              filters.tag[tagKeyOption.key] ? filters.tag[tagKeyOption.key] : []
            }
            isOpen={isTagValueSelectExpanded}
            placeholderText={t('filter_by.tag_value_placeholder')}
          >
            {selectOptions}
          </Select>
        ) : (
          <InputGroup>
            <TextInput
              name="tagkeyvalue-input"
              id="tagkeyvalue-input"
              type="search"
              aria-label={t('filter_by.tag_value_aria_label')}
              onChange={this.onTagValueInputChange}
              value={tagKeyValueInput}
              placeholder={t('filter_by.tag_value_input_placeholder')}
              onKeyDown={evt => this.onTagValueInput(evt)}
            />
            <Button
              variant={ButtonVariant.control}
              aria-label={t('filter_by.tag_value_button_aria_label')}
              onClick={evt => this.onTagValueInput(evt)}
            >
              <SearchIcon />
            </Button>
          </InputGroup>
        )}
      </ToolbarFilter>
    );
  };

  private getTagValueOptions(): ToolbarChipGroup[] {
    const { tagReport } = this.props;
    const { currentTagKey } = this.state;

    let data = [];
    if (tagReport && tagReport.data) {
      data = [...new Set([...tagReport.data])]; // prune duplicates
    }

    let options = [];
    if (data.length > 0) {
      for (const tag of data) {
        if (currentTagKey === tag.key && tag.values) {
          options = tag.values.map(val => {
            return {
              key: val,
              name: val, // tag key values not localized
            };
          });
          break;
        }
      }
    }
    return options;
  }

  private onTagValueInputChange = value => {
    this.setState({ tagKeyValueInput: value });
  };

  private onTagValueInput = event => {
    const { currentTagKey, tagKeyValueInput } = this.state;

    if (
      (event.key && event.key !== 'Enter') ||
      tagKeyValueInput.trim() === ''
    ) {
      return;
    }
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
              [currentTagKey]: [...prevSelections, tagKeyValueInput],
            },
          },
          tagKeyValueInput: '',
        };
      },
      () => {
        this.props.onFilterAdded(
          `${tagPrefix}${currentTagKey}`,
          tagKeyValueInput
        );
      }
    );
  };

  private onTagValueSelect = (event, selection) => {
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
          this.props.onFilterAdded(`${tagPrefix}${currentTagKey}`, selection);
        } else {
          this.onDelete(currentTagKey, selection);
        }
      }
    );
  };

  private onTagValueToggle = isOpen => {
    this.setState({
      isTagValueSelectExpanded: isOpen,
    });
  };

  // Export button

  public getExportButton = () => {
    const { isExportDisabled } = this.props;

    return (
      <ToolbarItem>
        <Button
          isDisabled={isExportDisabled}
          onClick={this.handleExportClicked}
          variant={ButtonVariant.plain}
        >
          <ExportIcon />
        </Button>
      </ToolbarItem>
    );
  };

  private handleExportClicked = () => {
    this.props.onExportClicked();
  };

  public render() {
    const { categoryOptions, pagination, showExport } = this.props;
    const options = categoryOptions
      ? categoryOptions
      : this.getDefaultCategoryOptions();

    // Todo: clearAllFilters workaround https://github.com/patternfly/patternfly-react/issues/4222
    return (
      <div style={styles.toolbarContainer}>
        <Toolbar
          id="details-toolbar"
          clearAllFilters={this.onDelete as any}
          collapseListedFiltersBreakpoint="xl"
        >
          <ToolbarContent>
            <ToolbarToggleGroup breakpoint="xl" toggleIcon={<FilterIcon />}>
              <ToolbarItem variant="bulk-select">
                {this.getBulkSelect()}
              </ToolbarItem>
              <ToolbarGroup variant="filter-group">
                {this.getCategoryDropdown()}
                {this.getTagKeySelect()}
                {this.getTagKeyOptions().map(option =>
                  this.getTagValueSelect(option)
                )}
                {this.getOrgUnitSelect()}
                {options &&
                  options
                    .filter(
                      option =>
                        option.key !== tagKey && option.key !== orgUnitIdKey
                    )
                    .map(option => this.getCategoryInput(option))}
              </ToolbarGroup>
              {Boolean(showExport) && (
                <ToolbarGroup>{this.getExportButton()}</ToolbarGroup>
              )}
            </ToolbarToggleGroup>
            <ToolbarItem
              alignment={{ default: 'alignRight' }}
              variant="pagination"
            >
              {pagination}
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      </div>
    );
  }
}

const DataToolbar = translate()(DataToolbarBase);

export { DataToolbar, DataToolbarProps };
