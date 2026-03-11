import componentTypes from '@data-driven-forms/react-form-renderer/component-types';

import { awsCredentialsStep } from './steps/credentials/aws';
import { azureCredentialsStep } from './steps/credentials/azure';
import { gcpCredentialsStep } from './steps/credentials/gcp';
import { ocpCredentialsStep } from './steps/credentials/ocp';
import { reviewStep } from './steps/review';
import { selectTypeStep } from './steps/selectType';
import { sourceNameStep } from './steps/sourceName';

export const buildWizardSchema = (preselectedType?: string) => {
  const steps: any[] = [];

  if (!preselectedType) {
    steps.push(selectTypeStep);
  }

  steps.push(sourceNameStep);
  steps.push(ocpCredentialsStep);
  steps.push(awsCredentialsStep);
  steps.push(azureCredentialsStep);
  steps.push(gcpCredentialsStep);
  steps.push(reviewStep);

  return {
    fields: [
      {
        component: componentTypes.WIZARD,
        name: 'add-source-wizard',
        crossroads: ['source_type'],
        fields: steps,
      },
    ],
  } as { fields: any[] };
};
