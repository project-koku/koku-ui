import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';

export const gcpCredentialsStep = {
  name: 'credentials-GCP',
  title: 'GCP credentials',
  nextStep: 'review',
  fields: [
    {
      component: componentTypes.TEXT_FIELD,
      name: 'credentials.project_id',
      label: 'Project ID',
      isRequired: true,
      validate: [{ type: validatorTypes.REQUIRED }],
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'billing_source.dataset',
      label: 'BigQuery dataset name',
      helperText: 'The name of the BigQuery dataset containing your billing export.',
      isRequired: true,
      validate: [{ type: validatorTypes.REQUIRED }],
    },
    {
      component: componentTypes.TEXTAREA,
      name: 'credentials.service_account_json',
      label: 'Service account JSON',
      helperText: 'Paste the contents of your GCP service account key JSON file.',
      isRequired: true,
      validate: [{ type: validatorTypes.REQUIRED }],
    },
  ],
};
