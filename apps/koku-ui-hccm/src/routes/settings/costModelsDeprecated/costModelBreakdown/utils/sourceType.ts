// Map cost-model display labels to API source_type strings used by deprecated wizards.
// Local koku backends use AWS-local / Azure-local / GCP-local — treat like AWS / Azure / GCP.
export const getSourceType = (sourceType: string) => {
  switch (sourceType) {
    case 'Amazon Web Services':
    case 'AWS':
    case 'AWS-local':
      return 'AWS';
    case 'Google Cloud':
    case 'GCP':
    case 'GCP-local':
      return 'GCP';
    case 'Microsoft Azure':
    case 'Azure':
    case 'Azure-local':
      return 'Azure';
    case 'OpenShift Container Platform':
    case 'OCP':
      return 'OCP';
    default:
      return undefined;
  }
};
