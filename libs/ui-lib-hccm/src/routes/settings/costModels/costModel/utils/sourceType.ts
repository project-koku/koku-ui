export const getSourceType = (sourceType: string) => {
  let result;
  switch (sourceType) {
    case 'Amazon Web Services':
      result = 'AWS';
      break;
    case 'Google Cloud':
      result = 'GCP';
      break;
    case 'Microsoft Azure':
      result = 'Azure';
      break;
    case 'OpenShift Container Platform':
      result = 'OCP';
      break;
  }
  return result;
};
