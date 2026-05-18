import { Bullseye, Spinner, type SpinnerProps } from '@patternfly/react-core';
import React from 'react';

/** Host-safe loading UI — avoids PF component-groups SkeletonTable (ThBase loop). */
export const OnpremIamSpinner: React.FC<{ minHeight?: number; size?: SpinnerProps['size'] }> = ({
  minHeight = 120,
  size = 'lg',
}) => (
  <Bullseye style={{ minHeight }}>
    <Spinner size={size} />
  </Bullseye>
);

/** Lightweight skeleton block for toolbars / breadcrumbs. */
export const OnpremIamSkeletonBox: React.FC<{ width: number; height: number }> = ({ width, height }) => (
  <div style={{ width, height }} aria-hidden />
);
