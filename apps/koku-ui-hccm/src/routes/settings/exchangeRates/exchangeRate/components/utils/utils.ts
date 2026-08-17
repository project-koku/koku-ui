import type { SettingsData, SettingsRateData } from 'api/settings';
import { startOfMonth } from 'date-fns';
import messages from 'locales/messages';
import type { MessageDescriptor } from 'react-intl';
import { countDecimals, isCurrencyFormatValid, unFormat } from 'utils/format';

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

/** Parse a locale-formatted rate string to a number for API payloads (matches cost-models `unFormat` usage). */
export const parseRateValue = (value: string): number => Number(unFormat(value));

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

export const validateRate = (value: string): MessageDescriptor => {
  if (value.length === 0) {
    return messages.requiredField;
  }
  if (!isCurrencyFormatValid(value)) {
    return messages.priceListNumberRate;
  }
  // Normalize locale decimal/group separators before numeric checks (e.g. "0,25590" → "0.25590")
  if (Number(unFormat(value)) < 0) {
    return messages.priceListPosNumberRate;
  }
  // Test number of decimals
  const decimals = countDecimals(value);
  if (decimals > 10) {
    return messages.costModelsRateTooLong;
  }
  return undefined;
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
  if (date !== undefined && startOfMonth(date) < startOfMonth(getTodayDate())) {
    return messages.validityPeriodStartMonthPastError;
  }
  if (endDate !== undefined && date > endDate) {
    return messages.validityPeriodStartMonthError;
  }
  return null;
};

/** Inclusive date-range overlap: [startA, endA] overlaps [startB, endB]. */
export const datesOverlap = (startA: Date, endA: Date, startB: Date, endB: Date) => {
  return startA <= endB && startB <= endA;
};

/**
 * Finds another static rate for the same base/target pair whose validity period
 * overlaps the given range. Searches all settings entries' `static_rates` (rates
 * may be nested under either currency in the pair). Excludes the rate being
 * edited when `excludeUuid` is set.
 */
export const findOverlappingRate = (
  settings: SettingsData[] | undefined,
  baseCurrency: string | undefined,
  targetCurrency: string | undefined,
  startDate: Date | undefined,
  endDate: Date | undefined,
  excludeUuid?: string
): SettingsRateData | undefined => {
  if (!settings?.length || !baseCurrency || !targetCurrency || !startDate || !endDate || startDate > endDate) {
    return undefined;
  }

  // Rates may be nested under either currency's settings row — flatten and match the pair.
  const rates = settings.flatMap(item =>
    (item.static_rates ?? []).map(rate => ({
      ...rate,
      base_currency: rate.base_currency ?? item.code,
    }))
  );

  return rates.find(rate => {
    if (excludeUuid && rate.uuid === excludeUuid) {
      return false;
    }
    if (rate.base_currency !== baseCurrency || rate.target_currency !== targetCurrency) {
      return false;
    }

    const rateStart = getEffectiveStartDate(getEffectiveDate(rate.start_date));
    const rateEnd = rate.end_date ? getEffectiveEndDate(getEffectiveDate(rate.end_date)) : undefined;

    if (!rateStart) {
      return false;
    }

    // Open-ended existing rates are treated as overlapping any range that starts on/after their start.
    const effectiveRateEnd = rateEnd ?? new Date(8640000000000000);
    return datesOverlap(startDate, endDate, rateStart, effectiveRateEnd);
  });
};
