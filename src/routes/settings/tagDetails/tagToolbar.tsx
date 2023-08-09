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

import { styles } from './tagDetails.styles';

interface TagToolbarOwnProps {
  canWrite?: boolean;
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

interface TagToolbarStateProps {
  // TBD...
}

interface TagToolbarDispatchProps {
  // TBD...
}

interface TagToolbarState {
  categoryOptions?: ToolbarChipGroup[];
}

type TagToolbarProps = TagToolbarOwnProps & TagToolbarStateProps & TagToolbarDispatchProps & WrappedComponentProps;

export class TagToolbarBase extends React.Component<TagToolbarProps, TagToolbarState> {
  protected defaultState: TagToolbarState = {};
  public state: TagToolbarState = { ...this.defaultState };

  public componentDidMount() {
    this.setState({
      categoryOptions: this.getCategoryOptions(),
    });
  }

  private getActions = () => {
    const { canWrite, intl, onDisableTags, onEnableTags, selectedItems } = this.props;

    const isDisabled = !canWrite || selectedItems.length === 0;
    const tooltip = intl.formatMessage(!canWrite ? messages.readOnlyPermissions : messages.selectCategories);

    return (
      <>
        <Tooltip content={tooltip}>
          <Button isAriaDisabled={isDisabled} key="save" onClick={onEnableTags} variant={ButtonVariant.primary}>
            {intl.formatMessage(messages.enableTags)}
          </Button>
        </Tooltip>
        <Tooltip content={tooltip}>
          <Button
            isAriaDisabled={isDisabled}
            key="reset"
            onClick={onDisableTags}
            style={styles.action}
            variant={ButtonVariant.secondary}
          >
            {intl.formatMessage(messages.disableTags)}
          </Button>
        </Tooltip>
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
      canWrite,
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
        isReadOnly={!canWrite}
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
const mapStateToProps = createMapStateToProps<TagToolbarOwnProps, TagToolbarStateProps>((state, props) => {
  return {
    // TBD...
  };
});

const mapDispatchToProps: TagToolbarDispatchProps = {
  // TBD...
};

const TagToolbarConnect = connect(mapStateToProps, mapDispatchToProps)(TagToolbarBase);
const TagToolbar = injectIntl(TagToolbarConnect);

export { TagToolbar };
export type { TagToolbarProps };
