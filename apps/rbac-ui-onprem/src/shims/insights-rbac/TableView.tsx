/**
 * insights-rbac-frontend/.../TableView — plain HTML table; avoids PF Th resize loops in host Page.
 */
import { EmptyState, EmptyStateBody } from '@patternfly/react-core';
import React from 'react';

import { OnpremIamSpinner } from '@rbac-ui-onprem/shims/placeholders';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TableView(props: any) {
  const {
    isLoading,
    error,
    data,
    ariaLabel,
    columns = [],
    columnConfig = {},
    cellRenderers = {},
    getRowId = (row: { permission?: string }) => row?.permission ?? '',
    emptyStateNoData,
    emptyStateError,
  } = props;

  if (isLoading) {
    return <OnpremIamSpinner minHeight={160} />;
  }

  if (error) {
    return (
      emptyStateError ?? (
        <EmptyState>
          <EmptyStateBody>Unable to load table data.</EmptyStateBody>
        </EmptyState>
      )
    );
  }

  if (!data?.length) {
    return (
      emptyStateNoData ?? (
        <EmptyState titleText="No data">
          <EmptyStateBody>No results found.</EmptyStateBody>
        </EmptyState>
      )
    );
  }

  return (
    <table aria-label={ariaLabel} className="pf-v6-c-table pf-m-grid-md">
      <thead>
        <tr>
          {columns.map((col: string) => (
            <th key={col}>{columnConfig[col]?.label ?? col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row: Record<string, unknown>) => (
          <tr key={String(getRowId(row))}>
            {columns.map((col: string) => (
              <td key={col}>{cellRenderers[col]?.(row) ?? String(row[col] ?? '')}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
