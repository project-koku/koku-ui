import messages from 'locales/messages';

export const getSourceType = (value: string) => {
  switch (value) {
    case 'Amazon Web Services':
      return 'AWS';
    case 'Google Cloud':
      return 'GCP';
    case 'Microsoft Azure':
      return 'Azure';
    case 'OpenShift Container Platform':
      return 'OCP';
    default:
      return undefined;
  }
};

export const validateDescription = (value: string) => {
  if (value.length > 500) {
    return messages.costModelsDescTooLong;
  }
  return null;
};

export const validateName = (value: string) => {
  if (value?.trim()?.length === 0) {
    return messages.requiredField;
  }
  if (value.length > 100) {
    return messages.costModelsNameTooLong;
  }
  return null;
};
