import {
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  TextInput,
} from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps } from 'react-i18next';

interface Props extends InjectedTranslateProps {
  name: string;
  updateName: (_name, event: React.FormEvent<HTMLInputElement>) => void;
  nameValid: boolean;
  type: string;
  updateType: (event: React.FormEvent<HTMLSelectElement>) => void;
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
    <Form>
      <FormGroup
        isValid={typeValid}
        fieldId="source_type"
        label={t('onboarding.type_label')}
      >
        <FormSelect
          isValid={typeValid}
          value={type}
          id="source_type"
          onChange={updateType}
        >
          <FormSelectOption
            label={t('onboarding.select_type_label')}
            value=""
          />
          <FormSelectOption
            isDisabled
            label="Amazon Web Services (AWS)"
            value="AWS"
          />
          <FormSelectOption label="Red Hat OpenShift (RH OCP)" value="OCP" />
        </FormSelect>
      </FormGroup>
      <FormGroup
        isValid={nameValid}
        helperTextInvalid={t('onboarding.name_helper_invalid_text')}
        helperText={t('onboarding.name_helper_text')}
        fieldId="source_name"
        label={t('onboarding.name_label')}
      >
        <TextInput
          isValid={nameValid}
          id="source_name"
          value={name}
          onChange={updateName}
        />
      </FormGroup>
    </Form>
  );
};

export default SourceKindForm;
