import type { Query } from 'api/queries/query';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { BasicToolbar } from 'routes/components/dataToolbar';
import type { ToolbarChipGroupExt } from 'routes/components/dataToolbar/utils/common';
import { ParentTagMapping } from 'routes/settings/tagLabels/tagMapping/components/parentTagMapping';
import type { Filter } from 'routes/utils/filter';

interface TagMappingToolbarOwnProps {
  canWrite?: boolean;
  isAllSelected?: boolean;
  isDisabled?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  onWizardClose();
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
  onFilterAdded,
  onFilterRemoved,
  onWizardClose,
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
    ];
    return options;
  };

  return (
    <BasicToolbar
      actions={<ParentTagMapping canWrite={canWrite} isDisabled={isDisabled} onClose={onWizardClose} />}
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
