import '../../components/dataTable/dataTable.scss';
import './platformProjects.scss';

import type { Settings, SettingsData } from '@koku-ui/api/settings';
import messages from '@koku-ui/i18n/locales/messages';
import { Label } from '@patternfly/react-core';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { Cluster } from '../../components/cluster';
import { DataTable } from '../../components/dataTable';

interface PlatformProjectsTableOwnProps {
  canWrite?: boolean;
  filterBy?: any;
  isLoading?: boolean;
  onSelect(items: SettingsData[], isSelected: boolean);
  onSort(sortType: string, isSortAscending: boolean);
  orderBy?: any;
  selectedItems?: SettingsData[];
  settings: Settings;
}

type PlatformProjectsTableProps = PlatformProjectsTableOwnProps;

const PlatformProjectsTable: React.FC<PlatformProjectsTableProps> = ({
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
    const computedItems = settings?.data ? (settings.data as any) : [];

    const newColumns = [
      {
        name: '', // Selection column
      },
      {
        orderBy: 'project', // Todo: update filter name
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'name' }),
        ...(computedItems.length && { isSortable: true }),
      },
      {
        name: '', // Default column
      },
      {
        orderBy: 'group',
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'group' }),
        ...(computedItems.length && { isSortable: true }),
      },
      {
        orderBy: 'cluster',
        name: intl.formatMessage(messages.clusters),
        ...(computedItems.length && { isSortable: false }), // No sort for cluster
      },
    ];

    computedItems.map(item => {
      newRows.push({
        cells: [
          {}, // Empty cell for row selection
          {
            value: item.project ? item.project : '',
          },
          {
            className: 'defaultColumn',
            value: item.default ? <Label color="green">{intl.formatMessage(messages.default)}</Label> : null,
          },
          {
            className: 'groupColumn',
            value:
              item.group === 'Platform' ? <Label color="green">{intl.formatMessage(messages.platform)}</Label> : null,
          },
          { value: <Cluster clusters={item.clusters} groupBy="clusters" /> },
        ],
        item,
        selected: selectedItems && selectedItems.find(val => val.project === item.project) !== undefined,
        selectionDisabled: !canWrite || item.default,
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

export { PlatformProjectsTable };
