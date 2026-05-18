import path from 'path';

const shimsDir = path.resolve(__dirname);

/** Absolute paths for webpack aliases and NormalModuleReplacementPlugin targets. */
export const rbacUiOnpremShims = {
  loaderPlaceholders: path.join(shimsDir, 'insights-rbac/LoaderPlaceholders.tsx'),
  useAppLink: path.join(shimsDir, 'insights-rbac/useAppLink.ts'),
  patternflyComponentGroups: path.join(shimsDir, 'patternfly/component-groups.ts'),
  patternflySkeletonTable: path.join(shimsDir, 'patternfly/SkeletonTable.tsx'),
  patternflySkeletonTableHead: path.join(shimsDir, 'patternfly/SkeletonTableHead.tsx'),
  patternflySkeletonTableBody: path.join(shimsDir, 'patternfly/SkeletonTableBody.tsx'),
} as const;

/** Upstream module paths → on-prem shim (insights-rbac-frontend). */
export const insightsRbacModuleReplacements: ReadonlyArray<{ match: RegExp; replacement: string }> = [
  {
    match: /[/\\]insights-rbac-frontend[/\\]src[/\\]shared[/\\]components[/\\]ui-states[/\\]LoaderPlaceholders\.tsx$/,
    replacement: rbacUiOnpremShims.loaderPlaceholders,
  },
  {
    match: /[/\\]insights-rbac-frontend[/\\]src[/\\]shared[/\\]hooks[/\\]useAppLink\.ts$/,
    replacement: rbacUiOnpremShims.useAppLink,
  },
];
