import {
  FormGroup,
  FormSelect,
  FormSelectOption,
  Stack,
  StackItem,
  TextArea,
  TextInput,
  Title,
} from '@patternfly/react-core';
import { Form } from 'components/forms/form';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { CostModelContext } from './context';

const GeneralInformation: React.SFC<InjectedTranslateProps> = ({ t }) => {
  return (
    <CostModelContext.Consumer>
      {({
        name,
        description,
        type,
        onNameChange,
        onDescChange,
        onTypeChange,
      }) => (
        <Stack gutter="md">
          <StackItem>
            <Title size="xl">
              {t('cost_models_wizard.general_info.title')}
            </Title>
          </StackItem>
          <StackItem>
            <Form style={{ width: '350px' }}>
              <FormGroup
                label={t('cost_models_wizard.general_info.name_label')}
                isRequired
                fieldId="name"
              >
                <TextInput
                  isRequired
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={onNameChange}
                />
              </FormGroup>
              <FormGroup
                label={t('cost_models_wizard.general_info.description_label')}
                fieldId="description"
              >
                <TextArea
                  type="text"
                  id="description"
                  name="description"
                  value={description}
                  onChange={onDescChange}
                />
              </FormGroup>
              <FormGroup
                label={t('cost_models_wizard.general_info.source_type_label')}
                isRequired
                fieldId="source-type"
              >
                <FormSelect
                  id="source-type"
                  value={type}
                  onChange={onTypeChange}
                >
                  <FormSelectOption
                    value=""
                    label={t(
                      'cost_models_wizard.general_info.source_type_empty_value_label'
                    )}
                  />
                  <FormSelectOption
                    value="AWS"
                    label={t('onboarding.type_options.aws')}
                  />
                  <FormSelectOption
                    value="OCP"
                    label={t('onboarding.type_options.ocp')}
                  />
                </FormSelect>
              </FormGroup>
            </Form>
          </StackItem>
        </Stack>
      )}
    </CostModelContext.Consumer>
  );
};

export default translate()(GeneralInformation);
