import { intl } from '@koku-ui/i18n/i18n';

export const formatDate = (date: string) => {
  if (!date) {
    return null;
  }
  return intl.formatDate(date, {
    day: 'numeric',
    hour: 'numeric',
    hour12: false,
    minute: 'numeric',
    month: 'short',
    timeZone: 'UTC',
    timeZoneName: 'short',
    year: 'numeric',
  });
};
