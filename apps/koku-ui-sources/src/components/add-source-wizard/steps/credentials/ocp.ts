import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';

export const ocpCredentialsStep = {
  name: 'credentials-OCP',
  title: 'Install and configure operator',
  nextStep: 'review',
  fields: [
    {
      component: 'ocp-instructions',
      name: 'ocp-instructions-text',
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'credentials.cluster_id',
      label: 'Cluster Identifier',
      isRequired: true,
      validate: [{ type: validatorTypes.REQUIRED }],
    },
  ],
};
