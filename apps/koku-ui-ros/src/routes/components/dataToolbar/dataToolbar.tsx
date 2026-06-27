import { Toolbar, ToolbarContent, ToolbarGroup, ToolbarItem, ToolbarToggleGroup } from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons/dist/esm/icons/filter-icon';
import type { Query } from 'api/queries/query';
import type { ResourcePathsType } from 'api/resources/resource';
import { cloneDeep } from 'lodash';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import type { SelectWrapperOption } from 'routes/components/selectWrapper';
import type { ComputedReportItem } from 'routes/utils/computedReport/getComputedReportItems';
import { isEqual } from 'routes/utils/equal';
import type { Filter } from 'routes/utils/filter';
import { createMapStateToProps } from 'store/common';
import { awsCategoryKey, orgUnitIdKey, tagKey } from 'utils/props';

import { getColumnManagement, getExportButton, getKebab } from './utils/actions';
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
import { CriteriaType, getCriteriaSelect } from './utils/criteria';
import { getCustomSelect, onCustomSelect } from './utils/custom';

interface DataToolbarOwnProps {
  categoryOptions?: ToolbarChipGroupExt[]; // Options for category menu
  className?: string;
  dateRange?: React.ReactNode; // Optional date range controls to display in toolbar
  datePicker?: React.ReactNode; // Optional date picker controls to display in toolbar
  endDate?: string | Date; // For Cost Explorer tag key value
  groupBy?: string; // Sync category selection with groupBy value
  isAllSelected?: boolean;
  isBulkSelectDisabled?: boolean;
  isDisabled?: boolean;
  isExportDisabled?: boolean; // Show export icon as disabled
  itemsPerPage?: number;
  itemsTotal?: number;
  onBulkSelect?: (action: string) => void;
  onColumnManagementClicked?: () => void;
  onExportClicked?: () => void;
  onFilterAdded?: (filter: Filter) => void;
  onFilterRemoved?: (filterType: Filter) => void;
  onPlatformCostsChanged?: (checked: boolean) => void;
  pagination?: React.ReactNode; // Optional pagination controls to display in toolbar
  query?: Query; // Query containing filter_by params used to restore state upon page refresh
  resourcePathsType?: ResourcePathsType;
  selectedItems?: ComputedReportItem[];
  showBulkSelect?: boolean; // Show bulk select
  showColumnManagement?: boolean; // Show column management
  showCriteria?: boolean; // Show negative filtering
  showExact?: boolean; // Show exact criteria option
  showExport?: boolean; // Show export icon
  showFilter?: boolean; // Show export icon
  showPlatformCosts?: boolean; // Show platform costs switch
  startDate?: string | Date; // For Cost Explorer tag key value
  style?: React.CSSProperties;
  timeScopeValue?: number;
}

interface DataToolbarState {
  categoryInput?: string;
  costCategoryKeyValueInput?: string;
  currentCategory?: string;
  currentCriteria?: string;
  currentTagKey?: string;
  filters?: Filters;
  isBulkSelectOpen?: boolean;
  isCriteriaSelectOpen?: boolean;
}

interface DataToolbarStateProps {
  isExactFilterToggleEnabled?: boolean;
}

type DataToolbarProps = DataToolbarOwnProps & DataToolbarStateProps & WrappedComponentProps;

export class DataToolbarBase extends React.Component<DataToolbarProps, DataToolbarState> {
  protected defaultState: DataToolbarState = {
    categoryInput: '',
    filters: cloneDeep(defaultFilters),
    isBulkSelectOpen: false,
    isCriteriaSelectOpen: false,
  };
  public state: DataToolbarState = { ...this.defaultState };

  public componentDidMount() {
    const { categoryOptions, groupBy, query } = this.props;

    this.setState({
      currentCategory: getDefaultCategory(categoryOptions, groupBy, query),
      currentCriteria: CriteriaType.include,
      filters: getActiveFilters(query),
    });
  }

