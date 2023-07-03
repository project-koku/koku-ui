import './dataToolbar.scss';

import type { ToolbarChipGroup } from '@patternfly/react-core';
import { Toolbar, ToolbarContent, ToolbarGroup, ToolbarItem, ToolbarToggleGroup } from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons/dist/esm/icons/filter-icon';
import type { Query } from 'api/queries/query';
import type { Resource, ResourcePathsType } from 'api/resources/resource';
import { cloneDeep } from 'lodash';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import type { ComputedReportItem } from 'routes/utils/computedReport/getComputedReportItems';
import { isEqual } from 'routes/utils/equal';
import type { Filter } from 'routes/utils/filter';
import { createMapStateToProps } from 'store/common';

import { styles } from './dataToolbar.styles';
import { getBulkSelect } from './utils/bulkSelect';
import type { CategoryOption } from './utils/category';
import {
  getCategoryInput,
  getCategorySelect,
  getDefaultCategoryOptions,
  onCategoryInput,
  onCategoryInputSelect,
  onWorkloadTypeSelect,
} from './utils/category';
import type { Filters } from './utils/common';
import { cleanInput, defaultFilters, getActiveFilters, getDefaultCategory, onDelete } from './utils/common';

interface BasicToolbarOwnProps {
  actions?: React.ReactNode;
  categoryOptions?: ToolbarChipGroup[]; // Options for category menu
  groupBy?: string; // Sync category selection with groupBy value
  isAllSelected?: boolean;
  isBulkSelectDisabled?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onBulkSelected?: (action: string) => void;
  onFilterAdded?: (filter: Filter) => void;
  onFilterRemoved?: (filterType: Filter) => void;
  pagination?: React.ReactNode; // Optional pagination controls to display in toolbar
  query?: Query; // Query containing filter_by params used to restore state upon page refresh
  resourcePathsType?: ResourcePathsType;
  resourceReport?: Resource;
  selectedItems?: ComputedReportItem[];
  showBulkSelect?: boolean; // Show bulk select
  showFilter?: boolean; // Show export icon
  style?: React.CSSProperties;
}

interface BasicToolbarState {
  categoryInput?: string;
  currentCategory?: string;
  filters?: Filters;
  isBulkSelectOpen?: boolean;
  isCategorySelectOpen?: boolean;
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
    isCategorySelectOpen: false,
  };
  public state: BasicToolbarState = { ...this.defaultState };

  public componentDidMount() {
    const { categoryOptions, groupBy, query } = this.props;

    this.setState({
      currentCategory: getDefaultCategory(categoryOptions, groupBy, query),
    });
  }

  public componentDidUpdate(prevProps: BasicToolbarProps) {
    const { categoryOptions, groupBy, query, resourceReport } = this.props;

    if (
      groupBy !== prevProps.groupBy ||
      (categoryOptions && !isEqual(categoryOptions, prevProps.categoryOptions)) ||
      (query && !isEqual(query, prevProps.query)) ||
      (resourceReport && !isEqual(resourceReport, prevProps.resourceReport))
    ) {
      this.setState(() => {
        const filters = getActiveFilters(query);
        return categoryOptions !== prevProps.categoryOptions || prevProps.groupBy !== groupBy
          ? {
              categoryInput: '',
              currentCategory: getDefaultCategory(categoryOptions, groupBy, query),
              filters,
            }
          : {
              filters,
            };
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
    const { isAllSelected, isBulkSelectDisabled, isDisabled, isReadOnly, itemsPerPage, itemsTotal, selectedItems } =
      this.props;
    const { isBulkSelectOpen } = this.state;

    return getBulkSelect({
      handleOnBulkSelect: this.handleOnBulkSelect,
      handleOnBulkSelectClicked: this.handleOnBulkSelectClicked,
      handleOnBulkSelectToggle: this.handleOnBulkSelectToggle,
      isAllSelected,
      isBulkSelectDisabled,
      isBulkSelectOpen,
      isDisabled,
      isReadOnly,
      itemsPerPage,
      itemsTotal,
      selectedItems,
    });
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

  public getCategorySelectComponent() {
    const { categoryOptions, isDisabled } = this.props;
    const { currentCategory, filters, isCategorySelectOpen } = this.state;

    return getCategorySelect({
      categoryOptions,
      currentCategory,
      isDisabled,
      filters,
      handleOnCategorySelect: this.handleOnCategorySelect,
      handleOnCategoryToggle: this.handleOnCategoryToggle,
      isCategorySelectOpen,
    });
  }

  private handleOnCategorySelect = (event, selection: CategoryOption) => {
    this.setState({
      categoryInput: '',
      currentCategory: selection.value,
      isCategorySelectOpen: !this.state.isCategorySelectOpen,
    });
  };

  private handleOnCategoryToggle = isOpen => {
    this.setState({
      isCategorySelectOpen: isOpen,
    });
  };

  // Category input

  public getCategoryInputComponent = (categoryOption: ToolbarChipGroup) => {
    const { isDisabled, resourcePathsType } = this.props;
    const { categoryInput, currentCategory, filters } = this.state;

    return getCategoryInput({
      categoryInput,
      categoryOption,
      currentCategory,
      filters,
      handleOnCategoryInput: this.handleOnCategoryInput,
      handleOnCategoryInputChange: this.handleOnCategoryInputChange,
      handleOnCategoryInputSelect: this.handleOnCategoryInputSelect,
      handleOnDelete: this.handleOnDelete,
      handleOnWorkloadTypeSelect: this.handleOnWorkloadTypeSelect,
      isDisabled,
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

  private handleOnWorkloadTypeSelect = (event, selection) => {
    const { onFilterAdded, onFilterRemoved } = this.props;
    const { currentCategory, filters: currentFilters } = this.state;

    const { filter, filters } = onWorkloadTypeSelect({
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
        if (event.target.checked) {
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
      <div style={style ? style : styles.toolbarContainer}>
        <Toolbar
          className="toolbarOverride"
          clearAllFilters={this.handleOnDelete as any}
          collapseListedFiltersBreakpoint="xl"
        >
          <ToolbarContent>
            {showBulkSelect && <ToolbarItem variant="bulk-select">{this.getBulkSelectComponent()}</ToolbarItem>}
            {showFilter && (
              <ToolbarToggleGroup breakpoint="xl" toggleIcon={<FilterIcon />}>
                <ToolbarGroup variant="filter-group">
                  {this.getCategorySelectComponent()}
                  {options && options.map(option => this.getCategoryInputComponent(option))}
                </ToolbarGroup>
              </ToolbarToggleGroup>
            )}
            {actions && <ToolbarGroup>{actions}</ToolbarGroup>}
            <ToolbarItem alignment={{ default: 'alignRight' }} variant="pagination">
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
