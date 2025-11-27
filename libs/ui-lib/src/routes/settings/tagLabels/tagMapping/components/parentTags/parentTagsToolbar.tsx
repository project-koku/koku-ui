import type { Query } from '@koku-ui/api/queries/query';
import type { SettingsData } from '@koku-ui/api/settings';
import messages from '@koku-ui/i18n/locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';

import { BasicToolbar } from '../../../../../components/dataToolbar';
import type { ToolbarChipGroupExt } from '../../../../../components/dataToolbar/utils/common';
import type { Filter } from '../../../../../utils/filter';

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
