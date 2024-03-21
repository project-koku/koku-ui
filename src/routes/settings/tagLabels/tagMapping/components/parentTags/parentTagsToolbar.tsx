import type { Query } from 'api/queries/query';
import type { SettingsData } from 'api/settings';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { BasicToolbar } from 'routes/components/dataToolbar';
import type { ToolbarChipGroupExt } from 'routes/components/dataToolbar/utils/common';
import type { Filter } from 'routes/utils/filter';

interface ParentTagsToolbarOwnProps {
  isDisabled?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onBulkSelect(action: string);
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  pagination?: React.ReactNode;
  selectedItems?: SettingsData[];
  query?: Query;
}

type ParentTagsToolbarProps = ParentTagsToolbarOwnProps;

const ParentTagsToolbar: React.FC<ParentTagsToolbarProps> = ({
  isDisabled,
  itemsPerPage,
  itemsTotal,
  onBulkSelect,
  onFilterAdded,
  onFilterRemoved,
  pagination,
  selectedItems,
  query,
}) => {
  const intl = useIntl();

  const getCategoryOptions = (): ToolbarChipGroupExt[] => {
    const options = [
      {
        ariaLabelKey: 'tag_key',
        placeholderKey: 'tag_key',
        key: 'key',
        name: intl.formatMessage(messages.filterByValues, { value: 'tag_key' }),
      },
    ];
    return options;
  };

  return (
    <BasicToolbar
      categoryOptions={getCategoryOptions()}
      isDisabled={isDisabled}
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
      showBulkSelectAll={false}
      showBulkSelectPage={false}
    />
  );
};

export { ParentTagsToolbar };
