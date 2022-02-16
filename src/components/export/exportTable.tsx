import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Label,
  Popover,
  Spinner,
  Tooltip,
} from '@patternfly/react-core';
import { CalculatorIcon } from '@patternfly/react-icons/dist/esm/icons/calculator-icon';
import { DownloadIcon } from '@patternfly/react-icons/dist/esm/icons/download-icon';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { OutlinedClockIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-clock-icon';
import { SyncIcon } from '@patternfly/react-icons/dist/esm/icons/sync-icon';
import { TrashIcon } from '@patternfly/react-icons/dist/esm/icons/trash-icon';
import { sortable, SortByDirection, Table, TableBody, TableHeader } from '@patternfly/react-table';
import { getQuery, Query } from 'api/queries/query';
import { Report } from 'api/reports/report';
import { EmptyFilterState } from 'components/state/emptyFilterState/emptyFilterState';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

import { styles } from './exportTable.styles';

interface ExportTableOwnProps {
  isLoading?: boolean;
  onSort(value: string, isSortAscending: boolean);
  query: Query;
  report: Report;
}

interface ExportTableState {
  columns?: any[];
  loadingRows?: any[];
  rows?: any[];
}

type ExportTableProps = ExportTableOwnProps & WrappedComponentProps;

export const ExportTableColumnIds = {
  created: 'created',
  expires: 'expires',
  names: 'names',
  status: 'status',
};

class ExportTableBase extends React.Component<ExportTableProps> {
  public state: ExportTableState = {
    columns: [],
    rows: [],
  };

  constructor(props: ExportTableProps) {
    super(props);
    this.handleOnSort = this.handleOnSort.bind(this);
  }

  public componentDidMount() {
    this.initDatum();
  }

  public componentDidUpdate(prevProps: ExportTableProps) {
    const { query, report } = this.props;
    const currentReport = report && report.data ? JSON.stringify(report.data) : '';
    const previousReport = prevProps.report && prevProps.report.data ? JSON.stringify(prevProps.report.data) : '';

    if (getQuery(prevProps.query) !== getQuery(query) || previousReport !== currentReport) {
      this.initDatum();
    }
  }

  private initDatum = () => {
    const { query, report, intl } = this.props;
    if (!query || !report) {
      return;
    }

    const rows = [];
    const isSortable = report.data.length > 0;

    const columns = [
      {
        id: ExportTableColumnIds.names,
        orderBy: 'name',
        title: intl.formatMessage(messages.Names, { count: 1 }),
        ...(isSortable && { transforms: [sortable] }),
      },
      {
        id: ExportTableColumnIds.created,
        orderBy: 'created',
        title: intl.formatMessage(messages.TimeOfExport),
        ...(isSortable && { transforms: [sortable] }),
      },
      {
        id: ExportTableColumnIds.expires,
        orderBy: 'expires',
        title: intl.formatMessage(messages.ExpiresOn),
        ...(isSortable && { transforms: [sortable] }),
      },
      {
        id: ExportTableColumnIds.status,
        title: intl.formatMessage(messages.StatusActions),
      },
    ];

    if (report.data.length) {
      report.data.map((item: any) => {
        rows.push({
          cells: [
            { title: <div>{item.name}</div>, id: ExportTableColumnIds.names },
            { title: <div>{item.created}</div>, id: ExportTableColumnIds.created },
            { title: <div>{item.expires}</div>, id: ExportTableColumnIds.expires },
            { title: <div>{this.getStatus(item.status)}</div>, id: ExportTableColumnIds.status },
          ],
          item,
        });
      });
    }

    const loadingRows = [
      {
        heightAuto: true,
        cells: [
          {
            props: { colSpan: 7 },
            title: (
              <Bullseye>
                <div style={{ textAlign: 'center' }}>
                  <Spinner size="xl" />
                </div>
              </Bullseye>
            ),
          },
        ],
      },
    ];

    this.setState({
      columns,
      loadingRows,
      rows,
      sortBy: {},
    });
  };

  private getEmptyState = () => {
    const { query, intl } = this.props;

    if (query.filter_by) {
      for (const val of Object.values(query.filter_by)) {
        if (val !== '*') {
          return <EmptyFilterState filter={val as string} showMargin={false} />;
        }
      }
    }

    return (
      <EmptyState>
        <EmptyStateIcon icon={CalculatorIcon} />
        <EmptyStateBody>{intl.formatMessage(messages.DetailsEmptyState)}</EmptyStateBody>
      </EmptyState>
    );
  };

  private getSortBy = () => {
    const { query } = this.props;
    const { columns } = this.state;

    let index = -1;
    let direction: any = SortByDirection.asc;

    for (const key of Object.keys(query.order_by)) {
      let c = 0;
      for (const column of columns) {
        if (column.orderBy === key) {
          direction = query.order_by[key] === 'asc' ? SortByDirection.asc : SortByDirection.desc;
          index = c;
          break;
        }
        c++;
      }
    }
    return index > -1 ? { index, direction } : {};
  };

  private getStatus = (status: string) => {
    const { intl } = this.props;

    switch (status) {
      case 'completed':
        return (
          <>
            <Tooltip content={intl.formatMessage(messages.Download)}>
              <Button icon={<DownloadIcon />} onClick={this.handleDownload} variant="link" />
            </Tooltip>
            <Tooltip content={intl.formatMessage(messages.Delete)}>
              <Button icon={<TrashIcon />} onClick={this.handleDelete} variant="link" />
            </Tooltip>
          </>
        );
      case 'failed':
        return (
          <Label
            color="red"
            icon={<ExclamationCircleIcon />}
            variant="outline"
            render={({ className, content, componentRef }) => (
              <Popover
                aria-label={intl.formatMessage(messages.ExportAllExportsFailed)}
                className={className}
                headerContent={
                  <div style={styles.failed}>
                    <ExclamationCircleIcon />
                    <span style={styles.failedHeader}>{intl.formatMessage(messages.ExportAllExportsFailed)}</span>
                  </div>
                }
                bodyContent={<div>{intl.formatMessage(messages.ExportAllExportsFailedDesc)}</div>}
              >
                <Button variant="link" className={className} innerRef={componentRef} style={styles.failedButton}>
                  {content}
                </Button>
              </Popover>
            )}
          >
            {intl.formatMessage(messages.Status, { value: status })}
          </Label>
        );
        break;
      case 'running':
        return (
          <Label color={'blue'} icon={<SyncIcon />} variant="outline">
            {intl.formatMessage(messages.Status, { value: status })}
          </Label>
        );
      case 'pending':
      default:
        return (
          <Label color={'blue'} icon={<OutlinedClockIcon />} variant="outline">
            {intl.formatMessage(messages.Status, { value: status })}
          </Label>
        );
    }
  };

  private handleDelete = () => {
    // eslint-disable-next-line no-console
    console.log('handleDelete clicked');
  };

  private handleDownload = () => {
    // eslint-disable-next-line no-console
    console.log('handleOnDownload clicked');
  };

  private handleOnSort = (event, index, direction) => {
    const { onSort } = this.props;
    const { columns } = this.state;

    if (onSort) {
      const orderBy = columns[index - 1].orderBy;
      const isSortAscending = direction === SortByDirection.asc;
      onSort(orderBy, isSortAscending);
    }
  };

  public render() {
    const { intl, isLoading } = this.props;
    const { columns, loadingRows, rows } = this.state;

    return (
      <>
        <Table
          aria-label={intl.formatMessage(messages.ExportAllExportsTableAriaLabel)}
          cells={columns}
          rows={isLoading ? loadingRows : rows}
          sortBy={this.getSortBy()}
          onSort={this.handleOnSort}
        >
          <TableHeader />
          <TableBody />
        </Table>
        {Boolean(rows.length === 0) && <div style={styles.emptyState}>{this.getEmptyState()}</div>}
      </>
    );
  }
}

const ExportTable = injectIntl(ExportTableBase);

export { ExportTable, ExportTableProps };
