import {
  Bullseye,
  Button,
  ButtonVariant,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Label,
  Popover,
  Spinner,
  Title,
} from '@patternfly/react-core';
import { DownloadIcon } from '@patternfly/react-icons/dist/esm/icons/download-icon';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { OutlinedClockIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-clock-icon';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import { SyncIcon } from '@patternfly/react-icons/dist/esm/icons/sync-icon';
import { sortable, SortByDirection, Table, TableBody, TableHeader, TableVariant } from '@patternfly/react-table';
import { getQuery, Query } from 'api/queries/query';
import { Report } from 'api/reports/report';
import messages from 'locales/messages';
import { EmptyFilterState } from 'pages/components/state/emptyFilterState/emptyFilterState';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

import { ExportsActions } from './exportActions';
import { styles } from './exportsTable.styles';

interface ExportsTableOwnProps {
  isLoading?: boolean;
  onClose();
  onSort(value: string, isSortAscending: boolean);
  query: Query;
  report: Report;
}

interface ExportsTableState {
  columns?: any[];
  loadingRows?: any[];
  rows?: any[];
}

type ExportsTableProps = ExportsTableOwnProps & WrappedComponentProps;

export const ExportsTableColumnIds = {
  actions: 'actions',
  created: 'created',
  expires: 'expires',
  names: 'names',
  status: 'status',
};

class ExportsTableBase extends React.Component<ExportsTableProps> {
  public state: ExportsTableState = {
    columns: [],
    rows: [],
  };

  constructor(props: ExportsTableProps) {
    super(props);
    this.handleOnSort = this.handleOnSort.bind(this);
  }

  public componentDidMount() {
    this.initDatum();
  }

  public componentDidUpdate(prevProps: ExportsTableProps) {
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
        id: ExportsTableColumnIds.names,
        orderBy: 'name',
        title: intl.formatMessage(messages.Names, { count: 1 }),
        ...(isSortable && { transforms: [sortable] }),
      },
      {
        id: ExportsTableColumnIds.created,
        orderBy: 'created',
        title: intl.formatMessage(messages.TimeOfExport),
        ...(isSortable && { transforms: [sortable] }),
      },
      {
        id: ExportsTableColumnIds.expires,
        orderBy: 'expires',
        title: intl.formatMessage(messages.ExpiresOn),
        ...(isSortable && { transforms: [sortable] }),
      },
      {
        id: ExportsTableColumnIds.status,
        title: intl.formatMessage(messages.StatusActions),
      },
      {
        id: ExportsTableColumnIds.actions,
        title: '',
      },
    ];

    if (report.data.length) {
      report.data.map((item: any) => {
        rows.push({
          cells: [
            { title: <div>{item.name}</div>, id: ExportsTableColumnIds.names },
            { title: <div>{item.created}</div>, id: ExportsTableColumnIds.created },
            { title: <div>{item.expires}</div>, id: ExportsTableColumnIds.expires },
            { title: this.getStatus(item.status), id: ExportsTableColumnIds.status },
            { title: <ExportsActions onDelete={this.handleOnDelete} />, id: ExportsTableColumnIds.actions },
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
    const { onClose, query, intl } = this.props;

    // Todo: Need to refactor this as filter is not applied via a query here
    if (query.filter_by) {
      for (const val of Object.values(query.filter_by)) {
        if (val !== '*') {
          return <EmptyFilterState filter={val as string} showMargin={false} />;
        }
      }
    }

    return (
      <EmptyState>
        <EmptyStateIcon icon={PlusCircleIcon} />
        <Title headingLevel="h5" size="lg">
          {intl.formatMessage(messages.NoExportsStateTitle)}
        </Title>
        <EmptyStateBody>{intl.formatMessage(messages.ExportsEmptyState)}</EmptyStateBody>
        <Button variant="primary" onClick={onClose}>
          {intl.formatMessage(messages.Close)}
        </Button>
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
          <Button icon={<DownloadIcon />} isInline onClick={this.handleOnDownload} variant={ButtonVariant.link}>
            {intl.formatMessage(messages.Download)}
          </Button>
        );
      case 'failed':
        return (
          <Label
            color="red"
            icon={<ExclamationCircleIcon />}
            variant="outline"
            render={({ className, content, componentRef }) => (
              <Popover
                aria-label={intl.formatMessage(messages.ExportsFailed)}
                className={className}
                headerContent={
                  <div style={styles.failed}>
                    <ExclamationCircleIcon />
                    <span style={styles.failedHeader}>{intl.formatMessage(messages.ExportsFailed)}</span>
                  </div>
                }
                bodyContent={<div>{intl.formatMessage(messages.ExportsFailedDesc)}</div>}
              >
                <Button
                  className={className}
                  innerRef={componentRef}
                  style={styles.failedButton}
                  variant={ButtonVariant.plain}
                >
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

  private handleOnDelete = () => {
    // eslint-disable-next-line no-console
    console.log('handleDelete clicked');
  };

  private handleOnDownload = () => {
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
          aria-label={intl.formatMessage(messages.ExportsTableAriaLabel)}
          cells={columns}
          rows={isLoading ? loadingRows : rows}
          sortBy={this.getSortBy()}
          onSort={this.handleOnSort}
          variant={TableVariant.compact}
        >
          <TableHeader />
          <TableBody />
        </Table>
        {Boolean(rows.length === 0) && <div style={styles.emptyState}>{this.getEmptyState()}</div>}
      </>
    );
  }
}

const ExportsTable = injectIntl(ExportsTableBase);

export { ExportsTable, ExportsTableProps };
