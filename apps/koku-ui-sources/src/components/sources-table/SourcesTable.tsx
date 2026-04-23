import { Button, Label } from '@patternfly/react-core';
import { ActionsColumn, Table, TableVariant, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import type { Source } from 'apis/models/sources';
import { getSourceTypeById } from 'apis/source-types';
import { messages } from 'i18n/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { formatRelativeDate } from 'utilities/relative-date';

interface SourcesTableProps {
  sources: Source[];
  onSelectSource: (source: Source) => void;
  onRemove: (source: Source) => void;
  onTogglePause: (source: Source) => void | Promise<void>;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  onSort: (sortBy: string, direction: 'asc' | 'desc') => void;
  canWrite?: boolean;
  /** When there are no rows, render this inside one full-width body cell (e.g. filtered empty). */
  emptyTableBody?: React.ReactNode;
}

const getStatusColor = (source: Source): 'green' | 'orange' | 'red' => {
  if (source.paused) {
    return 'orange';
  }
  return source.active ? 'green' : 'red';
};

// TODO(jkilzi): Sortable column headers are commented out because the Koku sources list API ignores the
// `ordering` query param (no OrderingFilter on SourcesViewSet), so UI sort state did not change row order.
// To restore: add server-side ordering support on Koku (`OrderingFilter` + `ordering_fields` on sources list),
// then uncomment `columnFields`, `activeSortIndex`, and the `sort={{...}}` props on the three `<Th>` cells
// below (Name, Type, Date added). Remove the `void sortBy` / `void sortDirection` / `void onSort` lines when
// those props are wired back into the `sort` handlers.

// const columnFields = ['name', 'source_type', 'created_timestamp'];

export const SourcesTable: React.FC<SourcesTableProps> = ({
  sources,
  onSelectSource,
  onRemove,
  onTogglePause,
  sortBy,
  sortDirection,
  onSort,
  canWrite = false,
  emptyTableBody,
}) => {
  const intl = useIntl();
  void sortBy;
  void sortDirection;
  void onSort;
  // const activeSortIndex = columnFields.indexOf(sortBy);

  const formatStatus = (source: Source): string => {
    if (source.paused) {
      return intl.formatMessage(messages.statusPaused);
    }
    return source.active
      ? intl.formatMessage(messages.statusAvailable)
      : intl.formatMessage(messages.statusUnavailable);
  };

  return (
    <Table aria-label={intl.formatMessage(messages.integrationsTableAria)} variant={TableVariant.compact}>
      <Thead>
        <Tr>
          <Th
          // sort={{
          //   sortBy: { index: activeSortIndex >= 0 ? activeSortIndex : 0, direction: sortDirection },
          //   onSort: (_event, index, direction) => onSort(columnFields[index], direction),
          //   columnIndex: 0,
          // }}
          >
            {intl.formatMessage(messages.name)}
          </Th>
          <Th
          // sort={{
          //   sortBy: { index: activeSortIndex >= 0 ? activeSortIndex : 0, direction: sortDirection },
          //   onSort: (_event, index, direction) => onSort(columnFields[index], direction),
          //   columnIndex: 1,
          // }}
          >
            {intl.formatMessage(messages.sourceType)}
          </Th>
          <Th
          // sort={{
          //   sortBy: { index: activeSortIndex >= 0 ? activeSortIndex : 0, direction: sortDirection },
          //   onSort: (_event, index, direction) => onSort(columnFields[index], direction),
          //   columnIndex: 2,
          // }}
          >
            {intl.formatMessage(messages.dateAdded)}
          </Th>
          <Th>{intl.formatMessage(messages.status)}</Th>
          <Th screenReaderText={intl.formatMessage(messages.actions)} />
        </Tr>
      </Thead>
      <Tbody>
        {sources.length === 0 && emptyTableBody ? (
          <Tr>
            <Td colSpan={5}>{emptyTableBody}</Td>
          </Tr>
        ) : (
          sources.map(source => {
            const sourceType = getSourceTypeById(source.source_type);
            return (
              <Tr key={source.uuid}>
                <Td dataLabel={intl.formatMessage(messages.name)}>
                  <Button variant="link" isInline onClick={() => onSelectSource(source)}>
                    {source.name}
                  </Button>
                </Td>
                <Td dataLabel={intl.formatMessage(messages.sourceType)}>
                  {sourceType?.product_name ?? source.source_type}
                </Td>
                <Td dataLabel={intl.formatMessage(messages.dateAdded)}>
                  {formatRelativeDate(source.created_timestamp)}
                </Td>
                <Td dataLabel={intl.formatMessage(messages.status)}>
                  <Label color={getStatusColor(source)}>{formatStatus(source)}</Label>
                </Td>
                <Td isActionCell onClick={e => e.stopPropagation()}>
                  <ActionsColumn
                    items={[
                      {
                        title: source.paused ? intl.formatMessage(messages.resume) : intl.formatMessage(messages.pause),
                        description: source.paused
                          ? intl.formatMessage(messages.resumeDescription)
                          : intl.formatMessage(messages.pauseDescription),
                        onClick: async () => {
                          await onTogglePause(source);
                        },
                        isDisabled: !canWrite,
                      },
                      {
                        title: intl.formatMessage(messages.remove),
                        description: intl.formatMessage(messages.removeDescription),
                        onClick: () => onRemove(source),
                        isDanger: true,
                        isDisabled: !canWrite,
                      },
                      {
                        title: intl.formatMessage(messages.viewDetails),
                        onClick: () => onSelectSource(source),
                      },
                    ]}
                  />
                </Td>
              </Tr>
            );
          })
        )}
      </Tbody>
    </Table>
  );
};

SourcesTable.displayName = 'SourcesTable';
