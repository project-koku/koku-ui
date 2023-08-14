import 'routes/components/dataTable/dataTable.scss';

import { Label } from '@patternfly/react-core';
import type { Settings, SettingsData } from 'api/settings';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { DataTable } from 'routes/components/dataTable';
import { styles } from 'routes/components/dataTable/dataTable.styles';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

interface CostCategoryOwnProps extends RouterComponentProps, WrappedComponentProps {
  canWrite?: boolean;
  filterBy?: any;
  isLoading?: boolean;
  onSelected(items: SettingsData[], isSelected: boolean);
  onSort(value: string, isSortAscending: boolean);
  orderBy?: any;
  selectedItems?: SettingsData[];
  settings: Settings;
}

interface CostCategoryState {
  columns?: any[];
  rows?: any[];
}

type CostCategoryProps = CostCategoryOwnProps;

class CostCategoryBase extends React.Component<CostCategoryProps, CostCategoryState> {
  public state: CostCategoryState = {
    columns: [],
    rows: [],
  };

  public componentDidMount() {
    this.initDatum();
  }

  public componentDidUpdate(prevProps: CostCategoryProps) {
    const { selectedItems, settings } = this.props;
    const currentReport = settings?.data ? JSON.stringify(settings.data) : '';
    const previousReport = prevProps?.settings.data ? JSON.stringify(prevProps.settings.data) : '';

    if (previousReport !== currentReport || prevProps.selectedItems !== selectedItems) {
      this.initDatum();
    }
  }

  private initDatum = () => {
    const { canWrite, intl, selectedItems, settings } = this.props;
    if (!settings) {
      return;
    }

    const rows = [];
    const categories = settings?.data ? (settings.data as any) : [];

    const columns = [
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
        style: styles.lastItemColumn,
      },
    ];

    categories.map(item => {
      rows.push({
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
            style: styles.lastItem,
          },
        ],
        item,
        selected: selectedItems && selectedItems.find(val => val.uuid === item.uuid) !== undefined,
        selectionDisabled: !canWrite,
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
    const { filterBy, isLoading, onSelected, onSort, orderBy, selectedItems } = this.props;
    const { columns, rows } = this.state;

    return (
      <DataTable
        columns={columns}
        filterBy={filterBy}
        isLoading={isLoading}
        onSelected={onSelected}
        onSort={onSort}
        orderBy={orderBy}
        rows={rows}
        selectedItems={selectedItems}
      />
    );
  }
}

const CostCategoryTable = injectIntl(withRouter(CostCategoryBase));

export { CostCategoryTable };
