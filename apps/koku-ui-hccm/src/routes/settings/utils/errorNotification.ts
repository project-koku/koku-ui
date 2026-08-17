import { AlertVariant } from '@patternfly/react-core';
import type { AxiosError } from 'axios';

import { parseApiError } from './parseError';

export const getApiErrorDetail = (err: AxiosError): string | undefined => {
  const apiDetail = parseApiError(err);
  return apiDetail && apiDetail !== 'unknown' ? apiDetail : undefined;
};

/** Keeps the i18n title/description and attaches API error text as `detail` for expandable toasts. */
export const getErrorNotification = (err: AxiosError, title: string, description: string) => ({
  description,
  detail: getApiErrorDetail(err),
  dismissable: true,
  title,
  variant: AlertVariant.danger,
});
