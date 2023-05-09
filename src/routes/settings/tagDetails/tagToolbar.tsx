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

import { styles } from './tagDetails.styles';

interface DetailsToolbarOwnProps {
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

interface DetailsToolbarStateProps {
  // TBD...
}

interface DetailsToolbarDispatchProps {
  // TBD...
}

interface DetailsToolbarState {
  categoryOptions?: ToolbarChipGroup[];
}

type DetailsToolbarProps = DetailsToolbarOwnProps &
  DetailsToolbarStateProps &
  DetailsToolbarDispatchProps &
  WrappedComponentProps;

export class DetailsToolbarBase extends React.Component<DetailsToolbarProps, DetailsToolbarState> {
  protected defaultState: DetailsToolbarState = {};
  public state: DetailsToolbarState = { ...this.defaultState };

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
          {intl.formatMessage(messages.enableTags)}
        </Button>
        <Button
          isDisabled={selectedItems.length === 0}
          key="reset"
          onClick={onDisableTags}
          style={styles.action}
          variant={ButtonVariant.secondary}
        >
          {intl.formatMessage(messages.disableTags)}
        </Button>
      </>
    );
  };

  private getCategoryOptions = (): ToolbarChipGroup[] => {
    const { intl } = this.props;

    const options = [
      { name: intl.formatMessage(messages.filterByValues, { value: 'name' }), key: 'name' },
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
const mapStateToProps = createMapStateToProps<DetailsToolbarOwnProps, DetailsToolbarStateProps>((state, props) => {
  return {
    // TBD...
  };
});

const mapDispatchToProps: DetailsToolbarDispatchProps = {
  // TBD...
};

const DetailsToolbarConnect = connect(mapStateToProps, mapDispatchToProps)(DetailsToolbarBase);
const TagToolbar = injectIntl(DetailsToolbarConnect);

export { TagToolbar };
export type { DetailsToolbarProps };
