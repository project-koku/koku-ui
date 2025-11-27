import type { Org } from '@koku-ui/api/orgs/org';
import type { Query } from '@koku-ui/api/queries/query';
import type { Resource, ResourcePathsType } from '@koku-ui/api/resources/resource';
import type { Tag, TagPathsType } from '@koku-ui/api/tags/tag';
import { Toolbar, ToolbarContent, ToolbarGroup, ToolbarItem, ToolbarToggleGroup } from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons/dist/esm/icons/filter-icon';
import { cloneDeep } from 'lodash';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { createMapStateToProps } from '../../../store/common';
import { FeatureToggleSelectors } from '../../../store/featureToggle';
import { awsCategoryKey, orgUnitIdKey, platformCategoryKey, tagKey } from '../../../utils/props';
import type { ComputedReportItem } from '../../utils/computedReport/getComputedReportItems';
import { isEqual } from '../../utils/equal';
import type { Filter } from '../../utils/filter';
import type { SelectWrapperOption } from '../selectWrapper';
import { getColumnManagement, getExportButton, getKebab, getPlatformCosts } from './utils/actions';
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
import {
  getCostCategoryKeyOptions,
  getCostCategoryKeySelect,
  getCostCategoryValueSelect,
  onCostCategoryValueInput,
  onCostCategoryValueSelect,
} from './utils/costCategory';
import { CriteriaType, getCriteriaSelect } from './utils/criteria';
import { getCustomSelect, onCustomSelect } from './utils/custom';
import { getOrgUnitSelect, onOrgUnitSelect } from './utils/orgUntits';
import { getTagKeyOptions, getTagKeySelect, getTagValueSelect, onTagValueInput, onTagValueSelect } from './utils/tags';

interface DataToolbarOwnProps {
  categoryOptions?: ToolbarChipGroupExt[]; // Options for category menu
  className?: string;
  dateRange?: React.ReactNode; // Optional date range controls to display in toolbar
  datePicker?: React.ReactNode; // Optional date picker controls to display in toolbar
  endDate?: string; // For Cost Explorer tag key value
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
  orgReport?: Org; // Report containing AWS organizational unit data
  pagination?: React.ReactNode; // Optional pagination controls to display in toolbar
  query?: Query; // Query containing filter_by params used to restore state upon page refresh
  resourcePathsType?: ResourcePathsType;
  resourceReport?: Resource;
  selectedItems?: ComputedReportItem[];
  showBulkSelect?: boolean; // Show bulk select
  showColumnManagement?: boolean; // Show column management
  showCriteria?: boolean; // Show negative filtering
  showExport?: boolean; // Show export icon
  showFilter?: boolean; // Show export icon
  showPlatformCosts?: boolean; // Show platform costs switch
  startDate?: string; // For Cost Explorer tag key value
  style?: React.CSSProperties;
  tagPathsType?: TagPathsType;
  tagReport?: Tag; // Data containing tag key and value data
  timeScopeValue?: number;
}

