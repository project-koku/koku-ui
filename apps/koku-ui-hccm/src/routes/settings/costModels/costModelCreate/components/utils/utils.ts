import messages from 'locales/messages';
import { countDecimals, isPercentageFormatValid } from 'utils/format';

export const validateDescription = (value: string) => {
  if (value.length > 500) {
    return messages.costModelsDescTooLong;
  }
  return null;
};

export const validateMarkup = (value: string) => {
  if (!isPercentageFormatValid(value)) {
    return messages.markupOrDiscountNumber;
  }
  // Test number of decimals
  const decimals = countDecimals(value);
  if (decimals > 10) {
    return messages.markupOrDiscountTooLong;
  }
  return undefined;
};

export const validateName = (value: string) => {
  if (value?.trim()?.length === 0) {
    return messages.requiredField;
  }
  if (value.length > 100) {
    return messages.costModelsInfoTooLong;
  }
  return null;
};
