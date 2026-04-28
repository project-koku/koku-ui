import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import type { FormatMessage } from 'utilities/async-validate-name';

import { getOcpCredentialsStep } from './steps/credentials/ocp';
import { getReviewStep } from './steps/review';
import { getSourceNameStep } from './steps/source-name';

export const buildWizardSchema = (formatMessage: FormatMessage) => {
  const steps: any[] = [
    getSourceNameStep(formatMessage),
    getOcpCredentialsStep(formatMessage),
    getReviewStep(formatMessage),
  ];

  return {
    fields: [
      {
        component: componentTypes.WIZARD,
        name: 'add-source-wizard',
        fields: steps,
      },
    ],
  } as { fields: any[] };
};
