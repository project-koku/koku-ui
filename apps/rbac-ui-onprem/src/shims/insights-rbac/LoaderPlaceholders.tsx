/**
 * insights-rbac-frontend/shared/components/ui-states/LoaderPlaceholders
 * Upstream AppPlaceholder uses SkeletonTable → ThBase infinite re-render in host shell.
 */
import React from 'react';

import { OnpremIamSkeletonBox, OnpremIamSpinner } from '@rbac-ui-onprem/shims/placeholders';

export const AppPlaceholder: React.FC = () => <OnpremIamSpinner />;

export const ToolbarTitlePlaceholder: React.FC = () => <OnpremIamSkeletonBox width={200} height={21} />;

export const BreadcrumbPlaceholder: React.FC = () => <OnpremIamSkeletonBox width={200} height={18} />;

export const FormItemLoader: React.FC = () => <OnpremIamSkeletonBox width={160} height={32} />;

export const PolicyRolesLoader: React.FC = () => <OnpremIamSpinner minHeight={80} size="md" />;
