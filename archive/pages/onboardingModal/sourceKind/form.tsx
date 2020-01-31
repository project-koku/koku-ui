import {
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  TextInput,
} from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps } from 'react-i18next';
import { getTestProps, testIds } from 'testIds';

interface Props extends InjectedTranslateProps {
  name: string;
  updateName: (_name, event: React.FormEvent<HTMLInputElement>) => void;
  nameValid: boolean;
  type: string;
  updateType: (
    value: string,
    event: React.FormEvent<HTMLSelectElement>
  ) => void;
  typeValid: boolean;
}

const SourceKindForm: React.SFC<Props> = ({
  t,
  name,
  updateName,
  nameValid,
  type,
  updateType,
  typeValid,
}) => {
  return (
    <Form
      onSubmit={e => {
        e.preventDefault();
        return false;
      }}
    >
      <FormGroup
        isValid={nameValid}
        helperTextInvalid={t('onboarding.name_helper_invalid_text')}
        helperText={t('onboarding.name_helper_text')}
        fieldId="source_name"
        label={t('onboarding.name_label')}
      >
        <TextInput
          {...getTestProps(testIds.onboarding.name_input)}
          isValid={nameValid}
          id="source_name"
          value={name}
          onChange={updateName}
        />
      </FormGroup>
      <FormGroup
        isValid={typeValid}
        fieldId="source_type"
        label={t('onboarding.type_label')}
      >
        <FormSelect
          {...getTestProps(testIds.onboarding.type_selector)}
          isValid={typeValid}
          value={type}
          id="source_type"
          onChange={updateType}
        >
          <FormSelectOption
            {...getTestProps(testIds.onboarding.type_opt_non)}
            label={t('onboarding.select_type_label')}
            value=""
          />
          <FormSelectOption
            {...getTestProps(testIds.onboarding.type_opt_aws)}
            label={t('onboarding.type_options.aws')}
            value="AWS"
          />
          <FormSelectOption
            {...getTestProps(testIds.onboarding.type_opt_aws)}
            label={t('onboarding.type_options.azure')}
            value="AZURE"
          />
          <FormSelectOption
            {...getTestProps(testIds.onboarding.type_opt_ocp)}
            label={t('onboarding.type_options.ocp')}
            value="OCP"
          />
        </FormSelect>
      </FormGroup>
    </Form>
  );
};

export default SourceKindForm;
