import messages from 'locales/messages';

export const validateDescription = (value: string) => {
  if (value.length > 500) {
    return messages.costModelsDescTooLong;
  }
  return null;
};

export const validateEndDate = (date: Date, startDate: Date) => {
  if (date < startDate) {
    return messages.validityPeriodEndMonthError;
  }
  return null;
};

export const validateName = (value: string) => {
  if (value?.trim()?.length === 0) {
    return messages.requiredField;
  }
  if (value.length > 500) {
    return messages.costModelsDescTooLong;
  }
  return null;
};

export const validateStartDate = (date: Date, endDate: Date) => {
  if (date > endDate) {
    return messages.validityPeriodStartMonthError;
  }
  return null;
};
