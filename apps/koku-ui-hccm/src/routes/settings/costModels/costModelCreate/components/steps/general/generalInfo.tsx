import {
  Form,
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
import type { MessageDescriptor } from 'react-intl';
import { useIntl } from 'react-intl';
import { getCurrencyLabel, getCurrencyOptions } from 'routes/components/currency';
import { Selector } from 'routes/settings/components';

import { styles } from './generalInfo.styles';

interface GeneralInfoOwnProps {
  currency?: string;
  description?: string;
  descriptionError?: MessageDescriptor;
  name?: string;
  nameError?: MessageDescriptor;
  onCurrencyChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onSourceTypeChange: (value: string) => void;
  sourceType?: string;
}

type GeneralInfoProps = GeneralInfoOwnProps;

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

const GeneralInfo: React.FC<GeneralInfoProps> = ({
  currency,
  description,
  descriptionError,
  name,
  nameError,
  onCurrencyChange,
  onDescriptionChange,
  onNameChange,
  onSourceTypeChange,
  sourceType,
}: GeneralInfoProps) => {
  const intl = useIntl();

  // Getters

  const getValueLabel = (s: string, options) => {
    const option = options.find(o => o.value === s);
    return !option ? s || '' : intl.formatMessage(option.label, { units: option.value });
  };

  return (
    <Stack hasGutter>
      <StackItem>
        <Title headingLevel="h2" size={TitleSizes.xl} style={styles.titleWithLearnMore}>
          {intl.formatMessage(messages.costModelsWizardGeneralInfoTitle)}
        </Title>
        <a
          href={intl.formatMessage(sourceType === 'OCP' ? messages.docsCostModelsOcp : messages.docsCostModels)}
          rel="noreferrer"
          target="_blank"
        >
          {intl.formatMessage(messages.learnMore)}
        </a>
      </StackItem>
      <StackItem>
        <Form onSubmit={event => event.preventDefault()} style={styles.generalInformationForm}>
          <FormGroup label={intl.formatMessage(messages.names, { count: 1 })} isRequired fieldId="name">
            <TextInput
              id="name"
              isRequired
              name="name"
              onChange={(_evt, value) => onNameChange(value)}
              style={{ width: '100%' }}
              type="text"
              validated={nameError ? 'error' : 'default'}
              value={name}
            />
            {nameError && (
              <HelperText>
                <HelperTextItem variant="error">{intl.formatMessage(nameError)}</HelperTextItem>
              </HelperText>
            )}
          </FormGroup>
          <FormGroup label={intl.formatMessage(messages.description)} fieldId="description">
            <TextArea
              id="description"
              name="description"
              onChange={(_evt, value) => onDescriptionChange(value)}
              style={styles.textArea}
              type="text"
              validated={descriptionError ? 'error' : 'default'}
              value={description}
            />
            {descriptionError && (
              <HelperText>
                <HelperTextItem variant="error">{intl.formatMessage(descriptionError)}</HelperTextItem>
              </HelperText>
            )}
          </FormGroup>
          <Selector
            appendMenuTo="inline"
            direction="up"
            id="source-type"
            isRequired
            label={messages.sourceType}
            maxMenuHeight={styles.selector.maxHeight as string}
            placeholderText={intl.formatMessage(messages.costModelsWizardEmptySourceTypeLabel)}
            toggleAriaLabel={intl.formatMessage(messages.costModelsWizardEmptySourceTypeLabel)}
            onSelect={(_evt, value) => onSourceTypeChange(value)}
            options={sourceTypeOptions}
            value={getValueLabel(sourceType, sourceTypeOptions)}
          />
          <Selector
            label={messages.currency}
            direction="up"
            appendMenuTo="inline"
            maxMenuHeight={styles.selector.maxHeight as string}
            toggleAriaLabel={intl.formatMessage(messages.costModelsWizardCurrencyToggleLabel)}
            value={getCurrencyLabel(currency)}
            onSelect={(_evt, value) => onCurrencyChange(value)}
            id="currency"
            options={getCurrencyOptions()}
          />
        </Form>
      </StackItem>
    </Stack>
  );
};

export { GeneralInfo };
