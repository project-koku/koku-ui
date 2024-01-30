import { Button, ButtonVariant, Tooltip } from '@patternfly/react-core';
import type { OcpQuery } from 'api/queries/ocpQuery';
import { ResourcePathsType } from 'api/resources/resource';
import type { SettingsData } from 'api/settings';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { BasicToolbar } from 'routes/components/dataToolbar';
import type { ToolbarChipGroupExt } from 'routes/components/dataToolbar/utils/common';
import type { Filter } from 'routes/utils/filter';
import { createMapStateToProps } from 'store/common';

import { styles } from './platformProjects.styles';

// eslint-disable-next-line no-shadow
export const enum GroupType {
  default = 'default',
  platform = 'Platform',
}

interface CostCategoryToolbarOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  isPrimaryActionDisabled?: boolean;
  isSecondaryActionDisabled?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onAdd();
  onBulkSelect(action: string);
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  onRemove();
  pagination?: React.ReactNode;
  query?: OcpQuery;
  selectedItems?: SettingsData[];
  showBulkSelectAll?: boolean;
}

interface CostCategoryToolbarStateProps {
  // TBD...
}

interface CostCategoryToolbarDispatchProps {
  // TBD...
}

interface CostCategoryToolbarState {
  categoryOptions?: ToolbarChipGroupExt[];
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

  private getActions = () => {
    const { canWrite, intl, isPrimaryActionDisabled, isSecondaryActionDisabled, onAdd, onRemove, selectedItems } =
      this.props;

    const isDisabled = !canWrite || selectedItems.length === 0;
    const tooltip = intl.formatMessage(!canWrite ? messages.readOnlyPermissions : messages.selectProjects);

    return (
      <>
        <Tooltip content={tooltip}>
          <Button
            isAriaDisabled={isDisabled || isPrimaryActionDisabled}
            key="save"
            onClick={onAdd}
            variant={ButtonVariant.primary}
          >
            {intl.formatMessage(messages.addProjects)}
          </Button>
        </Tooltip>
        <Tooltip content={tooltip}>
          <Button
            isAriaDisabled={isDisabled || isSecondaryActionDisabled}
            key="reset"
            onClick={onRemove}
            style={styles.action}
            variant={ButtonVariant.secondary}
          >
            {intl.formatMessage(messages.removeProjects)}
          </Button>
        </Tooltip>
      </>
    );
  };

  private getCategoryOptions = (): ToolbarChipGroupExt[] => {
    const { intl } = this.props;

    const options = [
      {
        ariaLabelKey: 'name',
        placeholderKey: 'name',
        key: 'project',
        name: intl.formatMessage(messages.filterByValues, { value: 'name' }),
      },
      {
        ariaLabelKey: 'group',
        placeholderKey: 'group',
        key: 'group',
        name: intl.formatMessage(messages.filterByValues, { value: 'group' }),
        selectOptions: [
          {
            name: intl.formatMessage(messages.platform),
            key: GroupType.platform,
          },
        ],
      },
      {
        ariaLabelKey: 'cluster',
        placeholderKey: 'cluster',
        key: 'cluster',
        name: intl.formatMessage(messages.filterByValues, { value: 'cluster' }),
      },
    ];
    return options;
  };

  public render() {
    const {
      canWrite,
      isDisabled,
      itemsPerPage,
      itemsTotal,
      onBulkSelect,
      onFilterAdded,
      onFilterRemoved,
      pagination,
      query,
      selectedItems,
      showBulkSelectAll,
    } = this.props;
    const { categoryOptions } = this.state;

    return (
      <BasicToolbar
        actions={this.getActions()}
        categoryOptions={categoryOptions}
        isDisabled={isDisabled}
        isReadOnly={!canWrite}
        itemsPerPage={itemsPerPage}
        itemsTotal={itemsTotal}
        onBulkSelect={onBulkSelect}
        onFilterAdded={onFilterAdded}
        onFilterRemoved={onFilterRemoved}
        pagination={pagination}
        query={query}
        resourcePathsType={ResourcePathsType.ocp}
        selectedItems={selectedItems}
        showBulkSelect
        showBulkSelectAll={showBulkSelectAll}
        showFilter
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
const PlatformProjectsToolbar = injectIntl(CostCategoryToolbarConnect);

export { PlatformProjectsToolbar };
export type { CostCategoryToolbarProps };
