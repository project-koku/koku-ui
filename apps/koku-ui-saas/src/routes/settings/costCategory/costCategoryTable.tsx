import 'routes/components/dataTable/dataTable.scss';

import { Label } from '@patternfly/react-core';
import type { Settings, SettingsData } from 'api/settings';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { DataTable } from 'routes/components/dataTable';

interface CostCategoryTableOwnProps {
  canWrite?: boolean;
  filterBy?: any;
  isLoading?: boolean;
  onSelect(items: SettingsData[], isSelected: boolean);
  onSort(sortType: string, isSortAscending: boolean);
  orderBy?: any;
  selectedItems?: SettingsData[];
  settings: Settings;
}

type CostCategoryTableProps = CostCategoryTableOwnProps;

const CostCategoryTable: React.FC<CostCategoryTableProps> = ({
  canWrite,
  filterBy,
  isLoading,
  onSelect,
  onSort,
  orderBy,
  selectedItems,
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
    const categories = settings?.data ? (settings.data as any) : [];

    const newColumns = [
      {
        name: '', // Selection column
      },
      {
        orderBy: 'key',
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'name' }),
        ...(categories.length && { isSortable: true }),
      },
      {
        orderBy: 'enabled',
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'status' }),
        ...(categories.length && { isSortable: true }),
      },
    ];

    categories.map(item => {
      newRows.push({
        cells: [
          {}, // Empty cell for row selection
          {
            value: item.key ? item.key : '',
          },
          {
            value: item.enabled ? (
              <Label color="green">{intl.formatMessage(messages.enabled)}</Label>
            ) : (
              <Label>{intl.formatMessage(messages.disabled)}</Label>
            ),
          },
        ],
        item,
        selected: selectedItems && selectedItems.find(val => val.uuid === item.uuid) !== undefined,
        selectionDisabled: !canWrite,
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
      selectedItems={selectedItems}
    />
  );
};

export { CostCategoryTable };
