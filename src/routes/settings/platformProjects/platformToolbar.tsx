import type { ToolbarChipGroup } from '@patternfly/react-core';
import { Button, ButtonVariant, Tooltip } from '@patternfly/react-core';
import type { OcpQuery } from 'api/queries/ocpQuery';
import { ResourcePathsType } from 'api/resources/resource';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { BasicToolbar } from 'routes/components/dataToolbar';
import type { ComputedReportItem } from 'routes/utils/computedReport/getComputedReportItems';
import type { Filter } from 'routes/utils/filter';
import { createMapStateToProps } from 'store/common';

import { styles } from './platformProjects.styles';

interface PlatformToolbarOwnProps {
  isAllSelected?: boolean;
  isDisabled?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onAddProjects();
  onBulkSelected(action: string);
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  onRemoveProjects();
  pagination?: React.ReactNode;
  query?: OcpQuery;
  selectedItems?: ComputedReportItem[];
}

interface PlatformToolbarStateProps {
  // TBD...
}

interface PlatformToolbarDispatchProps {
  // TBD...
}

interface PlatformToolbarState {
  categoryOptions?: ToolbarChipGroup[];
}

type PlatformToolbarProps = PlatformToolbarOwnProps &
  PlatformToolbarStateProps &
  PlatformToolbarDispatchProps &
  WrappedComponentProps;

export class PlatformToolbarBase extends React.Component<PlatformToolbarProps, PlatformToolbarState> {
  protected defaultState: PlatformToolbarState = {};
  public state: PlatformToolbarState = { ...this.defaultState };

  public componentDidMount() {
    this.setState({
      categoryOptions: this.getCategoryOptions(),
    });
  }

  private getActions = () => {
    const { intl, onAddProjects, onRemoveProjects, selectedItems } = this.props;

    const isDisabled = selectedItems.length === 0;

    return (
      <>
        <Tooltip content={intl.formatMessage(messages.selectProjects)}>
          <Button isAriaDisabled={isDisabled} key="save" onClick={onAddProjects} variant={ButtonVariant.primary}>
            {intl.formatMessage(messages.addProjects)}
          </Button>
        </Tooltip>
        <Tooltip content={intl.formatMessage(messages.selectProjects)}>
          <Button
            isAriaDisabled={isDisabled}
            key="reset"
            onClick={onRemoveProjects}
            style={styles.action}
            variant={ButtonVariant.secondary}
          >
            {intl.formatMessage(messages.removeProjects)}
          </Button>
        </Tooltip>
      </>
    );
  };

  private getCategoryOptions = (): ToolbarChipGroup[] => {
    const { intl } = this.props;

    const options = [
      { name: intl.formatMessage(messages.filterByValues, { value: 'name' }), key: 'project' }, // Todo: update filter name
      { name: intl.formatMessage(messages.filterByValues, { value: 'group' }), key: 'group' },
      { name: intl.formatMessage(messages.filterByValues, { value: 'cluster' }), key: 'cluster' },
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
      <BasicToolbar
        actions={this.getActions()}
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
      />
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<PlatformToolbarOwnProps, PlatformToolbarStateProps>((state, props) => {
  return {
    // TBD...
  };
});

const mapDispatchToProps: PlatformToolbarDispatchProps = {
  // TBD...
};

const PlatformToolbarConnect = connect(mapStateToProps, mapDispatchToProps)(PlatformToolbarBase);
const PlatformToolbar = injectIntl(PlatformToolbarConnect);

export { PlatformToolbar };
export type { PlatformToolbarProps };
