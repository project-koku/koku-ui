import type { AppMetadata } from '@scalprum/core';

type Scope = 'costManagement' | 'costManagementRos' | 'koku-ui-sources' | 'rbac-ui-onprem' | 'sources-ui-onprem';

interface AppMetadataWithModule extends AppMetadata {
  module?: string;
}

interface ScalprumConfig extends Record<Scope, AppMetadataWithModule> {}

export const costScope: Scope = 'costManagement';
export const rbacScope: Scope = 'rbac-ui-onprem';
export const sourcesScope: Scope = 'sources-ui-onprem';

export const scalprumConfig: ScalprumConfig = {
  costManagement: {
    name: 'costManagement',
    manifestLocation: '/costManagement/plugin-manifest.json',
    module: './RootApp',
  },
  costManagementRos: {
    name: 'costManagementRos',
    manifestLocation: '/costManagementRos/plugin-manifest.json',
  },
  'koku-ui-sources': {
    name: 'koku-ui-sources',
    manifestLocation: '/koku-ui-sources/plugin-manifest.json',
  },
  'rbac-ui-onprem': {
    name: 'rbac-ui-onprem',
    manifestLocation: '/rbac-ui-onprem/plugin-manifest.json',
    module: './Iam',
  },
  'sources-ui-onprem': {
    name: 'sources-ui-onprem',
    manifestLocation: '/sources-ui-onprem/plugin-manifest.json',
    module: './RootApp',
  },
};
