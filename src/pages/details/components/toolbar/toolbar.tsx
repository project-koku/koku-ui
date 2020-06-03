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
  DataToolbarChipGroup,
  DataToolbarContent,
  DataToolbarFilter,
  DataToolbarGroup,
  DataToolbarItem,
  DataToolbarToggleGroup,
} from '@patternfly/react-core';
import { ExportIcon, FilterIcon, SearchIcon } from '@patternfly/react-icons';
import { Query, tagKeyPrefix } from 'api/queries/query';
import { cloneDeep } from 'lodash';
import { uniq, uniqBy } from 'lodash';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { isEqual } from 'utils/equal';
import { styles } from './toolbar.styles';

interface Filters {
  [key: string]: string[] | { [key: string]: string[] };
}

interface ToolbarOwnProps {
  categoryOptions?: DataToolbarChipGroup[]; // Options for category menu
  groupBy?: string; // Sync category selection with groupBy value
  isExportDisabled?: boolean; // Show export icon as disabled
  onExportClicked();
  onFilterAdded(filterType: string, filterValue: string);
  onFilterRemoved(filterType: string, filterValue?: string);
  pagination?: React.ReactNode; // Optional pagination controls to display in toolbar
  query?: Query; // Query containing filter_by params used to restore state upon page refresh
  report?: { data: any[] }; // Report containing tag key and value data
  showExport?: boolean; // Show export icon
}

interface ToolbarState {
  categoryInput?: string;
  currentCategory?: string;
  currentTagKey?: string;
  filters: Filters;
  isCategoryDropdownOpen: boolean;
  isTagKeyDropdownOpen: boolean;
  isTagKeySelectExpanded: boolean;
  isTagValueSelectExpanded: boolean;
  tagKeyValueInput?: string;
}

type ToolbarProps = ToolbarOwnProps & InjectedTranslateProps;

const defaultFilters = {
  tag: {},
};

// If the number of tag keys are greater or equal, then show text input Vs select
// See https://github.com/project-koku/koku/pull/2069
const tagKeyValueLimit = 50;

export class ToolbarBase extends React.Component<ToolbarProps> {
  protected defaultState: ToolbarState = {
    categoryInput: '',
    filters: cloneDeep(defaultFilters),
    isCategoryDropdownOpen: false,
    isTagKeyDropdownOpen: false,
    isTagKeySelectExpanded: false,
    isTagValueSelectExpanded: false,
    tagKeyValueInput: '',
  };
  public state: ToolbarState = { ...this.defaultState };

  public componentDidMount() {
    this.setState({
      currentCategory: this.getDefaultCategory(),
    });
  }

  public componentDidUpdate(prevProps: ToolbarProps, prevState) {
    const { categoryOptions, groupBy, query, report } = this.props;

    if (
      categoryOptions !== prevProps.categoryOptions ||
      groupBy !== prevProps.groupBy ||
      (query && !isEqual(query, prevProps.query)) ||
      (report && !isEqual(report, prevProps.report))
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
    const { categoryOptions, groupBy } = this.props;

    if (!categoryOptions) {
      return 'name';
    }

    for (const option of categoryOptions) {
      if (
        groupBy === option.key ||
        (groupBy &&
          groupBy.indexOf(tagKeyPrefix) !== -1 &&
          option.key === 'tag')
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

        if (key.indexOf(tagKeyPrefix) !== -1) {
          filters.tag[key.substring(tagKeyPrefix.length)] = values;
        } else {
          filters[key] = values;
        }
      });
    }
    return filters;
  };

  private onDelete = (type, id) => {
    // Todo: workaround for https://github.com/patternfly/patternfly-react/issues/3552
    // This prevents us from using a localized string, if necessary
    const filterType = type && type.key ? type.key : type;

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
            ? `${tagKeyPrefix}${filterType}`
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
    const { categoryOptions } = this.props;
    const { isCategoryDropdownOpen } = this.state;

    if (!categoryOptions) {
      return null;
    }
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
      </DataToolbarItem>
    );
  }

  private getCurrentCategoryOption = (): DataToolbarChipGroup => {
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

  private onCategorySelect = event => {
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
      <DataToolbarFilter
        categoryName={categoryOption}
        chips={filters[categoryOption.key]}
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
      </DataToolbarFilter>
    );
  };

  private getDefaultCategoryOptions = (): DataToolbarChipGroup[] => {
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
      return <SelectOption key={selectOption.key} value={selectOption.key} />;
    });

    return (
      <DataToolbarItem>
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
      </DataToolbarItem>
    );
  };

  private getTagKeyOptions(): DataToolbarChipGroup[] {
    const { report } = this.props;

    let data = [];
    let options = [];

    if (!(report && report.data)) {
      return options;
    }

    // If the key_only param is used, we have an array of strings
    let hasTagKeys = false;
    for (const item of report.data) {
      if (item.hasOwnProperty('key')) {
        hasTagKeys = true;
        break;
      }
    }

    // Workaround for https://github.com/project-koku/koku/issues/1797
    if (hasTagKeys) {
      const keepData = report.data.map(({ type, ...keepProps }) => keepProps);
      data = uniqBy(keepData, 'key');
    } else {
      data = uniq(report.data);
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

  private onTagKeySelect = (event, selection, isPlaceholder) => {
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

  public getTagValueSelect = tagKeyPrefixOption => {
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
      <DataToolbarFilter
        categoryName={tagKeyPrefixOption}
        chips={filters.tag[tagKeyPrefixOption.key]}
        deleteChip={this.onDelete}
        key={tagKeyPrefixOption.key}
        showToolbarItem={
          currentCategory === 'tag' && currentTagKey === tagKeyPrefixOption.key
        }
      >
        {Boolean(selectOptions.length < tagKeyValueLimit) ? (
          <Select
            variant={SelectVariant.checkbox}
            aria-label={t('filter_by.tag_value_aria_label')}
            onToggle={this.onTagValueToggle}
            onSelect={this.onTagValueSelect}
            selections={
              filters.tag[tagKeyPrefixOption.key]
                ? filters.tag[tagKeyPrefixOption.key]
                : []
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
      </DataToolbarFilter>
    );
  };

  private getTagValueOptions(): DataToolbarChipGroup[] {
    const { report } = this.props;
    const { currentTagKey } = this.state;

    let data = [];
    if (report && report.data) {
      data = [...new Set([...report.data])]; // prune duplicates
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
          `${tagKeyPrefix}${currentTagKey}`,
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
          this.props.onFilterAdded(
            `${tagKeyPrefix}${currentTagKey}`,
            selection
          );
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
      <DataToolbarItem>
        <Button
          isDisabled={isExportDisabled}
          onClick={this.handleExportClicked}
          variant={ButtonVariant.plain}
        >
          <ExportIcon />
        </Button>
      </DataToolbarItem>
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

    return (
      <div style={styles.toolbarContainer}>
        <DataToolbar
          id="details-toolbar"
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
                {options &&
                  options
                    .filter(option => option.key !== 'tag')
                    .map(option => this.getCategoryInput(option))}
              </DataToolbarGroup>
              {Boolean(showExport) && (
                <DataToolbarGroup>{this.getExportButton()}</DataToolbarGroup>
              )}
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

const Toolbar = translate()(connect()(ToolbarBase));

export { Toolbar, ToolbarProps, Filters };
