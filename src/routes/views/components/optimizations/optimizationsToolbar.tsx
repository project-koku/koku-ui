import type { ToolbarChipGroup } from '@patternfly/react-core';
import type { RosQuery } from 'api/queries/rosQuery';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { DataToolbar } from 'routes/components/dataToolbar';
import type { Filter } from 'routes/utils/filter';
import { createMapStateToProps } from 'store/common';
import { uiActions } from 'store/ui';

interface OptimizationsToolbarOwnProps {
  isDisabled?: boolean;
  isProject?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  pagination?: React.ReactNode;
  query?: RosQuery;
}

interface OptimizationsToolbarStateProps {
  // TBD...
}

interface OptimizationsToolbarDispatchProps {
  closeOptimizationsDrawer: typeof uiActions.closeOptimizationsDrawer;
}

interface OptimizationsToolbarState {
  categoryOptions?: ToolbarChipGroup[];
}

type OptimizationsToolbarProps = OptimizationsToolbarOwnProps &
  OptimizationsToolbarStateProps &
  OptimizationsToolbarDispatchProps &
  WrappedComponentProps;

export class OptimizationsToolbarBase extends React.Component<OptimizationsToolbarProps, OptimizationsToolbarState> {
  protected defaultState: OptimizationsToolbarState = {};
  public state: OptimizationsToolbarState = { ...this.defaultState };

  public componentDidMount() {
    this.setState({
      categoryOptions: this.getCategoryOptions(),
    });
  }

  private getCategoryOptions = (): ToolbarChipGroup[] => {
    const { intl, isProject } = this.props;

    const options = [
      { name: intl.formatMessage(messages.filterByValues, { value: 'container' }), key: 'container' },
      { name: intl.formatMessage(messages.filterByValues, { value: 'cluster' }), key: 'cluster' },
      { name: intl.formatMessage(messages.filterByValues, { value: 'project' }), key: 'project' },
      { name: intl.formatMessage(messages.filterByValues, { value: 'workload' }), key: 'workload' },
      { name: intl.formatMessage(messages.filterByValues, { value: 'workload_type' }), key: 'workload_type' },
    ];
    return isProject ? options : options.filter(option => option.key !== 'project');
  };

  private handleOnFilterAdded = (filter: Filter) => {
    const { closeOptimizationsDrawer, onFilterAdded } = this.props;

    closeOptimizationsDrawer();
    if (onFilterAdded) {
      onFilterAdded(filter);
    }
  };

  private handleOnFilterRemoved = (filter: Filter) => {
    const { closeOptimizationsDrawer, onFilterRemoved } = this.props;

    closeOptimizationsDrawer();
    if (onFilterRemoved) {
      onFilterRemoved(filter);
    }
  };

  public render() {
    const { isDisabled, itemsPerPage, itemsTotal, pagination, query } = this.props;
    const { categoryOptions } = this.state;

    return (
      <DataToolbar
        categoryOptions={categoryOptions}
        isDisabled={isDisabled}
        itemsPerPage={itemsPerPage}
        itemsTotal={itemsTotal}
        onFilterAdded={this.handleOnFilterAdded}
        onFilterRemoved={this.handleOnFilterRemoved}
        pagination={pagination}
        query={query}
        showFilter
      />
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<OptimizationsToolbarOwnProps, OptimizationsToolbarStateProps>(() => {
  return {
    // TBD...
  };
});

const mapDispatchToProps: OptimizationsToolbarDispatchProps = {
  closeOptimizationsDrawer: uiActions.closeOptimizationsDrawer,
};

const OptimizationsToolbarConnect = connect(mapStateToProps, mapDispatchToProps)(OptimizationsToolbarBase);
const OptimizationsToolbar = injectIntl(OptimizationsToolbarConnect);

export { OptimizationsToolbar };
export type { OptimizationsToolbarProps };
