import { startOfMonth } from 'date-fns';
import messages from 'locales/messages';

const getTodayDate = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export const getEffectiveDate = (date: string) => {
  const newDate = date ? new Date(date + 'T00:00:00') : getTodayDate();
  if (newDate && !isNaN(newDate.getTime())) {
    return newDate;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

// effective_end_date must be on the last day of the month.
export const getEffectiveEndDate = (date: Date) => {
  if (!date) {
    return getTodayDate();
  }
  const newDate = new Date(date);
  const lastDayOfMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
  newDate.setDate(lastDayOfMonth.getDate());
  return newDate;
};

// effective_start_date must be on the first day of the month
export const getEffectiveStartDate = (date: Date) => {
  if (!date) {
    return undefined;
  }
  return startOfMonth(new Date(date));
};

export const validateDescription = (value: string) => {
  if (value.length > 500) {
    return messages.costModelsDescTooLong;
  }
  return null;
};

export const validateEndDate = (date: Date, startDate?: Date) => {
  if (startDate !== undefined && date < startDate) {
    return messages.validityPeriodEndMonthError;
  }
  return null;
};

export const validateName = (value: string) => {
  if (value?.trim()?.length === 0) {
    return messages.requiredField;
  }
  if (value.length > 50) {
    return messages.priceListNameTooLong;
  }
  return null;
};

export const validateStartDate = (date: Date, endDate?: Date) => {
  if (endDate !== undefined && date > endDate) {
    return messages.validityPeriodStartMonthError;
  }
  return null;
};
