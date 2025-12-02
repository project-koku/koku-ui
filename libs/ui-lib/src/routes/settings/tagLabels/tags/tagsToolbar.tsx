import type { Query } from '@koku-ui/api/queries/query';
import type { SettingsData } from '@koku-ui/api/settings';
import messages from '@koku-ui/i18n/locales/messages';
import { Button, ButtonVariant, Tooltip } from '@patternfly/react-core';
import React from 'react';
import { useIntl } from 'react-intl';

import { BasicToolbar } from '../../../components/dataToolbar';
import type { ToolbarChipGroupExt } from '../../../components/dataToolbar/utils/common';
import type { Filter } from '../../../utils/filter';
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

type TagsToolbarProps = TagsToolbarOwnProps;

const TagsToolbar: React.FC<TagsToolbarProps> = ({
  canWrite,
  enabledTagsCount = 0,
  enabledTagsLimit = 0,
  isAllSelected,
  isDisabled,
  isPrimaryActionDisabled,
  isSecondaryActionDisabled,
  itemsPerPage,
  itemsTotal,
  onBulkSelect,
  onDisableTags,
  onEnableTags,
  onFilterAdded,
  onFilterRemoved,
  pagination,
  query,
  selectedItems,
  showBulkSelectAll,
}) => {
  const intl = useIntl();

  const getActions = () => {
    const disabledItems = selectedItems.filter((item: any) => !item.enabled);
    const isLimit = disabledItems.length + enabledTagsCount > enabledTagsLimit;
    const isAriaDisabled = !canWrite || isDisabled || selectedItems.length === 0;
    const enableTagsTooltip = intl.formatMessage(
      !canWrite ? messages.readOnlyPermissions : isLimit ? messages.deselectTags : messages.selectTags,
      { count: enabledTagsLimit }
    );
    const disableTagsTooltip = intl.formatMessage(!canWrite ? messages.readOnlyPermissions : messages.selectTags);

    return (
      <>
        <Tooltip content={enableTagsTooltip}>
          <Button
            isAriaDisabled={isAriaDisabled || isPrimaryActionDisabled || isLimit}
            key="save"
            onClick={onEnableTags}
            variant={ButtonVariant.primary}
          >
            {intl.formatMessage(messages.enableTags)}
          </Button>
        </Tooltip>
        <Tooltip content={disableTagsTooltip}>
          <Button
            isAriaDisabled={isAriaDisabled || isSecondaryActionDisabled}
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

  const getCategoryOptions = (): ToolbarChipGroupExt[] => {
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

  return (
    <BasicToolbar
      actions={getActions()}
      categoryOptions={getCategoryOptions()}
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
      selectedItems={selectedItems}
      showBulkSelect
      showFilter
      showBulkSelectAll={showBulkSelectAll}
    />
  );
};

export { TagsToolbar };
