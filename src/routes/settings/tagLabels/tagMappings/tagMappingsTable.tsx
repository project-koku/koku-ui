import 'routes/components/dataTable/dataTable.scss';

import { Button, ButtonVariant, Tooltip } from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/minus-circle-icon';
import type { Settings } from 'api/settings';
import type { SettingsData } from 'api/settings';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { ExpandableTable } from 'routes/components/dataTable';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { styles } from './tagMappings.styles';

interface TagMappingsTableOwnProps extends RouterComponentProps, WrappedComponentProps {
  canWrite?: boolean;
  filterBy?: any;
  isAllSelected?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  onDeleteChild(item: SettingsData);
  onSort(value: string, isSortAscending: boolean);
  orderBy?: any;
  settings: Settings;
}

interface TagMappingsTableState {
  columns?: any[];
  rows?: any[];
}

type TagMappingsTableProps = TagMappingsTableOwnProps;

class TagMappingsTableBase extends React.Component<TagMappingsTableProps, TagMappingsTableState> {
  public state: TagMappingsTableState = {
    columns: [],
    rows: [],
  };

  public componentDidMount() {
    this.initDatum();
  }

  public componentDidUpdate(prevProps: TagMappingsTableProps) {
    const { settings } = this.props;
    const currentReport = settings?.data ? JSON.stringify(settings.data) : '';
    const previousReport = prevProps?.settings.data ? JSON.stringify(prevProps.settings.data) : '';

    if (previousReport !== currentReport) {
      this.initDatum();
    }
  }

  private initDatum = () => {
    const { intl, settings } = this.props;
    if (!settings) {
      return;
    }

    const rows = [];
    const tags = settings?.data ? (settings.data as any) : [];

    const columns = [
      {
        name: '',
      },
      {
        orderBy: 'parent',
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'tag_key' }),
        ...(tags.length && { isSortable: true }),
      },
      {
        orderBy: 'source_type',
        name: intl.formatMessage(messages.sourceType),
        ...(tags.length && { isSortable: true }),
      },
      {
        name: '',
      },
    ];

    tags.map(item => {
      const parent = item.parent;
      rows.push({
        cells: [
          {}, // Empty cell for expand toggle
          {
            value: parent.key ? parent.key : '',
          },
          {
            value: intl.formatMessage(messages.sourceTypes, { value: parent?.source_type?.toLowerCase() }),
          },
          {
            value: 'Test...',
          },
        ],
        children: parent.children.map(child => {
          return {
            cells: [
              {}, // Empty cell for expand toggle
              {
                value: child.key ? child.key : '',
                style: styles.expandableRowContent,
              },
              {
                value: intl.formatMessage(messages.sourceTypes, { value: child?.source_type?.toLowerCase() }),
                style: styles.expandableRowContent,
              },
              {
                value: this.getChildActions(child),
              },
            ],
            item: child,
          };
        }),
        item: parent,
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

  private getChildActions = (item: SettingsData) => {
    const { canWrite, intl, isDisabled, onDeleteChild } = this.props;

    const getTooltip = children => {
      if (!canWrite) {
        const disableTagsTooltip = intl.formatMessage(messages.readOnlyPermissions);
        return <Tooltip content={disableTagsTooltip}>{children}</Tooltip>;
      }
      return children;
    };

    return getTooltip(
      <Button
        aria-label={intl.formatMessage(messages.delete)}
        isAriaDisabled={!canWrite || isDisabled}
        onClick={() => onDeleteChild(item)}
        size="sm"
        variant={ButtonVariant.plain}
      >
        <MinusCircleIcon />
      </Button>
    );
  };

  public render() {
    const { filterBy, isLoading, onSort, orderBy } = this.props;
    const { columns, rows } = this.state;

    const isAllExpanded = filterBy ? Object.keys(filterBy).find(key => key === 'child') : false;

    return (
      <ExpandableTable
        columns={columns}
        filterBy={filterBy}
        isActionsCell
        isAllExpanded={isAllExpanded}
        isLoading={isLoading}
        onSort={onSort}
        orderBy={orderBy}
        rows={rows}
      />
    );
  }
}

const TagMappingsTable = injectIntl(withRouter(TagMappingsTableBase));

export { TagMappingsTable };
