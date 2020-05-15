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
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { CostModelContext } from './context';
import { styles } from './wizard.styles';

const GeneralInformation: React.SFC<WrappedComponentProps> = ({ intl }) => {
  const docLink =
    'https://access.redhat.com/documentation/en-us/openshift_container_platform/4.3/html/using_cost_models/configuring-cost-models';
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
              {intl.formatMessage({
                id: 'cost_models_wizard.general_info.title',
              })}
            </Title>
          </StackItem>
          <StackItem>
            <a href={docLink} target="blank">
              {intl.formatMessage({
                id: 'cost_models_wizard.general_info.learn_more',
              })}
            </a>
          </StackItem>
          <StackItem>
            <Form style={styles.form}>
              <FormGroup
                label={intl.formatMessage({
                  id: 'cost_models_wizard.general_info.name_label',
                })}
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
                label={intl.formatMessage({
                  id: 'cost_models_wizard.general_info.description_label',
                })}
                fieldId="description"
              >
                <TextArea
                  style={styles.textArea}
                  type="text"
                  id="description"
                  name="description"
                  value={description}
                  onChange={onDescChange}
                />
              </FormGroup>
              <FormGroup
                label={intl.formatMessage({
                  id: 'cost_models_wizard.general_info.source_type_label',
                })}
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
                    label={intl.formatMessage({
                      id:
                        'cost_models_wizard.general_info.source_type_empty_value_label',
                    })}
                  />
                  <FormSelectOption
                    value="AWS"
                    label={intl.formatMessage({
                      id: 'onboarding.type_options.aws',
                    })}
                  />
                  <FormSelectOption
                    value="AZURE"
                    label={intl.formatMessage({
                      id: 'onboarding.type_options.azure',
                    })}
                  />
                  <FormSelectOption
                    value="OCP"
                    label={intl.formatMessage({
                      id: 'onboarding.type_options.ocp',
                    })}
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

export default injectIntl(GeneralInformation);
