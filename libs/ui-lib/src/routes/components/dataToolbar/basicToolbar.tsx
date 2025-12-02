import type { Query } from '@koku-ui/api/queries/query';
import type { Resource, ResourcePathsType } from '@koku-ui/api/resources/resource';
import { Toolbar, ToolbarContent, ToolbarGroup, ToolbarItem, ToolbarToggleGroup } from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons/dist/esm/icons/filter-icon';
import { cloneDeep } from 'lodash';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { createMapStateToProps } from '../../../store/common';
import { isEqual } from '../../utils/equal';
import type { Filter } from '../../utils/filter';
import type { SelectWrapperOption } from '../selectWrapper';
import { getBulkSelect } from './utils/bulkSelect';
import {
  getCategoryInput,
  getCategorySelect,
  getDefaultCategoryOptions,
  onCategoryInput,
  onCategoryInputSelect,
} from './utils/category';
import type { Filters, ToolbarChipGroupExt } from './utils/common';
import { cleanInput, defaultFilters, getActiveFilters, getDefaultCategory, onDelete } from './utils/common';
import { getCustomSelect, onCustomSelect } from './utils/custom';

interface BasicToolbarOwnProps {
  actions?: React.ReactNode;
  categoryOptions?: ToolbarChipGroupExt[]; // Options for category menu
  filters?: Filters;
  groupBy?: string; // Sync category selection with groupBy value
  isAllSelected?: boolean;
  isBulkSelectDisabled?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onBulkSelect?: (action: string) => void;
  onFilterAdded?: (filter: Filter) => void;
  onFilterRemoved?: (filterType: Filter) => void;
  pagination?: React.ReactNode; // Optional pagination controls to display in toolbar
  query?: Query; // Query containing filter_by params used to restore state upon page refresh
  resourcePathsType?: ResourcePathsType;
  resourceReport?: Resource;
  selectedItems?: any[];
  showBulkSelect?: boolean; // Show bulk select
  showBulkSelectAll?: boolean; // Show bulk select all option
  showBulkSelectPage?: boolean; // Show bulk select page option
  showFilter?: boolean; // Show export icon
  style?: React.CSSProperties;
  useActiveFilters?: boolean;
}

interface BasicToolbarState {
  categoryInput?: string;
  currentCategory?: string;
  filters?: Filters;
  isBulkSelectOpen?: boolean;
}

interface BasicToolbarStateProps {
  // TBD...
}

type BasicToolbarProps = BasicToolbarOwnProps & BasicToolbarStateProps & WrappedComponentProps;

export class BasicToolbarBase extends React.Component<BasicToolbarProps, BasicToolbarState> {
  protected defaultState: BasicToolbarState = {
    categoryInput: '',
    filters: cloneDeep(defaultFilters),
    isBulkSelectOpen: false,
  };
  public state: BasicToolbarState = { ...this.defaultState };

  public componentDidMount() {
    const { categoryOptions, groupBy, query } = this.props;

    this.setState({
      currentCategory: getDefaultCategory(categoryOptions, groupBy, query),
    });
  }

  public componentDidUpdate(prevProps: BasicToolbarProps) {
    const { categoryOptions, groupBy, query, resourceReport, useActiveFilters = false } = this.props;

    if (
      groupBy !== prevProps.groupBy ||
      (categoryOptions && !isEqual(categoryOptions, prevProps.categoryOptions)) ||
      (query && !isEqual(query, prevProps.query)) ||
      (resourceReport && !isEqual(resourceReport, prevProps.resourceReport))
    ) {
      this.setState(() => {
        const result = {
          ...((categoryOptions !== prevProps.categoryOptions || prevProps.groupBy !== groupBy) && {
            categoryInput: '',
            currentCategory: getDefaultCategory(categoryOptions, groupBy, query),
          }),
        };
        // Active filters overrides Filter.toString
        return useActiveFilters
          ? {
              ...result,
              filters: getActiveFilters(query),
            }
          : result;
      });
    }
  }

  // Common

  private handleOnDelete = (type: any, chip: any) => {
    const { onFilterRemoved } = this.props;
    const { filters: currentFilters } = this.state;

    const { filter, filters } = onDelete(type, chip, currentFilters);

    this.setState({ filters }, () => {
      if (onFilterRemoved) {
        onFilterRemoved(filter);
      }
    });
  };

  // Bulk select

  public getBulkSelectComponent = () => {
    const {
      isAllSelected,
      isBulkSelectDisabled,
      isDisabled,
      isReadOnly,
      itemsPerPage,
      itemsTotal,
      selectedItems,
      showBulkSelectAll,
      showBulkSelectPage,
    } = this.props;
    const { isBulkSelectOpen } = this.state;

    return getBulkSelect({
      isAllSelected,
      isBulkSelectDisabled,
      isBulkSelectOpen,
      isDisabled,
      isReadOnly,
      itemsPerPage,
      itemsTotal,
      onBulkSelect: this.handleOnBulkSelect,
      onBulkSelectClicked: this.handleOnBulkSelectClicked,
      onBulkSelectToggle: this.handleOnBulkSelectToggle,
      selectedItems,
      showSelectAll: showBulkSelectAll,
      showSelectPage: showBulkSelectPage,
    });
  };

