import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';

export const awsCredentialsStep = {
  name: 'credentials-AWS',
  title: 'AWS credentials',
  nextStep: 'review',
  fields: [
    {
      component: componentTypes.TEXT_FIELD,
      name: 'billing_source.bucket',
      label: 'S3 bucket name',
      helperText: 'Enter the name of the S3 bucket containing your AWS Cost and Usage Reports.',
      isRequired: true,
      validate: [{ type: validatorTypes.REQUIRED }],
    },
    {
      component: componentTypes.SELECT,
      name: 'billing_source.region',
      label: 'AWS region',
      isRequired: true,
      validate: [{ type: validatorTypes.REQUIRED }],
      options: [
        { value: 'us-east-1', label: 'US East (N. Virginia)' },
        { value: 'us-east-2', label: 'US East (Ohio)' },
        { value: 'us-west-1', label: 'US West (N. California)' },
        { value: 'us-west-2', label: 'US West (Oregon)' },
        { value: 'eu-west-1', label: 'EU (Ireland)' },
        { value: 'eu-central-1', label: 'EU (Frankfurt)' },
        { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
        { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' },
      ],
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'credentials.role_arn',
      label: 'IAM role ARN',
      helperText: 'Enter the ARN of the IAM role for Cost Management access.',
      isRequired: true,
      validate: [{ type: validatorTypes.REQUIRED }],
    },
  ],
};
