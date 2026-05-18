/**
 * insights-rbac-frontend/.../TableViewSkeleton — upstream uses SkeletonTableHead/Body (ThBase loop).
 */
import React from 'react';

import { OnpremIamSpinner } from '@rbac-ui-onprem/shims/placeholders';

export interface TableViewSkeletonProps {
  columnLabels: string[];
  rowCount: number;
  hasSelection?: boolean;
  hasActions?: boolean;
  variant?: 'default' | 'compact';
  ariaLabel: string;
  ouiaId?: string;
}

export const TableViewSkeleton: React.FC<TableViewSkeletonProps> = () => (
  <OnpremIamSpinner minHeight={160} />
);
