import type { ToolbarLabelGroup } from '@patternfly/react-core';
import type { RosQuery } from 'api/queries/rosQuery';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { DataToolbar } from 'routes/components/dataToolbar';
import type { Filter } from 'routes/utils/filter';

interface OptimizationsProjectsToolbarOwnProps {
  isClusterHidden?: boolean;
  isDisabled?: boolean;
  isProjectHidden?: boolean;
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
    const { intl, isClusterHidden, isProjectHidden } = this.props;

    // Available values -- see https://github.com/RedHatInsights/ros-ocp-backend/blob/main/openapi.json
    const options = [];
    if (!isClusterHidden) {
      options.push({ name: intl.formatMessage(messages.filterByValues, { value: 'cluster' }), key: 'cluster' });
    }
    if (!isProjectHidden) {
      options.push({ name: intl.formatMessage(messages.filterByValues, { value: 'project' }), key: 'project' });
    }
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
        showCriteria
        showExact
        showFilter
      />
    );
  }
}

const OptimizationsProjectsToolbar = injectIntl(OptimizationsProjectsToolbarBase);

export { OptimizationsProjectsToolbar };
