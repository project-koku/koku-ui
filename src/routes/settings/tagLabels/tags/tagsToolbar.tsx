import { Button, ButtonVariant, Tooltip } from '@patternfly/react-core';
import type { Query } from 'api/queries/query';
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

import { styles } from './tags.styles';

interface TagsToolbarOwnProps {
  canWrite?: boolean;
  enabledTagsCount?: number;
  enabledTagsLimit?: number;
  isAllSelected?: boolean;
  isDisabled?: boolean;
  isPrimaryActionDisabled?: boolean;
  isSecondaryActionDisabled?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onBulkSelect(action: string);
  onDisableTags();
  onEnableTags();
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  pagination?: React.ReactNode;
  query?: Query;
  selectedItems?: SettingsData[];
  showBulkSelectAll?: boolean;
}

interface TagsToolbarStateProps {
  // TBD...
}

interface TagsToolbarDispatchProps {
  // TBD...
}

interface TagsToolbarState {
  categoryOptions?: ToolbarChipGroupExt[];
}

type TagsToolbarProps = TagsToolbarOwnProps & TagsToolbarStateProps & TagsToolbarDispatchProps & WrappedComponentProps;

export class TagsToolbarBase extends React.Component<TagsToolbarProps, TagsToolbarState> {
  protected defaultState: TagsToolbarState = {};
  public state: TagsToolbarState = { ...this.defaultState };

  public componentDidMount() {
    this.setState({
      categoryOptions: this.getCategoryOptions(),
    });
  }

  private getActions = () => {
    const {
      canWrite,
      enabledTagsCount = 0,
      enabledTagsLimit = 0,
      intl,
      isPrimaryActionDisabled,
      isSecondaryActionDisabled,
      onDisableTags,
      onEnableTags,
      selectedItems,
    } = this.props;

    const disabledItems = selectedItems.filter((item: any) => !item.enabled);
    const isLimit = disabledItems.length + enabledTagsCount > enabledTagsLimit;
    const isDisabled = !canWrite || selectedItems.length === 0;
    const enableTagsTooltip = intl.formatMessage(
      !canWrite ? messages.readOnlyPermissions : isLimit ? messages.deselectTags : messages.selectTags,
      { count: enabledTagsLimit }
    );
    const disableTagsTooltip = intl.formatMessage(!canWrite ? messages.readOnlyPermissions : messages.selectTags);

    return (
      <>
        <Tooltip content={enableTagsTooltip}>
          <Button
            isAriaDisabled={isDisabled || isPrimaryActionDisabled || isLimit}
            key="save"
            onClick={onEnableTags}
            variant={ButtonVariant.primary}
          >
            {intl.formatMessage(messages.enableTags)}
          </Button>
        </Tooltip>
        <Tooltip content={disableTagsTooltip}>
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
        key: 'source_type',
        name: intl.formatMessage(messages.filterByValues, { value: 'source_type' }),
        selectClassName: 'selectOverride', // A selector from routes/components/dataToolbar/dataToolbar.scss
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
        isAllSelected={isAllSelected}
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
        showFilter
        showBulkSelectAll={showBulkSelectAll}
      />
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<TagsToolbarOwnProps, TagsToolbarStateProps>((state, props) => {
  return {
    // TBD...
  };
});

const mapDispatchToProps: TagsToolbarDispatchProps = {
  // TBD...
};

const TagsToolbarConnect = connect(mapStateToProps, mapDispatchToProps)(TagsToolbarBase);
const TagsToolbar = injectIntl(TagsToolbarConnect);

export { TagsToolbar };
export type { TagsToolbarProps };
