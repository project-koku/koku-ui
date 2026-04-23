import type { SourceType } from './models/sources';

export const SOURCE_TYPE_OCP: SourceType & { id: 'OCP' } = {
  id: 'OCP',
  name: 'openshift',
  product_name: 'OpenShift Container Platform',
  category: 'Red Hat',
} as const;

export const SOURCE_TYPES = [SOURCE_TYPE_OCP] as const;

export type SourceTypeId = (typeof SOURCE_TYPES)[number]['id'];

export const getSourceTypeById = (id: string): SourceType | undefined => SOURCE_TYPES.find(st => st.id === id);

export const getSourceTypeByName = (name: string): SourceType | undefined => SOURCE_TYPES.find(st => st.name === name);
