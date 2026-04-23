import {
  Card,
  CardBody,
  CardTitle,
  Content,
  ContentVariants,
  Form,
  FormGroup,
  TextInput,
} from '@patternfly/react-core';
import type { Source } from 'apis/models/sources';
import { messages } from 'i18n/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

function formatLabel(key: string): string {
  return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function getInitialFormValues(source: Source): Record<string, string> {
  const credentials = source?.authentication?.credentials || {};
  if (source.source_type !== 'OCP') {
    return {};
  }
  return { cluster_id: credentials.cluster_id || '' };
}

interface CredentialFormProps {
  source: Source;
  /** Reserved for future editable credentials; OpenShift fields are read-only. */
  onSave?: (credentials: Record<string, string>) => void;
}

export const CredentialForm: React.FC<CredentialFormProps> = ({ source }) => {
  const intl = useIntl();
  const sourceTypeName = source.source_type;
  const isOCP = sourceTypeName === 'OCP';

  const [formValues, setFormValues] = useState<Record<string, string>>(() => getInitialFormValues(source));

  useEffect(() => {
    setFormValues(getInitialFormValues(source));
  }, [source]);

  if (!isOCP) {
    return (
      <Card style={{ marginTop: '24px' }}>
        <CardTitle>{intl.formatMessage(messages.detailsSectionTitle)}</CardTitle>
        <CardBody>
          <Content component={ContentVariants.p}>
            {intl.formatMessage(messages.credentialsUnsupportedSourceType, { type: sourceTypeName })}
          </Content>
        </CardBody>
      </Card>
    );
  }

  const hasCredentials = Object.keys(formValues).length > 0;
  if (!hasCredentials) {
    return null;
  }

  return (
    <Card style={{ marginTop: '24px' }}>
      <CardTitle>{intl.formatMessage(messages.detailsSectionTitle)}</CardTitle>
      <CardBody>
        <Form>
          {Object.entries(formValues).map(([key, value]) => (
            <FormGroup key={key} label={formatLabel(key)} fieldId={`credential-${key}`}>
              <TextInput
                id={`credential-${key}`}
                value={value}
                type={key.includes('secret') || key.includes('json') ? 'password' : 'text'}
                isDisabled
              />
            </FormGroup>
          ))}
        </Form>
      </CardBody>
    </Card>
  );
};

CredentialForm.displayName = 'CredentialForm';
