import { ProviderType } from 'api/providers';

export const getSourceType = (value: string) => {
  switch (value) {
    case 'Amazon Web Services':
      return ProviderType.aws;
    case 'Google Cloud':
      return ProviderType.gcp;
    case 'Microsoft Azure':
      return ProviderType.azure;
    case 'OpenShift Container Platform':
      return ProviderType.ocp;
    default:
      return undefined;
  }
};
