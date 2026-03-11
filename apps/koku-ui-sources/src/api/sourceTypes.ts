import type { SourceType } from 'typings/source';

export const SOURCE_TYPE_OCP: SourceType = {
  id: 'OCP',
  name: 'openshift',
  product_name: 'OpenShift Container Platform',
  category: 'Red Hat',
};

export const SOURCE_TYPE_AWS: SourceType = {
  id: 'AWS',
  name: 'amazon',
  product_name: 'Amazon Web Services',
  category: 'Cloud',
};

export const SOURCE_TYPE_AZURE: SourceType = {
  id: 'Azure',
  name: 'azure',
  product_name: 'Microsoft Azure',
  category: 'Cloud',
};

export const SOURCE_TYPE_GCP: SourceType = {
  id: 'GCP',
  name: 'google',
  product_name: 'Google Cloud Platform',
  category: 'Cloud',
};

export const SOURCE_TYPES = [SOURCE_TYPE_OCP, SOURCE_TYPE_AWS, SOURCE_TYPE_AZURE, SOURCE_TYPE_GCP] as const;

export const getSourceTypeById = (id: string): SourceType | undefined => SOURCE_TYPES.find(st => st.id === id);

export const getSourceTypeByName = (name: string): SourceType | undefined => SOURCE_TYPES.find(st => st.name === name);
