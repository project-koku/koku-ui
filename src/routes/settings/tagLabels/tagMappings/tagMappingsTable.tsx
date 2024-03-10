import 'routes/components/dataTable/dataTable.scss';

import type { Settings } from 'api/settings';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { ExpandableTable } from 'routes/components/dataTable';

import DeleteModal from './components/deleteModal/deleteModal';
import { styles } from './tagMappings.styles';

interface TagMappingsTableOwnProps {
  canWrite?: boolean;
  filterBy?: any;
  isDisabled?: boolean;
  isLoading?: boolean;
  onDelete();
  onSort(value: string, isSortAscending: boolean);
  orderBy?: any;
  settings: Settings;
}

type TagMappingsTableProps = TagMappingsTableOwnProps;

const TagMappingsTable: React.FC<TagMappingsTableProps> = ({
  canWrite,
  filterBy,
  isDisabled,
  isLoading,
  onDelete,
  onSort,
  orderBy,
  settings,
}) => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const intl = useIntl();

  const initDatum = () => {
    if (!settings) {
      return;
    }

    const newRows = [];
    const tagMappings = settings?.data ? (settings.data as any) : [];

    const newColumns = [
      {
        name: '',
      },
      {
        orderBy: 'parent',
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'tag_key' }),
        ...(tagMappings.length && { isSortable: true }),
      },
      {
        orderBy: 'source_type',
        name: intl.formatMessage(messages.sourceType),
        ...(tagMappings.length && { isSortable: true }),
      },
      {
        name: '',
      },
    ];

    tagMappings.map(item => {
      const parent = item.parent;
      newRows.push({
        cells: [
          {}, // Empty cell for expand toggle
          {
            value: parent.key ? parent.key : '',
          },
          {
            value: intl.formatMessage(messages.sourceTypes, { value: parent?.source_type?.toLowerCase() }),
          },
          {
            value: 'Test...',
          },
        ],
        children: parent.children.map(child => {
          return {
            cells: [
              {}, // Empty cell for expand toggle
              {
                value: child.key ? child.key : '',
                style: styles.expandableRowContent,
              },
              {
                value: intl.formatMessage(messages.sourceTypes, { value: child?.source_type?.toLowerCase() }),
                style: styles.expandableRowContent,
              },
              {
                value: <DeleteModal canWrite={canWrite} isDisabled={isDisabled} item={child} onDelete={onDelete} />,
              },
            ],
            item: child,
          };
        }),
        item: parent,
      });
    });

    const filteredColumns = (newColumns as any[]).filter(column => !column.hidden);
    const filteredRows = newRows.map(({ ...row }) => {
      row.cells = row.cells.filter(cell => !cell.hidden);
      return row;
    });

    setColumns(filteredColumns);
    setRows(filteredRows);
  };

  useEffect(() => {
    initDatum();
  }, [settings]);

  return (
    <ExpandableTable
      columns={columns}
      filterBy={filterBy}
      isActionsCell
      isAllExpanded={filterBy ? Object.keys(filterBy).find(key => key === 'child') : false}
      isLoading={isLoading}
      onSort={onSort}
      orderBy={orderBy}
      rows={rows}
    />
  );
};

export { TagMappingsTable };
