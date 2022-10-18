import {
  Button,
  Form,
  FormGroup,
  Popover,
  TextInput,
} from '@patternfly/react-core';
import { QuestionCircleIcon } from '@patternfly/react-icons';
import React from 'react';
import { InjectedTranslateProps, Interpolate } from 'react-i18next';
import { getTestProps, testIds } from 'testIds';

interface Props extends InjectedTranslateProps {
  value: string;
  onChange: (_name: any, event: React.FormEvent<HTMLInputElement>) => void;
  isValid: boolean;
}

const ClusterForm: React.SFC<Props> = ({ t, isValid, value, onChange }) => {
  return (
    <Form
      onSubmit={e => {
        e.preventDefault();
        return false;
      }}
    >
      <FormGroup
        isValid={isValid}
        fieldId="cluster_id"
        label={t('onboarding.usage_collector.cluster_id_label')}
      >
        <Popover
          aria-label={t(
            'onboarding.usage_collector.popover_clusterid_aria_label'
          )}
          position="bottom"
          bodyContent={
            <Interpolate
              i18nKey="onboarding.usage_collector.popover_clusterid_content"
              path={<b>~/.config/ocp_usage/config.json</b>}
            />
          }
        >
          <Button variant="plain">
            <QuestionCircleIcon />
          </Button>
        </Popover>
        <TextInput
          {...getTestProps(testIds.onboarding.clusterid_input)}
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
