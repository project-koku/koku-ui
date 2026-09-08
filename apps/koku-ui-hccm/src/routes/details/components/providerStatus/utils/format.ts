import { intl } from 'components/i18n';

export const formatDate = (date: string) => {
  if (!date) {
    return null;
  }
  return intl.formatDate(date, {
    day: 'numeric',
    hour: 'numeric',
    hourCycle: 'h23',
    minute: 'numeric',
    month: 'short',
    timeZone: 'UTC',
    timeZoneName: 'short',
    year: 'numeric',
  });
};
