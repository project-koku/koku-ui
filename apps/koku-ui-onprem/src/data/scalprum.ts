import type { AppMetadata } from '@scalprum/core';

type Scope = 'costManagement' | 'costManagementRos' | 'sources' | 'insightsRbac';

interface AppMetadataWithModule extends AppMetadata {
  module?: string;
}

interface ScalprumConfig extends Record<Scope, AppMetadataWithModule> {}

export const costScope: Scope = 'costManagement';
export const rbacScope: Scope = 'insightsRbac';

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
  sources: {
    name: 'sources',
    manifestLocation: '/sources/plugin-manifest.json',
  },
  insightsRbac: {
    name: 'insightsRbac',
    manifestLocation: '/rbac/plugin-manifest.json',
    module: './Iam',
  },
};
