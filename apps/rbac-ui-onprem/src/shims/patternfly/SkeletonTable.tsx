import { OnpremIamSpinner } from '@rbac-ui-onprem/shims/placeholders';
import React from 'react';

/** Replaces @patternfly/react-component-groups SkeletonTable (dynamic + esm imports). */
const SkeletonTable: React.FC<Record<string, unknown>> = () => <OnpremIamSpinner />;

export default SkeletonTable;
