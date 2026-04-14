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

/**
 * Types offered in the Integrations tab empty state, add wizard type step, and toolbar type filter.
 * On-prem Cost Management is OCP-only; extend this list when cloud integrations return (see 0007 R5).
 */
export const SOURCE_TYPES_INTEGRATIONS_UI = [SOURCE_TYPE_OCP] as const;

export const getSourceTypeById = (id: string): SourceType | undefined => SOURCE_TYPES.find(st => st.id === id);

export const getSourceTypeByName = (name: string): SourceType | undefined => SOURCE_TYPES.find(st => st.name === name);

/**
 * Resolves user input (display name, product name, or id) to the backend source type id (OCP, AWS, Azure, GCP).
 * Used to normalize filter input so the API receives the value it expects (source_type__icontains).
 */
export const getSourceTypeByDisplayName = (input: string): SourceType | undefined => {
  if (!input?.trim()) {
    return undefined;
  }
  const lower = input.trim().toLowerCase();
  return SOURCE_TYPES.find(
    st => st.id.toLowerCase() === lower || st.name.toLowerCase() === lower || st.product_name.toLowerCase() === lower
  );
};
