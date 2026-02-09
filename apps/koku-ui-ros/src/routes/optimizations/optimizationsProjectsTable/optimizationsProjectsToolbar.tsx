import type { ToolbarLabelGroup } from '@patternfly/react-core';
import type { RosQuery } from 'api/queries/rosQuery';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { BasicToolbar } from 'routes/components/dataToolbar';
import type { Filter } from 'routes/utils/filter';

interface OptimizationsProjectsToolbarOwnProps {
  hideCluster?: boolean;
  hideProject?: boolean;
  isDisabled?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  pagination?: React.ReactNode;
  query?: RosQuery;
}

interface OptimizationsProjectsToolbarState {
  categoryOptions?: ToolbarLabelGroup[];
}

type OptimizationsProjectsToolbarProps = OptimizationsProjectsToolbarOwnProps & WrappedComponentProps;

class OptimizationsProjectsToolbarBase extends React.Component<
  OptimizationsProjectsToolbarProps,
  OptimizationsProjectsToolbarState
> {
  protected defaultState: OptimizationsProjectsToolbarState = {};
  public state: OptimizationsProjectsToolbarState = { ...this.defaultState };

  public componentDidMount() {
    this.setState({
      categoryOptions: this.getCategoryOptions(),
    });
  }

  private getCategoryOptions = (): ToolbarLabelGroup[] => {
    const { hideCluster, hideProject, intl } = this.props;

    const options = [
      { name: intl.formatMessage(messages.filterByValues, { value: 'container' }), key: 'container' },
      { name: intl.formatMessage(messages.filterByValues, { value: 'cluster' }), key: 'cluster' },
      { name: intl.formatMessage(messages.filterByValues, { value: 'project' }), key: 'project' },
      { name: intl.formatMessage(messages.filterByValues, { value: 'workload' }), key: 'workload' },
      {
        name: intl.formatMessage(messages.filterByValues, { value: 'workload_type' }),
        key: 'workload_type',
        selectClassName: 'selectOverride', // A selector from routes/components/dataToolbar/dataToolbar.scss
        selectOptions: [
          { name: 'daemonset', key: 'daemonset' },
          { name: 'deployment', key: 'deployment' },
          { name: 'deploymentconfig', key: 'deploymentconfig' },
          { name: 'replicaset', key: 'replicaset' },
          { name: 'replicationcontroller', key: 'replicationcontroller' },
          { name: 'statefulset', key: 'statefulset' },
        ],
      },
    ];
    const filteredOptions = hideCluster ? options.filter(option => option.key !== 'cluster') : options;
    return hideProject ? filteredOptions.filter(option => option.key !== 'project') : filteredOptions;
  };

  public render() {
    const { isDisabled, itemsPerPage, itemsTotal, onFilterAdded, onFilterRemoved, pagination, query } = this.props;
    const { categoryOptions } = this.state;

    return (
      <BasicToolbar
        categoryOptions={categoryOptions}
        isDisabled={isDisabled}
        itemsPerPage={itemsPerPage}
        itemsTotal={itemsTotal}
        onFilterAdded={onFilterAdded}
        onFilterRemoved={onFilterRemoved}
        pagination={pagination}
        query={query}
        showFilter
        useActiveFilters
      />
    );
  }
}

const OptimizationsProjectsToolbar = injectIntl(OptimizationsProjectsToolbarBase);

export { OptimizationsProjectsToolbar };
