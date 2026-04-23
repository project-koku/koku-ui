import type { FormatMessage } from 'utilities/async-validate-name';

export function getReviewStep(formatMessage: FormatMessage) {
  return {
    name: 'review',
    title: formatMessage('sources.wizardReviewStepTitle'),
    fields: [
      {
        component: 'review-summary',
        name: 'review-summary',
      },
    ],
  };
}
