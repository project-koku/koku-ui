import 'routes/components/dataTable/dataTable.scss';

import type { Settings } from 'api/settings';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { ExpandableTable } from 'routes/components/dataTable';
import { ActionsKebab } from 'routes/settings/tagLabels/tagMapping/components/actionsKebab';
import { DeleteAction } from 'routes/settings/tagLabels/tagMapping/components/deleteModal';

import { styles } from './tagMapping.styles';

interface TagMappingTableOwnProps {
  canWrite?: boolean;
  filterBy?: any;
  isDisabled?: boolean;
  isLoading?: boolean;
  onSort(value: string, isSortAscending: boolean);
  onUpdate();
  orderBy?: any;
  settings: Settings;
}

type TagMappingTableProps = TagMappingTableOwnProps;

const TagMappingTable: React.FC<TagMappingTableProps> = ({
  canWrite,
  filterBy,
  isDisabled,
  isLoading,
  onSort,
  onUpdate,
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
    const tagMapping = settings?.data ? (settings.data as any) : [];

    const newColumns = [
      {
        name: '',
      },
      {
        orderBy: 'parent',
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'tag_key' }),
        ...(tagMapping.length && { isSortable: true }),
      },
      {
        orderBy: 'source_type',
        name: intl.formatMessage(messages.sourceType),
        ...(tagMapping.length && { isSortable: true }),
      },
      {
        name: '',
      },
    ];

    tagMapping.map(item => {
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
            value: <ActionsKebab canWrite={canWrite} isDisabled={isDisabled} item={parent} onUpdate={onUpdate} />,
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
                value: <DeleteAction canWrite={canWrite} isDisabled={isDisabled} item={child} onUpdate={onUpdate} />,
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

export { TagMappingTable };