  private handleOnBulkSelectClicked = (action: string) => {
    const { onBulkSelect } = this.props;

    if (onBulkSelect) {
      onBulkSelect(action);
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

  public getCategorySelectComponent() {
    const { categoryOptions, isDisabled } = this.props;
    const { currentCategory, filters } = this.state;

    return getCategorySelect({
      categoryOptions,
      currentCategory,
      filters,
      isDisabled,
      onCategorySelect: this.handleOnCategorySelect,
    });
  }

  private handleOnCategorySelect = (_evt, selection: SelectWrapperOption) => {
    this.setState({
      categoryInput: '',
      currentCategory: selection.value,
    });
  };

  // Category input

  public getCategoryInputComponent = (categoryOption: ToolbarChipGroupExt) => {
    const { isDisabled, resourcePathsType } = this.props;
    const { categoryInput, currentCategory, filters } = this.state;

    if (categoryOption.selectOptions) {
      return null;
    }
    return getCategoryInput({
      categoryInput,
      categoryOption,
      currentCategory,
      filters,
      isDisabled,
      onCategoryInput: this.handleOnCategoryInput,
      onCategoryInputChange: this.handleOnCategoryInputChange,
      onCategoryInputSelect: this.handleOnCategoryInputSelect,
      onDelete: this.handleOnDelete,
      resourcePathsType,
    });
  };

  private handleOnCategoryInputChange = (value: string) => {
    const val = cleanInput(value);
    this.setState({ categoryInput: val });
  };

  private handleOnCategoryInput = (event, key) => {
    const { onFilterAdded } = this.props;
    const { categoryInput, currentCategory, filters: currentFilters } = this.state;

    const { filter, filters } = onCategoryInput({
      categoryInput,
      currentCategory,
      currentFilters,
      event,
      key,
    });

    if (filter && filters) {
      this.setState(
        {
          filters,
          categoryInput: '',
        },
        () => {
          if (onFilterAdded) {
            onFilterAdded(filter);
          }
        }
      );
    }
  };

  private handleOnCategoryInputSelect = (value, key) => {
    const { onFilterAdded } = this.props;
    const { currentCategory, filters: currentFilters } = this.state;

    const { filter, filters } = onCategoryInputSelect({
      currentCategory,
      currentFilters,
      key,
      value,
    });

    this.setState(
      {
        filters,
      },
      () => {
        if (onFilterAdded) {
          onFilterAdded(filter);
        }
      }
    );
  };

  // Custom select

  public getCustomSelectComponent = (categoryOption: ToolbarChipGroupExt) => {
    const { isDisabled } = this.props;
    const { currentCategory, filters } = this.state;

    if (!categoryOption.selectOptions) {
      return null;
    }
    return getCustomSelect({
      categoryOption,
      currentCategory,
      filters,
      isDisabled,
      onDelete: this.handleOnDelete,
      onSelect: this.handleOnCustomSelect,
      selectClassName: categoryOption.selectClassName,
      selectOptions: categoryOption.selectOptions,
    });
  };

  private handleOnCustomSelect = (event, selection) => {
    const { onFilterAdded, onFilterRemoved } = this.props;
    const { currentCategory, filters: currentFilters } = this.state;

    const checked = event.target.checked;
    const { filter, filters } = onCustomSelect({
      currentCategory,
      currentFilters,
      event,
      selection,
    });

    this.setState(
      {
        filters,
      },
      () => {
        if (checked) {
          if (onFilterAdded) {
            onFilterAdded(filter);
          }
        } else {
          if (onFilterRemoved) {
            onFilterRemoved(filter);
          }
        }
      }
    );
  };

  public render() {
    const { actions, categoryOptions, pagination, showBulkSelect, showFilter, style } = this.props;
    const options = categoryOptions ? categoryOptions : getDefaultCategoryOptions();

    // Todo: clearAllFilters workaround https://github.com/patternfly/patternfly-react/issues/4222
    return (
      <div style={style}>
        <Toolbar clearAllFilters={this.handleOnDelete as any} collapseListedFiltersBreakpoint="xl">
          <ToolbarContent>
            {showBulkSelect && <ToolbarItem>{this.getBulkSelectComponent()}</ToolbarItem>}
            {showFilter && (
              <ToolbarToggleGroup breakpoint="xl" toggleIcon={<FilterIcon />}>
                <ToolbarGroup variant="filter-group">
                  {this.getCategorySelectComponent()}
                  {options && options.map(option => this.getCategoryInputComponent(option))}
                  {options && options.map(option => this.getCustomSelectComponent(option))}
                </ToolbarGroup>
              </ToolbarToggleGroup>
            )}
            {actions && <ToolbarGroup>{actions}</ToolbarGroup>}
            <ToolbarItem align={{ default: 'alignEnd' }} variant="pagination">
              {pagination}
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<BasicToolbarOwnProps, BasicToolbarStateProps>(() => {
  return {
    // TBD...
  };
});

const BasicToolbar = injectIntl(connect(mapStateToProps, {})(BasicToolbarBase));

export default BasicToolbar;
