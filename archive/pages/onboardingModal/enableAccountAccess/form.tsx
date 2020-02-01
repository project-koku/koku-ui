import { Form, FormGroup, TextInput } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps } from 'react-i18next';
import { getTestProps, testIds } from 'testIds';

interface Props extends InjectedTranslateProps {
  value: string;
  onChange: (_name: any, event: React.FormEvent<HTMLInputElement>) => void;
  isValid: boolean;
}

const ArnForm: React.SFC<Props> = ({ t, isValid, value, onChange }) => {
  return (
    <Form
      onSubmit={e => {
        e.preventDefault();
        return false;
      }}
    >
      <FormGroup
        isValid={isValid}
        fieldId="arn"
        label={t('onboarding.enable_account_access.arn_label')}
        helperText={t('onboarding.enable_account_access.arn_helper_text')}
        helperTextInvalid={t(
          'onboarding.enable_account_access.arn_helper_text_invalid'
        )}
      >
        <TextInput
          {...getTestProps(testIds.onboarding.arn_input)}
          isValid={isValid}
          id="arn"
          value={value}
          onChange={onChange}
        />
      </FormGroup>
    </Form>
  );
};

export default ArnForm;
