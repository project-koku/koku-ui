import { ActionGroup, Button, Card, CardBody, CardTitle, Form, FormGroup, TextInput } from '@patternfly/react-core';
import messages from 'locales/messages';
import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import type { Source } from 'typings/source';

function formatLabel(key: string): string {
  return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function getInitialFormValues(source: Source): Record<string, string> {
  const credentials = source?.authentication?.credentials || {};
  const dataSource = source?.billing_source?.data_source || {};
  const sourceTypeName = source.source_type;

  if (sourceTypeName === 'OCP') {
    return { cluster_id: credentials.cluster_id || '' };
  }
  if (sourceTypeName === 'AWS') {
    return {
      role_arn: credentials.role_arn || '',
      s3_bucket: dataSource.bucket || '',
    };
  }
  if (sourceTypeName === 'Azure') {
    return {
      subscription_id: credentials.subscription_id || '',
      tenant_id: credentials.tenant_id || '',
      client_id: credentials.client_id || '',
      client_secret: credentials.client_secret || '',
      resource_group: dataSource.resource_group || '',
      storage_account: dataSource.storage_account || '',
    };
  }
  if (sourceTypeName === 'GCP') {
    return {
      project_id: credentials.project_id || '',
      dataset: dataSource.dataset || '',
      table_id: dataSource.table_id || '',
    };
  }
  return {};
}

interface CredentialFormProps {
  source: Source;
  onSave?: (credentials: Record<string, string>) => void;
}

const CredentialForm: React.FC<CredentialFormProps> = ({ source, onSave }) => {
  const intl = useIntl();
  const sourceTypeName = source.source_type;
  const isOCP = sourceTypeName === 'OCP';

  const [formValues, setFormValues] = useState<Record<string, string>>(() => getInitialFormValues(source));
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const initial = getInitialFormValues(source);
    setFormValues(initial);
    setIsDirty(false);
  }, [source]);

  const handleChange = useCallback((key: string, value: string) => {
    setFormValues(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  }, []);

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(formValues);
    }
    setIsDirty(false);
  }, [formValues, onSave]);

  const handleReset = useCallback(() => {
    setFormValues(getInitialFormValues(source));
    setIsDirty(false);
  }, [source]);

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
                onChange={(_event, val) => handleChange(key, val)}
                isDisabled={isOCP}
              />
            </FormGroup>
          ))}
          {!isOCP && (
            <ActionGroup>
              <Button variant="primary" onClick={handleSave} isDisabled={!isDirty}>
                Save
              </Button>
              <Button variant="link" onClick={handleReset} isDisabled={!isDirty}>
                Reset
              </Button>
            </ActionGroup>
          )}
        </Form>
      </CardBody>
    </Card>
  );
};

export { CredentialForm };
