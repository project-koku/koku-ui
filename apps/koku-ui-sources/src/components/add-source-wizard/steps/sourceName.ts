import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import type { FormatMessage } from 'utilities/asyncValidateName';
import { createNameValidator } from 'utilities/asyncValidateName';
import resolvePropsValidated from 'utilities/resolvePropsValidated';

import NameDescription from './NameDescription';

export function getSourceNameStep(formatMessage: FormatMessage) {
  return {
    name: 'source-name',
    title: formatMessage('sources.wizardIntegrationNameStepTitle'),
    nextStep: ({ values }: any) => `credentials-${values.source_type}`,
    fields: [
      {
        component: 'description',
        name: 'source-name-description',
        Content: NameDescription,
      },
      {
        component: componentTypes.TEXT_FIELD,
        name: 'source_name',
        label: 'Name',
        placeholder: formatMessage('sources.wizardNamePlaceholder'),
        isRequired: true,
        validate: [{ type: validatorTypes.REQUIRED }, createNameValidator(formatMessage)],
        resolveProps: resolvePropsValidated,
      },
    ],
  };
}
