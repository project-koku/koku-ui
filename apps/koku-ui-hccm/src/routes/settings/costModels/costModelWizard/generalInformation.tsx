import {
  FormGroup,
  HelperText,
  HelperTextItem,
  Stack,
  StackItem,
  TextArea,
  TextInput,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { currencyOptions } from 'routes/components/currency';
import { Form } from 'routes/settings/costModels/components/forms/form';
import { Selector } from 'routes/settings/costModels/components/inputs/selector';
import { createMapStateToProps } from 'store/common';
import { getCurrencySymbol } from 'utils/format';

import { CostModelContext } from './context';
import { descriptionErrors, nameErrors } from './steps';
import { styles } from './wizard.styles';

interface GeneralInformationOwnProps {
  // TBD...
}

interface GeneralInformationStateProps {
  // TBD..
}

interface GeneralInformationDispatchProps {
  // TBD...
}

type GeneralInformationProps = GeneralInformationOwnProps &
  GeneralInformationStateProps &
  GeneralInformationDispatchProps &
  WrappedComponentProps;

class GeneralInformation extends React.Component<GeneralInformationProps, any> {
  public render() {
    const { intl } = this.props;
    const getValueLabel = (valStr: string, options) => {
      const val = options.find(o => o.value === valStr);
      return !val ? valStr : intl.formatMessage(val.label, { units: val.value });
    };
    const getCurrencyLabel = (valStr: string, options) => {
      const val = options.find(o => o.value === valStr);
      return !val
        ? valStr
        : intl.formatMessage(messages.currencyOptions, {
            [val.value]: getCurrencySymbol(val.value),
            units: val.value,
          });
    };
    const sourceTypeOptions = [
      {
        label: messages.awsAlt,
        value: 'AWS',
      },
      {
        label: messages.azure,
        value: 'Azure',
      },
      {
        label: messages.gcp,
        value: 'GCP',
      },
      {
        label: messages.costModelsWizardOnboardOcp,
        value: 'OCP',
      },
    ];

    return (
      <CostModelContext.Consumer>
        {({
          currencyUnits,
          dirtyName,
          description,
          name,
          type,
          onCurrencyChange,
          onNameChange,
          onDescChange,
          onTypeChange,
        }) => (
          <Stack hasGutter>
            <StackItem>
              <Title headingLevel="h2" size={TitleSizes.xl} style={styles.titleWithLearnMore}>
                {intl.formatMessage(messages.costModelsWizardGeneralInfoTitle)}
              </Title>
              <a
                href={intl.formatMessage(type === 'OCP' ? messages.docsCostModelsOcp : messages.docsCostModels)}
                rel="noreferrer"
                target="_blank"
              >
                {intl.formatMessage(messages.learnMore)}
              </a>
            </StackItem>
            <StackItem>
              <Form style={styles.form}>
                <FormGroup label={intl.formatMessage(messages.names, { count: 1 })} isRequired fieldId="name">
                  <TextInput
                    validated={nameErrors(name) === null || !dirtyName ? 'default' : 'error'}
                    isRequired
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(_evt, value) => onNameChange(value)}
                  />
                  {dirtyName && nameErrors(name) && (
                    <HelperText>
                      <HelperTextItem variant="error">{intl.formatMessage(nameErrors(name))}</HelperTextItem>
                    </HelperText>
                  )}
                </FormGroup>
                <FormGroup label={intl.formatMessage(messages.description)} fieldId="description">
                  <TextArea
                    style={styles.textArea}
                    type="text"
                    id="description"
                    name="description"
                    value={description}
                    validated={descriptionErrors(description) === null ? 'default' : 'error'}
                    onChange={(_evt, value) => onDescChange(value)}
                  />
                  {descriptionErrors(description) && (
                    <HelperText>
                      <HelperTextItem variant="error">
                        {intl.formatMessage(descriptionErrors(description))}
                      </HelperTextItem>
                    </HelperText>
                  )}
                </FormGroup>
                <Selector
                  isRequired
                  id="source-type-selector"
                  direction="up"
                  appendMenuTo="inline"
                  maxMenuHeight={styles.selector.maxHeight as string}
                  label={messages.sourceType}
                  toggleAriaLabel={intl.formatMessage(messages.costModelsWizardEmptySourceTypeLabel)}
                  placeholderText={intl.formatMessage(messages.costModelsWizardEmptySourceTypeLabel)}
                  value={getValueLabel(type, sourceTypeOptions)}
                  onSelect={(_evt, value) => onTypeChange(value)}
                  options={sourceTypeOptions}
                />
                <Selector
                  label={messages.currency}
                  direction="up"
                  appendMenuTo="inline"
                  maxMenuHeight={styles.selector.maxHeight as string}
                  toggleAriaLabel={intl.formatMessage(messages.costModelsWizardCurrencyToggleLabel)}
                  value={getCurrencyLabel(currencyUnits, currencyOptions)}
                  onSelect={(_evt, value) => onCurrencyChange(value)}
                  id="currency-units-selector"
                  options={currencyOptions.map(option => ({
                    label: intl.formatMessage(messages.currencyOptions, {
                      [option.value]: getCurrencySymbol(option.value),
                      units: option.value,
                    }),
                    value: option.value,
                  }))}
                />
              </Form>
            </StackItem>
          </Stack>
        )}
      </CostModelContext.Consumer>
    );
  }
}

const mapStateToProps = createMapStateToProps<GeneralInformationOwnProps, GeneralInformationStateProps>(() => {
  return {
    // TBD...
  };
});

const mapDispatchToProps: GeneralInformationDispatchProps = {
  // TDB
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(GeneralInformation));
