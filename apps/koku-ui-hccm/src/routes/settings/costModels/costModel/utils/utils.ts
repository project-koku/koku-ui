import { ProviderType } from 'api/providers';

// Map API / cost-model source labels to ProviderType.
// Local koku backends use AWS-local / Azure-local / GCP-local — treat like aws / azure / gcp.
export const getSourceType = (value: string) => {
  switch (value) {
    case 'Amazon Web Services':
    case 'AWS':
    case 'AWS-local':
      return ProviderType.aws;
    case 'Google Cloud':
    case 'GCP':
    case 'GCP-local':
      return ProviderType.gcp;
    case 'Microsoft Azure':
    case 'Azure':
    case 'Azure-local':
      return ProviderType.azure;
    case 'OpenShift Container Platform':
    case 'OCP':
      return ProviderType.ocp;
    default:
      return undefined;
  }
};