interface DataToolbarState {
  categoryInput?: string;
  costCategoryKeyValueInput?: string;
  currentCategory?: string;
  currentCriteria?: string;
  currentCostCategoryKey?: string;
  currentTagKey?: string;
  filters?: Filters;
  isBulkSelectOpen?: boolean;
  isCostCategoryValueSelectExpanded?: boolean;
  isCriteriaSelectOpen?: boolean;
  isPlatformCostsChecked?: boolean;
  isTagKeySelectExpanded?: boolean;
  isTagValueSelectExpanded?: boolean;
  tagKeyValueInput?: string;
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
    isCostCategoryValueSelectExpanded: false,
    isCriteriaSelectOpen: false,
    isPlatformCostsChecked: this.props.query ? this.props.query.category === platformCategoryKey : false,
    isTagValueSelectExpanded: false,
    tagKeyValueInput: '',
  };
  public state: DataToolbarState = { ...this.defaultState };

  public componentDidMount() {
    const { categoryOptions, groupBy, query } = this.props;

    this.setState({
      currentCategory: getDefaultCategory(categoryOptions, groupBy, query),
      currentCriteria: CriteriaType.include,
    });
  }

  public componentDidUpdate(prevProps: DataToolbarProps) {
    const { categoryOptions, groupBy, orgReport, query, resourceReport, tagReport } = this.props;

    if (
      groupBy !== prevProps.groupBy ||
      (categoryOptions && !isEqual(categoryOptions, prevProps.categoryOptions)) ||
      (query && !isEqual(query, prevProps.query)) ||
      (orgReport && !isEqual(orgReport, prevProps.orgReport)) ||
      (resourceReport && !isEqual(resourceReport, prevProps.resourceReport)) ||
      (tagReport && !isEqual(tagReport, prevProps.tagReport))
    ) {
      this.setState(() => {
        const filters = getActiveFilters(query);
        return prevProps.groupBy !== groupBy ||
          !isEqual(tagReport, prevProps.tagReport) ||
          !isEqual(categoryOptions, prevProps.categoryOptions)
          ? {
              categoryInput: '',
              costCategoryKeyValueInput: '',
              currentCategory: getDefaultCategory(categoryOptions, groupBy, query),
              currentCostCategoryKey: '',
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
      currentCostCategoryKey: undefined,
      currentTagKey: undefined,
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

  // Cost category key select

  public getCostCategoryKeySelectComponent = () => {
    const { isDisabled, resourceReport } = this.props;
    const { currentCategory, currentCostCategoryKey, filters } = this.state;

    return getCostCategoryKeySelect({
      currentCategory,
      currentCostCategoryKey,
      filters,
      isDisabled,
      onCostCategoryKeyClear: this.handleOnCostCategoryKeyClear,
      onCostCategoryKeySelect: this.handleOnCostCategoryKeySelect,
      resourceReport,
    });
  };

  private handleOnCostCategoryKeyClear = () => {
    this.setState({
      currentCostCategoryKey: undefined,
    });
  };

  private handleOnCostCategoryKeySelect = (_evt, selection: SelectWrapperOption) => {
    this.setState({
      currentCostCategoryKey: selection.value,
    });
  };

  // Cost category value select

  public getCostCategoryValueSelectComponent = (costCategoryKeyOption: ToolbarChipGroupExt) => {
    const { isDisabled, resourcePathsType } = this.props;
    const { currentCategory, currentCostCategoryKey, filters, costCategoryKeyValueInput } = this.state;

    return getCostCategoryValueSelect({
      currentCategory,
      currentCostCategoryKey,
      costCategoryKeyOption,
      costCategoryKeyValueInput,
      filters,
      isDisabled,
      onDelete: this.handleOnDelete,
      onCostCategoryValueSelect: this.handleOnCostCategoryValueSelect,
      onCostCategoryValueInput: this.handleOnCostCategoryValueInput,
      onCostCategoryValueInputChange: this.handleOnCostCategoryValueInputChange,
      resourcePathsType,
    });
  };

  private handleOnCostCategoryValueInputChange = value => {
    this.setState({ costCategoryKeyValueInput: value });
  };

  private handleOnCostCategoryValueInput = event => {
    const { onFilterAdded } = this.props;
    const { currentCriteria, currentCostCategoryKey, costCategoryKeyValueInput, filters: currentFilters } = this.state;

    const { filter, filters } = onCostCategoryValueInput({
      costCategoryKeyValueInput,
      currentCostCategoryKey,
      currentFilters,
      currentCriteria,
      event,
    });

    this.setState(
      {
        filters,
        costCategoryKeyValueInput: '',
      },
      () => {
        if (onFilterAdded) {
          this.props.onFilterAdded(filter);
        }
      }
    );
  };

  private handleOnCostCategoryValueSelect = (event, selection) => {
    const { onFilterAdded, onFilterRemoved } = this.props;
    const { currentCriteria, currentCostCategoryKey, filters: currentFilters } = this.state;

    const { filter, filters } = onCostCategoryValueSelect({
      currentCostCategoryKey,
      currentFilters,
      currentCriteria,
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
    const { isDisabled, isExactFilterToggleEnabled } = this.props;
    const { currentCriteria, filters } = this.state;

    return getCriteriaSelect({
      currentCriteria,
      filters,
      isDisabled,
      onCriteriaSelect: this.handleOnCriteriaSelect,
      showExact: isExactFilterToggleEnabled,
    });
  }

  private handleOnCriteriaSelect = (_evt, selection: SelectWrapperOption) => {
    this.setState({
      currentCriteria: selection.value,
      isCriteriaSelectOpen: !this.state.isCriteriaSelectOpen,
    });
  };

  // Org unit select
  public getOrgUnitSelectComponent = () => {
    const { isDisabled, orgReport } = this.props;
    const { currentCategory, filters } = this.state;

    return getOrgUnitSelect({
      currentCategory,
      filters,
      isDisabled,
      onDelete: this.handleOnDelete,
      onOrgUnitSelect: this.handleOnOrgUnitSelect,
      orgReport,
    });
  };

  private handleOnOrgUnitSelect = (event, selection) => {
    const { onFilterAdded, onFilterRemoved } = this.props;
    const { currentCriteria, filters: currentFilters } = this.state;

    const { filter, filters } = onOrgUnitSelect({
      currentCriteria,
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

  // Tag key select

  public getTagKeySelectComponent = () => {
    const { isDisabled, tagReport } = this.props;
    const { currentCategory, currentTagKey, filters } = this.state;

    return getTagKeySelect({
      currentCategory,
      currentTagKey,
      filters,
      isDisabled,
      onTagKeyClear: this.handleOnTagKeyClear,
      onTagKeySelect: this.handleOnTagKeySelect,
      tagReport,
    });
  };

  private handleOnTagKeyClear = () => {
    this.setState({
      currentTagKey: undefined,
    });
  };

  private handleOnTagKeySelect = (_evt, selection: SelectWrapperOption) => {
    this.setState({
      currentTagKey: selection.value,
    });
  };

  // Tag value select

  public getTagValueSelect = (tagKeyOption: ToolbarChipGroupExt) => {
    const { endDate, isDisabled, startDate, tagPathsType, timeScopeValue } = this.props;
    const { currentCategory, currentTagKey, filters, tagKeyValueInput } = this.state;

    return getTagValueSelect({
      currentCategory,
      currentTagKey,
      endDate,
      filters,
      isDisabled,
      onDelete: this.handleOnDelete,
      onTagValueSelect: this.handleOnTagValueSelect,
      onTagValueInput: this.handleOnTagValueInput,
      onTagValueInputChange: this.handleOnTagValueInputChange,
      startDate,
      tagKeyValueInput,
      tagKeyOption,
      tagPathsType,
      timeScopeValue,
    });
  };

  private handleOnTagValueInputChange = value => {
    this.setState({ tagKeyValueInput: value });
  };

  private handleOnTagValueInput = event => {
    const { onFilterAdded } = this.props;
    const { currentCriteria, currentTagKey, filters: currentFilters, tagKeyValueInput } = this.state;

    const { filter, filters } = onTagValueInput({
      currentCriteria,
      currentFilters,
      currentTagKey,
      event,
      tagKeyValueInput,
    });
    if (!filter) {
      return;
    }
    this.setState(
      {
        filters,
        tagKeyValueInput: '',
      },
      () => {
        if (onFilterAdded) {
          onFilterAdded(filter);
        }
      }
    );
  };

  private handleOnTagValueSelect = (event, selection) => {
    const { onFilterAdded, onFilterRemoved } = this.props;
    const { currentCriteria, currentTagKey, filters: currentFilters } = this.state;

    const { filter, filters } = onTagValueSelect({
      currentCriteria,
      currentFilters,
      currentTagKey,
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

  // Platform costs

  public getPlatformCostsComponent = () => {
    const { isDisabled } = this.props;
    const { isPlatformCostsChecked } = this.state;

    return getPlatformCosts({
      isDisabled,
      isPlatformCostsChecked,
      onPlatformCostsChanged: this.handleOnPlatformCostsChanged,
    });
  };

  private handleOnPlatformCostsChanged = (checked: boolean) => {
    const { onPlatformCostsChanged } = this.props;
    const { isPlatformCostsChecked } = this.state;
    this.setState({ isPlatformCostsChecked: !isPlatformCostsChecked }, () => {
      if (onPlatformCostsChanged) {
        onPlatformCostsChanged(checked);
      }
    });
  };

  // Kebab

  public getKebab = () => {
    const { showColumnManagement, showPlatformCosts } = this.props;
    const { isPlatformCostsChecked } = this.state;

    return getKebab({
      isPlatformCostsChecked,
      onColumnManagementClicked: this.handleOnColumnManagementClicked,
      onPlatformCostsChanged: this.handleOnPlatformCostsChanged,
      showColumnManagement,
      showPlatformCosts,
    });
  };

  public render() {
    const {
      categoryOptions,
      className,
      dateRange,
      datePicker,
      pagination,
      resourceReport,
      showBulkSelect,
      showColumnManagement,
      showCriteria,
      showExport,
      showFilter,
      showPlatformCosts,
      style,
      tagReport,
    } = this.props;
    const { filters } = this.state;

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
                  {this.getCostCategoryKeySelectComponent()}
                  {getCostCategoryKeyOptions(resourceReport).map(option =>
                    this.getCostCategoryValueSelectComponent(option)
                  )}
                  {this.getTagKeySelectComponent()}
                  {getTagKeyOptions(tagReport, filters).map(option => this.getTagValueSelect(option))}
                  {this.getOrgUnitSelectComponent()}
                  {filteredOptions.map(option => this.getCategoryInputComponent(option))}
                  {filteredOptions.map(option => this.getCustomSelectComponent(option))}
                </ToolbarGroup>
              </ToolbarToggleGroup>
            )}
            {(showExport || showColumnManagement) && (
              <>
                <ToolbarGroup>{showColumnManagement && this.getColumnManagementComponent()}</ToolbarGroup>
                <ToolbarGroup>{showPlatformCosts && this.getPlatformCostsComponent()}</ToolbarGroup>
                <ToolbarGroup>
                  {showExport && this.getExportButtonComponent()}
                  {(showColumnManagement || showPlatformCosts) && this.getKebab()}
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

const mapStateToProps = createMapStateToProps<DataToolbarOwnProps, DataToolbarStateProps>(state => {
  return {
    isExactFilterToggleEnabled: FeatureToggleSelectors.selectIsExactFilterToggleEnabled(state),
  };
});

const DataToolbar = injectIntl(connect(mapStateToProps, {})(DataToolbarBase));

export default DataToolbar;
