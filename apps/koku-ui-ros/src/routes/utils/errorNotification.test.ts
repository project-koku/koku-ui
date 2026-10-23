import { AlertVariant } from '@patternfly/react-core';

import { getApiErrorDetail, getErrorNotification } from './errorNotification';

describe('errorNotification', () => {
  test('returns API detail when parseApiError finds a message', () => {
    const err = { response: { data: { errors: [{ detail: 'already mapped' }] } } } as any;
    expect(getApiErrorDetail(err)).toBe('already mapped');
  });

  test('returns undefined for unknown errors', () => {
    expect(getApiErrorDetail({} as any)).toBeUndefined();
  });

  test('returns nested field validation errors', () => {
    const err = {
      response: {
        data: {
          order_by: {
            cost_total_distributed: ['"descxxx" is not a valid choice.'],
          },
        },
      },
    } as any;
    expect(getApiErrorDetail(err)).toBe('order_by.cost_total_distributed: "descxxx" is not a valid choice.');
  });

  test('builds a danger notification with optional detail', () => {
    const err = { response: { data: { errors: [{ detail: 'limit reached' }] } } } as any;
    expect(getErrorNotification(err, 'Could not update', 'Try again')).toEqual({
      description: 'Try again',
      detail: 'limit reached',
      dismissable: true,
      title: 'Could not update',
      variant: AlertVariant.danger,
    });
  });
});
