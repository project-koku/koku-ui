import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import type { FormatMessage } from 'utilities/async-validate-name';

export function getOcpCredentialsStep(formatMessage: FormatMessage) {
  return {
    name: 'credentials-OCP',
    title: formatMessage('sources.wizardOcpCredentialsStepTitle'),
    nextStep: 'review',
    fields: [
      {
        component: 'ocp-instructions',
        name: 'ocp-instructions-text',
      },
      {
        component: componentTypes.TEXT_FIELD,
        name: 'credentials.cluster_id',
        label: formatMessage('sources.wizardClusterIdentifierLabel'),
        isRequired: true,
        validate: [{ type: validatorTypes.REQUIRED }],
      },
    ],
  };
}
