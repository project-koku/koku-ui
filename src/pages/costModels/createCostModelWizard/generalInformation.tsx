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
import { WithTranslation, withTranslation } from 'react-i18next';

import { CostModelContext } from './context';
import { descriptionErrors, nameErrors } from './steps';
import { styles } from './wizard.styles';

const GeneralInformation: React.SFC<WithTranslation> = ({ t }) => {
  return (
    <CostModelContext.Consumer>
      {({ name, dirtyName, description, type, onNameChange, onDescChange, onTypeChange }) => (
        <Stack hasGutter>
          <StackItem>
            <Title headingLevel="h2" size="xl">
              {t('cost_models_wizard.general_info.title')}
            </Title>
          </StackItem>
          <StackItem>
            <a href={t('docs.config_cost_models')} target="blank">
              {t('cost_models_wizard.general_info.learn_more')}
            </a>
          </StackItem>
          <StackItem>
            <Form style={styles.form}>
              <FormGroup
                helperTextInvalid={t(nameErrors(name))}
                validated={nameErrors(name) === null || !dirtyName ? 'default' : 'error'}
                label={t('cost_models_wizard.general_info.name_label')}
                isRequired
                fieldId="name"
              >
                <TextInput
                  validated={nameErrors(name) === null || !dirtyName ? 'default' : 'error'}
                  isRequired
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={onNameChange}
                />
              </FormGroup>
              <FormGroup
                helperTextInvalid={t(descriptionErrors(description))}
                validated={descriptionErrors(description) === null ? 'default' : 'error'}
                label={t('cost_models_wizard.general_info.description_label')}
                fieldId="description"
              >
                <TextArea
                  style={styles.textArea}
                  type="text"
                  id="description"
                  name="description"
                  value={description}
                  validated={descriptionErrors(description) === null ? 'default' : 'error'}
                  onChange={onDescChange}
                />
              </FormGroup>
              <FormGroup
                label={t('cost_models_wizard.general_info.source_type_label')}
                isRequired
                fieldId="source-type"
              >
                <FormSelect id="source-type" value={type} onChange={onTypeChange}>
                  <FormSelectOption
                    value=""
                    label={t('cost_models_wizard.general_info.source_type_empty_value_label')}
                  />
                  <FormSelectOption value="AWS" label={t('onboarding.type_options.aws')} />
                  <FormSelectOption value="AZURE" label={t('onboarding.type_options.azure')} />
                  <FormSelectOption value="OCP" label={t('onboarding.type_options.ocp')} />
                </FormSelect>
              </FormGroup>
            </Form>
          </StackItem>
        </Stack>
      )}
    </CostModelContext.Consumer>
  );
};

export default withTranslation()(GeneralInformation);