  public componentDidUpdate(prevProps: DataToolbarProps) {
    const { categoryOptions, groupBy, query } = this.props;

    if (
      groupBy !== prevProps.groupBy ||
      (categoryOptions && !isEqual(categoryOptions, prevProps.categoryOptions)) ||
      (query && !isEqual(query, prevProps.query))
    ) {
      this.setState(() => {
        const filters = getActiveFilters(query);
        return prevProps.groupBy !== groupBy || !isEqual(categoryOptions, prevProps.categoryOptions)
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
    const { isAllSelected, isBulkSelectDisabled, isDisabled, itemsPerPage, itemsTotal, selectedItems } = this.props;
    const { isBulkSelectOpen } = this.state;

    return getBulkSelect({
      isAllSelected,
      isBulkSelectDisabled,
      isBulkSelectOpen,
      isDisabled,
      itemsPerPage,
      itemsTotal,
      onBulkSelect: this.handleOnBulkSelect,
      onBulkSelectClicked: this.handleOnBulkSelectClicked,
      onBulkSelectToggle: this.handleOnBulkSelectToggle,
      selectedItems,
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
      isDisabled,
      filters,
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

  private handleOnCategoryInput = (event: React.FormEvent<HTMLInputElement>, key) => {
    const { onFilterAdded } = this.props;
    const { categoryInput, currentCategory, currentCriteria, filters: currentFilters } = this.state;

    const { filter, filters } = onCategoryInput({
      categoryInput,
      currentCategory,
      currentCriteria,
      currentFilters,
      event,
      key,
    });

    if (!(filter && filters)) {
      return;
    }
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
    const { currentCategory, currentCriteria, filters: currentFilters } = this.state;

    const { filter, filters } = onCategoryInputSelect({
      currentCategory,
      currentCriteria,
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

  // Criteria select

  public getCriteriaSelectComponent() {
    const { isDisabled, showExact } = this.props;
    const { currentCriteria, filters } = this.state;

    return getCriteriaSelect({
      currentCriteria,
      filters,
      isDisabled,
      onCriteriaSelect: this.handleOnCriteriaSelect,
      showExact,
    });
  }

  private handleOnCriteriaSelect = (_evt, selection: SelectWrapperOption) => {
    this.setState({
      currentCriteria: selection.value,
      isCriteriaSelectOpen: !this.state.isCriteriaSelectOpen,
    });
  };

  // Column management

  public getColumnManagementComponent = () => {
    const { isDisabled } = this.props;

    return getColumnManagement({
      isDisabled,
      onColumnManagementClicked: this.handleOnColumnManagementClicked,
    });
  };

  private handleOnColumnManagementClicked = () => {
    const { onColumnManagementClicked } = this.props;
    if (onColumnManagementClicked) {
      onColumnManagementClicked();
    }
  };

  // Export button

  public getExportButtonComponent = () => {
    const { isDisabled, isExportDisabled } = this.props;

    return getExportButton({
      isDisabled,
      isExportDisabled,
      onExportClicked: this.handleOnExportClicked,
    });
  };

  private handleOnExportClicked = () => {
    const { onExportClicked } = this.props;
    if (onExportClicked) {
      onExportClicked();
    }
  };

  // Kebab

  public getKebab = () => {
    const { showColumnManagement } = this.props;

    return getKebab({
      onColumnManagementClicked: this.handleOnColumnManagementClicked,
      showColumnManagement,
    });
  };

  public render() {
    const {
      categoryOptions,
      className,
      dateRange,
      datePicker,
      pagination,
      showBulkSelect,
      showColumnManagement,
      showCriteria,
      showExport,
      showFilter,
      style,
    } = this.props;

    const options = categoryOptions ? categoryOptions : getDefaultCategoryOptions();
    const filteredOptions = options.filter(
      option => option.key !== awsCategoryKey && option.key !== tagKey && option.key !== orgUnitIdKey
    );

    // Todo: clearAllFilters workaround https://github.com/patternfly/patternfly-react/issues/4222
    return (
      <div className={className} style={style}>
        <Toolbar clearAllFilters={this.handleOnDelete as any} collapseListedFiltersBreakpoint="xl">
          <ToolbarContent>
            {showBulkSelect && <ToolbarItem>{this.getBulkSelectComponent()}</ToolbarItem>}
            {showFilter && (
              <ToolbarToggleGroup breakpoint="xl" toggleIcon={<FilterIcon />}>
                <ToolbarGroup variant="filter-group">
                  {this.getCategorySelectComponent()}
                  {showCriteria && this.getCriteriaSelectComponent()}
                  {filteredOptions.map(option => this.getCategoryInputComponent(option))}
                  {filteredOptions.map(option => this.getCustomSelectComponent(option))}
                </ToolbarGroup>
              </ToolbarToggleGroup>
            )}
            {(showExport || showColumnManagement) && (
              <>
                <ToolbarGroup>{showColumnManagement && this.getColumnManagementComponent()}</ToolbarGroup>
                <ToolbarGroup>
                  {showExport && this.getExportButtonComponent()}
                  {showColumnManagement && this.getKebab()}
                </ToolbarGroup>
              </>
            )}
            {(dateRange || datePicker) && (
              <ToolbarGroup>
                {dateRange}
                {datePicker}
              </ToolbarGroup>
            )}
            <ToolbarItem align={{ default: 'alignEnd' }} variant="pagination">
              {pagination}
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<DataToolbarOwnProps, DataToolbarStateProps>(() => {
  return {
    // TBD...
  };
});

const DataToolbar = injectIntl(connect(mapStateToProps, {})(DataToolbarBase));

export default DataToolbar;
