import { Button, ButtonVariant, Tooltip } from '@patternfly/react-core';
import type { OcpQuery } from 'api/queries/ocpQuery';
import { ResourcePathsType } from 'api/resources/resource';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { BasicToolbar } from 'routes/components/dataToolbar';
import type { ToolbarChipGroupExt } from 'routes/components/dataToolbar/basicToolbar';
import type { ComputedReportItem } from 'routes/utils/computedReport/getComputedReportItems';
import type { Filter } from 'routes/utils/filter';
import { createMapStateToProps } from 'store/common';

import { styles } from './tagDetails.styles';

interface TagToolbarOwnProps {
  canWrite?: boolean;
  isAllSelected?: boolean;
  isDisabled?: boolean;
  isPrimaryActionDisabled?: boolean;
  isSecondaryActionDisabled?: boolean;
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
  showBulkSelectAll?: boolean;
}

interface TagToolbarStateProps {
  // TBD...
}

interface TagToolbarDispatchProps {
  // TBD...
}

interface TagToolbarState {
  categoryOptions?: ToolbarChipGroupExt[];
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
    const {
      canWrite,
      intl,
      isPrimaryActionDisabled,
      isSecondaryActionDisabled,
      onDisableTags,
      onEnableTags,
      selectedItems,
    } = this.props;

    const isDisabled = !canWrite || selectedItems.length === 0;
    const tooltip = intl.formatMessage(!canWrite ? messages.readOnlyPermissions : messages.selectCategories);

    return (
      <>
        <Tooltip content={tooltip}>
          <Button
            isAriaDisabled={isDisabled || isPrimaryActionDisabled}
            key="save"
            onClick={onEnableTags}
            variant={ButtonVariant.primary}
          >
            {intl.formatMessage(messages.enableTags)}
          </Button>
        </Tooltip>
        <Tooltip content={tooltip}>
          <Button
            isAriaDisabled={isDisabled || isSecondaryActionDisabled}
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

  private getCategoryOptions = (): ToolbarChipGroupExt[] => {
    const { intl } = this.props;

    const options = [
      {
        ariaLabelKey: 'name',
        placeholderKey: 'name',
        key: 'key',
        name: intl.formatMessage(messages.filterByValues, { value: 'name' }),
      },
      {
        ariaLabelKey: 'source_type',
        placeholderKey: 'source_type',
        key: 'provider_type',
        name: intl.formatMessage(messages.filterByValues, { value: 'source_type' }),
        selectOptions: [
          {
            key: 'AWS',
            name: intl.formatMessage(messages.aws),
          },
          {
            key: 'Azure',
            name: intl.formatMessage(messages.azure),
          },
          {
            key: 'GCP',
            name: intl.formatMessage(messages.gcp),
          },
          // {
          //   key: 'IBM',
          //   name: intl.formatMessage(messages.ibm), // Todo: enable when supported by API
          // },
          {
            key: 'OCI',
            name: intl.formatMessage(messages.oci),
          },
          {
            key: 'OCP',
            name: intl.formatMessage(messages.openShift),
          },
        ],
      },
      {
        ariaLabelKey: 'status',
        placeholderKey: 'status',
        key: 'enabled',
        name: intl.formatMessage(messages.filterByValues, { value: 'status' }),
        selectOptions: [
          {
            name: intl.formatMessage(messages.enabled),
            key: 'true',
          },
          {
            name: intl.formatMessage(messages.disabled),
            key: 'false',
          },
        ],
      },
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
      showBulkSelectAll,
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
        showBulkSelectAll={showBulkSelectAll}
        useActiveFilters={false}
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
