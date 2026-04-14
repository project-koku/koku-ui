import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';

export const azureCredentialsStep = {
  name: 'credentials-Azure',
  title: 'Azure credentials',
  nextStep: 'review',
  fields: [
    {
      component: componentTypes.TEXT_FIELD,
      name: 'credentials.subscription_id',
      label: 'Subscription ID',
      isRequired: true,
      validate: [{ type: validatorTypes.REQUIRED }],
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'credentials.resource_group',
      label: 'Resource group',
      isRequired: true,
      validate: [{ type: validatorTypes.REQUIRED }],
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'credentials.storage_account',
      label: 'Storage account',
      isRequired: true,
      validate: [{ type: validatorTypes.REQUIRED }],
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'billing_source.export_scope',
      label: 'Export scope',
      helperText: 'The scope for the Azure cost export.',
    },
  ],
};
