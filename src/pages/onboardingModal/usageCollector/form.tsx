import { Form, FormGroup, TextInput } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps } from 'react-i18next';

interface Props extends InjectedTranslateProps {
  value: string;
  onChange: (_name: any, event: React.FormEvent<HTMLInputElement>) => void;
  isValid: boolean;
}

const ClusterForm: React.SFC<Props> = ({ t, isValid, value, onChange }) => {
  return (
    <Form>
      <FormGroup
        isValid={isValid}
        fieldId="cluster_id"
        label={t('onboarding.korekuta.cluster_id_label')}
      >
        <TextInput
          isValid={isValid}
          id="cluster_id"
          value={value}
          onChange={onChange}
        />
      </FormGroup>
    </Form>
  );
};

export default ClusterForm;
