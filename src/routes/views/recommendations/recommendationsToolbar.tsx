import type { ToolbarChipGroup } from '@patternfly/react-core';
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

interface RecommendationsToolbarOwnProps {
  isDisabled?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  pagination?: React.ReactNode;
  query?: OcpQuery;
}

interface RecommendationsToolbarStateProps {
  // TBD...
}

interface RecommendationsToolbarDispatchProps {
  // TBD...
}

interface RecommendationsToolbarState {
  categoryOptions?: ToolbarChipGroup[];
}

type RecommendationsToolbarProps = RecommendationsToolbarOwnProps &
  RecommendationsToolbarStateProps &
  RecommendationsToolbarDispatchProps &
  WrappedComponentProps;

export class RecommendationsToolbarBase extends React.Component<RecommendationsToolbarProps> {
  protected defaultState: RecommendationsToolbarState = {};
  public state: RecommendationsToolbarState = { ...this.defaultState };

  public componentDidMount() {
    this.setState({
      categoryOptions: this.getCategoryOptions(),
    });
  }

  private getCategoryOptions = (): ToolbarChipGroup[] => {
    const { intl } = this.props;

    const options = [
      { name: intl.formatMessage(messages.filterByValues, { value: 'cluster' }), key: 'cluster' },
      { name: intl.formatMessage(messages.filterByValues, { value: 'project' }), key: 'project' },
      { name: intl.formatMessage(messages.filterByValues, { value: 'workload_type' }), key: 'workload_type' },
      { name: intl.formatMessage(messages.filterByValues, { value: 'workload' }), key: 'workload' },
      { name: intl.formatMessage(messages.filterByValues, { value: 'container' }), key: 'container' },
    ];
    return options;
  };

  public render() {
    const { isDisabled, itemsPerPage, itemsTotal, onFilterAdded, onFilterRemoved, pagination, query } = this.props;
    const { categoryOptions } = this.state;

    return (
      <DataToolbar
        categoryOptions={categoryOptions}
        isDisabled={isDisabled}
        itemsPerPage={itemsPerPage}
        itemsTotal={itemsTotal}
        onFilterAdded={onFilterAdded}
        onFilterRemoved={onFilterRemoved}
        pagination={pagination}
        query={query}
        resourcePathsType={ResourcePathsType.ocp}
        showFilter
      />
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<RecommendationsToolbarOwnProps, RecommendationsToolbarStateProps>(() => {
  return {
    // TBD...
  };
});

const mapDispatchToProps: RecommendationsToolbarDispatchProps = {
  // TBD...
};

const RecommendationsToolbarConnect = connect(mapStateToProps, mapDispatchToProps)(RecommendationsToolbarBase);
const RecommendationsToolbar = injectIntl(RecommendationsToolbarConnect);

export { RecommendationsToolbar };
export type { RecommendationsToolbarProps };
