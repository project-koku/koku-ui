import 'routes/components/dataTable/dataTable.scss';

import type { Settings } from 'api/settings';
import type { SettingsData } from 'api/settings';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { DataTable } from 'routes/components/dataTable';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

interface ChildTagsTableOwnProps extends RouterComponentProps, WrappedComponentProps {
  filterBy?: any;
  isAllSelected?: boolean;
  isLoading?: boolean;
  onSelect(items: SettingsData[], isSelected: boolean);
  onSort(value: string, isSortAscending: boolean);
  orderBy?: any;
  selectedItems?: SettingsData[];
  settings: Settings;
}

interface ChildTagsTableState {
  columns?: any[];
  rows?: any[];
}

type ChildTagsTableProps = ChildTagsTableOwnProps;

class ChildTagsTableBase extends React.Component<ChildTagsTableProps, ChildTagsTableState> {
  public state: ChildTagsTableState = {
    columns: [],
    rows: [],
  };

  public componentDidMount() {
    this.initDatum();
  }

  public componentDidUpdate(prevProps: ChildTagsTableProps) {
    const { selectedItems, settings } = this.props;
    const currentReport = settings?.data ? JSON.stringify(settings.data) : '';
    const previousReport = prevProps?.settings.data ? JSON.stringify(prevProps.settings.data) : '';

    if (previousReport !== currentReport || prevProps.selectedItems !== selectedItems) {
      this.initDatum();
    }
  }

  private initDatum = () => {
    const { intl, selectedItems, settings } = this.props;
    if (!settings) {
      return;
    }

    const rows = [];
    const tags = settings?.data ? (settings.data as any) : [];

    const columns = [
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
        orderBy: 'source_type',
        name: intl.formatMessage(messages.sourceType),
        ...(tags.length && { isSortable: true }),
      },
    ];

    tags.map(item => {
      rows.push({
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
        selected: selectedItems && selectedItems.find(val => val.uuid === item.uuid) !== undefined,
      });
    });

    const filteredColumns = (columns as any[]).filter(column => !column.hidden);
    const filteredRows = rows.map(({ ...row }) => {
      row.cells = row.cells.filter(cell => !cell.hidden);
      return row;
    });

    this.setState({
      columns: filteredColumns,
      rows: filteredRows,
    });
  };

  public render() {
    const { filterBy, isLoading, onSelect, onSort, orderBy } = this.props;
    const { columns, rows } = this.state;

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
      />
    );
  }
}

const ChildTagsTable = injectIntl(withRouter(ChildTagsTableBase));

export { ChildTagsTable };
