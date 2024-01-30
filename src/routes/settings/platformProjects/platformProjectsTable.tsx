import 'routes/components/dataTable/dataTable.scss';

import { Label } from '@patternfly/react-core';
import type { Settings, SettingsData } from 'api/settings';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { Cluster } from 'routes/components/cluster';
import { DataTable } from 'routes/components/dataTable';
// import { styles } from 'routes/components/dataTable/dataTable.styles';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { styles } from './platformProjects.styles';

interface CostCategoryOwnProps extends RouterComponentProps, WrappedComponentProps {
  canWrite?: boolean;
  filterBy?: any;
  isLoading?: boolean;
  onSelect(items: SettingsData[], isSelected: boolean);
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
    const computedItems = settings?.data ? (settings.data as any) : [];

    const columns = [
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
      rows.push({
        cells: [
          {}, // Empty cell for row selection
          {
            value: item.project ? item.project : '',
            style: styles.nameColumn,
          },
          {
            value: item.default ? <Label color="green">{intl.formatMessage(messages.default)}</Label> : null,
          },
          {
            value:
              item.group === 'Platform' ? <Label color="green">{intl.formatMessage(messages.platform)}</Label> : null,
            style: styles.defaultColumn,
          },
          { value: <Cluster clusters={item.clusters} groupBy="clusters" />, style: styles.groupColumn },
        ],
        item,
        selected: selectedItems && selectedItems.find(val => val.project === item.project) !== undefined,
        selectionDisabled: !canWrite || item.default,
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
    const { filterBy, isLoading, onSelect, onSort, orderBy, selectedItems } = this.props;
    const { columns, rows } = this.state;

    return (
      <DataTable
        columns={columns}
        filterBy={filterBy}
        isLoading={isLoading}
        onSelect={onSelect}
        onSort={onSort}
        orderBy={orderBy}
        rows={rows}
        selectedItems={selectedItems}
      />
    );
  }
}

const PlatformProjectsTable = injectIntl(withRouter(CostCategoryBase));

export { PlatformProjectsTable };
