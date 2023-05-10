import type { ToolbarChipGroup } from '@patternfly/react-core';
import { Button, ButtonVariant } from '@patternfly/react-core';
import type { OcpQuery } from 'api/queries/ocpQuery';
import { ResourcePathsType } from 'api/resources/resource';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { DataToolbar } from 'routes/views/components/dataToolbar';
import type { Filter } from 'routes/views/utils/filter';
import { createMapStateToProps } from 'store/common';
import type { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';

import { styles } from './costCategory.styles';

interface CostCategoryToolbarOwnProps {
  isAllSelected?: boolean;
  isDisabled?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onBulkSelected(action: string);
  onDisableTags();
  onEnableTags();
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  pagination?: React.ReactNode;
  query?: OcpQuery;
  selectedItems?: ComputedReportItem[];
}

interface CostCategoryToolbarStateProps {
  // TBD...
}

interface CostCategoryToolbarDispatchProps {
  // TBD...
}

interface CostCategoryToolbarState {
  categoryOptions?: ToolbarChipGroup[];
}

type CostCategoryToolbarProps = CostCategoryToolbarOwnProps &
  CostCategoryToolbarStateProps &
  CostCategoryToolbarDispatchProps &
  WrappedComponentProps;

export class CostCategoryToolbarBase extends React.Component<CostCategoryToolbarProps, CostCategoryToolbarState> {
  protected defaultState: CostCategoryToolbarState = {};
  public state: CostCategoryToolbarState = { ...this.defaultState };

  public componentDidMount() {
    this.setState({
      categoryOptions: this.getCategoryOptions(),
    });
  }

  private getTagActions = () => {
    const { intl, onDisableTags, onEnableTags, selectedItems } = this.props;

    return (
      <>
        <Button
          isDisabled={selectedItems.length === 0}
          key="save"
          onClick={onEnableTags}
          variant={ButtonVariant.primary}
        >
          {intl.formatMessage(messages.enableCategories)}
        </Button>
        <Button
          isDisabled={selectedItems.length === 0}
          key="reset"
          onClick={onDisableTags}
          style={styles.action}
          variant={ButtonVariant.secondary}
        >
          {intl.formatMessage(messages.disableCategories)}
        </Button>
      </>
    );
  };

  private getCategoryOptions = (): ToolbarChipGroup[] => {
    const { intl } = this.props;

    const options = [
      { name: intl.formatMessage(messages.filterByValues, { value: 'name' }), key: 'project' }, // Todo: update filter name
      { name: intl.formatMessage(messages.filterByValues, { value: 'status' }), key: 'status' },
      { name: intl.formatMessage(messages.filterByValues, { value: 'source_type' }), key: 'source_type' },
    ];
    return options;
  };

  public render() {
    const {
      isAllSelected,
      isDisabled,
      itemsPerPage,
      itemsTotal,
      onBulkSelected,
      onFilterAdded,
      onFilterRemoved,
      pagination,
      query,
      selectedItems,
    } = this.props;
    const { categoryOptions } = this.state;

    return (
      <DataToolbar
        categoryOptions={categoryOptions}
        isAllSelected={isAllSelected}
        isDisabled={isDisabled}
        itemsPerPage={itemsPerPage}
        itemsTotal={itemsTotal}
        onBulkSelected={onBulkSelected}
        onFilterAdded={onFilterAdded}
        onFilterRemoved={onFilterRemoved}
        pagination={pagination}
        query={query}
        resourcePathsType={ResourcePathsType.ocp}
        selectedItems={selectedItems}
        showBulkSelect
        showFilter
        tagActions={this.getTagActions()}
      />
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<CostCategoryToolbarOwnProps, CostCategoryToolbarStateProps>(() => {
  return {
    // TBD...
  };
});

const mapDispatchToProps: CostCategoryToolbarDispatchProps = {
  // TBD...
};

const CostCategoryToolbarConnect = connect(mapStateToProps, mapDispatchToProps)(CostCategoryToolbarBase);
const CostCategoryToolbar = injectIntl(CostCategoryToolbarConnect);

export { CostCategoryToolbar };
export type { CostCategoryToolbarProps };
