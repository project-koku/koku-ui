import type { Query } from '@koku-ui/api/queries/query';
import { getQuery } from '@koku-ui/api/queries/query';
import type { Report } from '@koku-ui/api/reports/report';
import messages from '@koku-ui/i18n/locales/messages';
import {
  Button,
  ButtonVariant,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  Label,
  Popover,
} from '@patternfly/react-core';
import { DownloadIcon } from '@patternfly/react-icons/dist/esm/icons/download-icon';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { OutlinedClockIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-clock-icon';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import { SyncIcon } from '@patternfly/react-icons/dist/esm/icons/sync-icon';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import { DataTable } from '../../../routes/components/dataTable';
import type { DropdownWrapperItem } from '../../../routes/components/dropdownWrapper';
import { DropdownWrapper } from '../../../routes/components/dropdownWrapper';
import { EmptyFilterState } from '../../../routes/components/state/emptyFilterState';
import { styles } from './exportsTable.styles';

interface ExportsTableOwnProps {
  isLoading?: boolean;
  onClose();
  onSort(sortType: string, isSortAscending: boolean);
  query: Query;
  report: Report;
}

interface ExportsTableState {
  columns?: any[];
  rows?: any[];
}

type ExportsTableProps = ExportsTableOwnProps & WrappedComponentProps;

class ExportsTableBase extends React.Component<ExportsTableProps, ExportsTableState> {
  public state: ExportsTableState = {
    columns: [],
    rows: [],
  };

  public componentDidMount() {
    this.initDatum();
  }

  public componentDidUpdate(prevProps: ExportsTableProps) {
    const { query, report } = this.props;
    const currentReport = report?.data ? JSON.stringify(report.data) : '';
    const previousReport = prevProps?.report?.data ? JSON.stringify(prevProps.report.data) : '';

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
        name: intl.formatMessage(messages.names, { count: 1 }),
        orderBy: 'name',
        isSortable,
      },
      {
        name: intl.formatMessage(messages.timeOfExport),
        orderBy: 'created',
        isSortable,
      },
      {
        name: intl.formatMessage(messages.expiresOn),
        orderBy: 'expires',
        isSortable,
      },
      {
        name: intl.formatMessage(messages.statusActions),
      },
      {
        name: '',
      },
    ];

    if (report.data.length) {
      report.data.map((item: any) => {
        rows.push({
          cells: [
            { value: item.name },
            { value: item.created },
            { value: item.expires },
            { value: this.getStatus(item.status) },
            { value: this.getActions() },
          ],
          item,
        });
      });
    }
    this.setState({
      columns,
      rows,
    });
  };

  private getActions = () => {
    const { intl } = this.props;

    const items: DropdownWrapperItem[] = [
      {
        onClick: this.handleOnDelete,
        toString: () => intl.formatMessage(messages.delete),
      },
    ];
    return <DropdownWrapper isKebab items={items} position="right" />;
  };

  private getEmptyState = () => {
    const { onClose, query, intl } = this.props;

    if (query.filter_by) {
      for (const val of Object.values(query.filter_by)) {
        if (val !== '*') {
          return <EmptyFilterState filter={val as string} showMargin={false} />;
        }
      }
    }

    return (
      <EmptyState
        headingLevel="h5"
        icon={PlusCircleIcon}
        titleText={<>{intl.formatMessage(messages.noExportsStateTitle)}</>}
      >
        <EmptyStateBody>{intl.formatMessage(messages.exportsEmptyState)}</EmptyStateBody>
        <EmptyStateFooter>
          <Button variant="primary" onClick={onClose}>
            {intl.formatMessage(messages.close)}
          </Button>
        </EmptyStateFooter>
      </EmptyState>
    );
  };

  private getStatus = (status: string) => {
    const { intl } = this.props;

    switch (status) {
      case 'completed':
        return (
          <Button icon={<DownloadIcon />} isInline onClick={this.handleOnDownload} variant={ButtonVariant.link}>
            {intl.formatMessage(messages.download)}
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
                aria-label={intl.formatMessage(messages.exportsFailed)}
                className={className}
                headerContent={
                  <div style={styles.failed}>
                    <ExclamationCircleIcon />
                    <span style={styles.failedHeader}>{intl.formatMessage(messages.exportsFailed)}</span>
                  </div>
                }
                bodyContent={<div>{intl.formatMessage(messages.exportsFailedDesc)}</div>}
              >
                <Button
                  icon={content}
                  className={className}
                  innerRef={componentRef}
                  style={styles.failedButton}
                  variant={ButtonVariant.plain}
                ></Button>
              </Popover>
            )}
          >
            {intl.formatMessage(messages.statusStates, { value: status })}
          </Label>
        );
        break;
      case 'running':
        return (
          <Label color={'blue'} icon={<SyncIcon />} variant="outline">
            {intl.formatMessage(messages.statusStates, { value: status })}
          </Label>
        );
      case 'pending':
      default:
        return (
          <Label color={'blue'} icon={<OutlinedClockIcon />} variant="outline">
            {intl.formatMessage(messages.statusStates, { value: status })}
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

  public render() {
    const { intl, isLoading, onSort, query } = this.props;
    const { columns, rows } = this.state;

    return (
      <DataTable
        ariaLabel={intl.formatMessage(messages.exportsTableAriaLabel)}
        columns={columns}
        emptyState={this.getEmptyState()}
        isLoading={isLoading}
        onSort={onSort}
        rows={rows}
        orderBy={query.order_by}
      />
    );
  }
}

const ExportsTable = injectIntl(ExportsTableBase);

export { ExportsTable };
export type { ExportsTableProps };
