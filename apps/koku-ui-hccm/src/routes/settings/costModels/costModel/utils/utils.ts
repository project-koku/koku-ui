import { ProviderType } from 'api/providers';

export const getSourceType = (value: string) => {
  switch (value) {
    case 'Amazon Web Services':
    case 'AWS':
      return ProviderType.aws;
    case 'Google Cloud':
    case 'GCP':
      return ProviderType.gcp;
    case 'Microsoft Azure':
    case 'Azure':
      return ProviderType.azure;
    case 'OpenShift Container Platform':
    case 'OCP':
      return ProviderType.ocp;
    default:
      return undefined;
  }
};
