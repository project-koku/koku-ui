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

interface RosToolbarOwnProps {
  isDisabled?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  pagination?: React.ReactNode;
  query?: OcpQuery;
}

interface RosToolbarStateProps {
  // TBD...
}

interface RosToolbarDispatchProps {
  // TBD...
}

interface RosToolbarState {
  categoryOptions?: ToolbarChipGroup[];
}

type RosToolbarProps = RosToolbarOwnProps & RosToolbarStateProps & RosToolbarDispatchProps & WrappedComponentProps;

export class RosToolbarBase extends React.Component<RosToolbarProps> {
  protected defaultState: RosToolbarState = {};
  public state: RosToolbarState = { ...this.defaultState };

  public componentDidMount() {
    this.setState({
      categoryOptions: this.getCategoryOptions(),
    });
  }

  public componentDidUpdate(prevProps: RosToolbarProps) {
    // TBD...
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
const mapStateToProps = createMapStateToProps<RosToolbarOwnProps, RosToolbarStateProps>((state, props) => {
  return {
    // TBD...
  };
});

const mapDispatchToProps: RosToolbarDispatchProps = {
  // TBD...
};

const RosToolbarConnect = connect(mapStateToProps, mapDispatchToProps)(RosToolbarBase);
const RosToolbar = injectIntl(RosToolbarConnect);

export { RosToolbar };
export type { RosToolbarProps };
