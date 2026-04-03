import type { ToolbarLabelGroup } from '@patternfly/react-core';
import type { OcpQuery } from 'api/queries/ocpQuery';
import type { ResourcePathsType } from 'api/resources/resource';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { DataToolbar } from 'routes/components/dataToolbar';
import { isEqual } from 'routes/utils/equal';
import type { Filter } from 'routes/utils/filter';
import { createMapStateToProps } from 'store/common';

interface EfficiencyToolbarOwnProps {
  isDisabled?: boolean;
  groupBy?: string;
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  query?: OcpQuery;
  resourcePathsType?: ResourcePathsType;
}

interface EfficiencyToolbarStateProps {
  // TBD...
}

interface EfficiencyToolbarDispatchProps {
  // TBD...
}

interface EfficiencyToolbarState {
  categoryOptions?: ToolbarLabelGroup[];
}

type EfficiencyToolbarProps = EfficiencyToolbarOwnProps &
  EfficiencyToolbarStateProps &
  EfficiencyToolbarDispatchProps &
  WrappedComponentProps;

export class EfficiencyToolbarBase extends React.Component<EfficiencyToolbarProps, EfficiencyToolbarState> {
  protected defaultState: EfficiencyToolbarState = {};
  public state: EfficiencyToolbarState = { ...this.defaultState };

  public componentDidMount() {
    this.setState(
      {
        categoryOptions: this.getCategoryOptions(),
      },
      () => {
        this.updateReport();
      }
    );
  }

  public componentDidUpdate(prevProps: EfficiencyToolbarProps) {
    const { query } = this.props;

    if (query && !isEqual(query, prevProps.query)) {
      this.updateReport();
    }
  }

  private getCategoryOptions = (): ToolbarLabelGroup[] => {
    const { intl } = this.props;

    const options = [
      {
        name: intl.formatMessage(messages.filterByValues, { value: 'cluster' }),
        key: 'cluster',
        resourceKey: 'cluster_alias',
      },
      // { name: intl.formatMessage(messages.filterByValues, { value: 'node' }), key: 'node' },
      { name: intl.formatMessage(messages.filterByValues, { value: 'project' }), key: 'project' },
    ];

    return options;
  };

  private updateReport = () => {
    // TBD...
  };

  public render() {
    const { groupBy, isDisabled, onFilterAdded, onFilterRemoved, query, resourcePathsType } = this.props;
    const { categoryOptions } = this.state;

    return (
      <DataToolbar
        categoryOptions={categoryOptions}
        groupBy={groupBy}
        isDisabled={isDisabled}
        onFilterAdded={onFilterAdded}
        onFilterRemoved={onFilterRemoved}
        query={query}
        resourcePathsType={resourcePathsType}
        showCriteria
        showFilter
      />
    );
  }
}

const mapStateToProps = createMapStateToProps<EfficiencyToolbarOwnProps, EfficiencyToolbarStateProps>(() => {
  return {
    // TBD...
  };
});

const mapDispatchToProps: EfficiencyToolbarDispatchProps = {
  // TBD...
};

const EfficiencyToolbarConnect = connect(mapStateToProps, mapDispatchToProps)(EfficiencyToolbarBase);
const EfficiencyToolbar = injectIntl(EfficiencyToolbarConnect);

export { EfficiencyToolbar };
