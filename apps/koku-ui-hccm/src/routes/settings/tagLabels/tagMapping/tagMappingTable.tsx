import 'routes/components/dataTable/dataTable.scss';

import type { Settings } from 'api/settings';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { ExpandableTable } from 'routes/components/dataTable';
import { Actions } from 'routes/settings/tagLabels/tagMapping/components/actions';
import { DeleteTagMappingAction } from 'routes/settings/tagLabels/tagMapping/components/deleteTagMapping';

import { styles } from './tagMapping.styles';

interface TagMappingTableOwnProps {
  canWrite?: boolean;
  filterBy?: any;
  isDisabled?: boolean;
  isLoading?: boolean;
  onClose?: () => void;
  onSort(sortType: string, isSortAscending: boolean);
  orderBy?: any;
  settings: Settings;
}

type TagMappingTableProps = TagMappingTableOwnProps;

const TagMappingTable: React.FC<TagMappingTableProps> = ({
  canWrite,
  filterBy,
  isDisabled,
  isLoading,
  onClose,
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
            value: <Actions canWrite={canWrite} isDisabled={isDisabled} item={parent} onClose={onClose} />,
          },
        ],
        children: item.children?.map(child => {
          return {
            cells: [
              {}, // Empty cell for expand toggle
              {
                value: child.key ? child.key : '',
                style: styles.childTagKeyColumn,
              },
              {
                value: intl.formatMessage(messages.sourceTypes, { value: child?.source_type?.toLowerCase() }),
                style: styles.childSourceTypeColumn,
              },
              {
                value: (
                  <DeleteTagMappingAction canWrite={canWrite} isDisabled={isDisabled} item={child} onClose={onClose} />
                ),
                style: styles.childActionColumn,
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
      gridBreakPoint="grid-2xl"
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
