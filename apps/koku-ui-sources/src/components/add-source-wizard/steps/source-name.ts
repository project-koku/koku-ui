import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import type { FormatMessage } from 'utilities/async-validate-name';
import { createNameValidator } from 'utilities/async-validate-name';
import { resolvePropsValidated } from 'utilities/resolve-props-validated';

import { NameDescription } from './NameDescription';

export function getSourceNameStep(formatMessage: FormatMessage) {
  return {
    name: 'source-name',
    title: formatMessage('sources.wizardIntegrationNameStepTitle'),
    nextStep: 'credentials-OCP',
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
