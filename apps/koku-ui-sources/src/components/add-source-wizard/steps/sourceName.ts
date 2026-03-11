import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import { nameValidator } from 'utilities/asyncValidateName';
import resolvePropsValidated from 'utilities/resolvePropsValidated';

import NameDescription from './NameDescription';

export const sourceNameStep = {
  name: 'source-name',
  title: 'Source name',
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
      placeholder: 'Enter a name for this source',
      isRequired: true,
      validate: [{ type: validatorTypes.REQUIRED }, nameValidator],
      resolveProps: resolvePropsValidated,
    },
  ],
};
