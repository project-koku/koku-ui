import '../../../../../components/dataTable/dataTable.scss';

import type { Settings } from '@koku-ui/api/settings';
import type { SettingsData } from '@koku-ui/api/settings';
import messages from '@koku-ui/i18n/locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { DataTable } from '../../../../../components/dataTable';

interface ParentTagsTableOwnProps {
  filterBy?: any;
  isLoading?: boolean;
  onSelect(items: SettingsData[], isSelected: boolean);
  onSort(sortType: string, isSortAscending: boolean);
  orderBy?: any;
  selectedItems?: SettingsData[];
  settings: Settings;
  unavailableItems?: SettingsData[];
}

type ParentTagsTableProps = ParentTagsTableOwnProps;

const ParentTagsTable: React.FC<ParentTagsTableProps> = ({
  filterBy,
  isLoading,
  onSelect,
  onSort,
  orderBy,
  selectedItems,
  settings,
  unavailableItems,
}) => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const intl = useIntl();

  const initDatum = () => {
    if (!settings) {
      return;
    }

    const newRows = [];
    const tags = settings?.data ? (settings.data as any) : [];

    const newColumns = [
      // Sorting with tag keys is not supported
      {
        name: '',
      },
      {
        orderBy: 'key',
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'tag_key' }),
        ...(tags.length && { isSortable: true }),
      },
      {
        orderBy: 'provider_type', // Todo: Rename as source_type?
        name: intl.formatMessage(messages.sourceType),
        ...(tags.length && { isSortable: true }),
      },
    ];

    tags.map(item => {
      newRows.push({
        cells: [
          {
            name: '',
          },
          {
            value: item.key ? item.key : '',
          },
          {
            value: intl.formatMessage(messages.sourceTypes, { value: item?.source_type?.toLowerCase() }),
          },
        ],
        item,
        selected: selectedItems?.find(val => val.uuid === item.uuid) !== undefined,
        selectionDisabled: unavailableItems?.find(val => val.uuid === item.uuid),
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
  }, [selectedItems, settings]);

  return (
    <DataTable
      columns={columns}
      filterBy={filterBy}
      isLoading={isLoading}
      isSelectable
      onSelect={onSelect}
      onSort={onSort}
      orderBy={orderBy}
      rows={rows}
      variant="radio"
    />
  );
};

export { ParentTagsTable };
