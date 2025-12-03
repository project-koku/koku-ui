import type { Query } from '@koku-ui/api/queries/query';
import messages from '@koku-ui/i18n/locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';

import { BasicToolbar } from '../../../components/dataToolbar';
import type { ToolbarChipGroupExt } from '../../../components/dataToolbar/utils/common';
import type { Filter } from '../../../utils/filter';
import { ParentTagMapping } from './components/parentTagMapping';

interface TagMappingToolbarOwnProps {
  canWrite?: boolean;
  isAllSelected?: boolean;
  isDisabled?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onClose?: () => void;
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  pagination?: React.ReactNode;
  query?: Query;
}

type TagMappingToolbarProps = TagMappingToolbarOwnProps;

const TagMappingToolbar: React.FC<TagMappingToolbarProps> = ({
  canWrite,
  isAllSelected,
  isDisabled,
  itemsPerPage,
  itemsTotal,
  onClose,
  onFilterAdded,
  onFilterRemoved,
  pagination,
  query,
}) => {
  const intl = useIntl();

  const getCategoryOptions = (): ToolbarChipGroupExt[] => {
    const options = [
      {
        ariaLabelKey: 'tag_key_parent',
        placeholderKey: 'tag_key_parent',
        key: 'parent',
        name: intl.formatMessage(messages.filterByValues, { value: 'tag_key_parent' }),
      },
      {
        ariaLabelKey: 'tag_key_child',
        placeholderKey: 'tag_key_child',
        key: 'child',
        name: intl.formatMessage(messages.filterByValues, { value: 'tag_key_child' }),
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
      actions={<ParentTagMapping canWrite={canWrite} isDisabled={isDisabled} onClose={onClose} />}
      categoryOptions={getCategoryOptions()}
      isAllSelected={isAllSelected}
      isDisabled={isDisabled}
      isReadOnly={!canWrite}
      itemsPerPage={itemsPerPage}
      itemsTotal={itemsTotal}
      onFilterAdded={onFilterAdded}
      onFilterRemoved={onFilterRemoved}
      pagination={pagination}
      query={query}
      showFilter
    />
  );
};

export { TagMappingToolbar };
