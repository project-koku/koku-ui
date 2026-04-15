import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import { Alert, Button, Form, Modal, ModalBody, ModalFooter, ModalHeader } from '@patternfly/react-core';
import { ApplicationsService } from 'apis/applications-service';
import type { CreateSourcePayload } from 'apis/models/sources';
import { SourcesService } from 'apis/sources-service';
import { componentMapper } from 'components/add-source-wizard/pf6-ddf-mapper/ddf-component-mapper';
import { messages } from 'i18n/messages';
import React, { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import { buildWizardSchema } from './schema-builder';

interface AddSourceWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

const FormTemplate: React.FC<any> = ({ formFields }) => {
  return <Form onSubmit={e => e.preventDefault()}>{formFields}</Form>;
};

FormTemplate.displayName = 'FormTemplate';

export const AddSourceWizard: React.FC<AddSourceWizardProps> = ({ isOpen, onClose, onSubmitSuccess }) => {
  const intl = useIntl();
  const modalTitle = useMemo(() => intl.formatMessage(messages.wizardTitleOcp), [intl]);
  const formatMessage = useCallback((id: string) => intl.formatMessage({ id }), [intl]);
  const [error, setError] = useState<string | null>(null);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

  const handleCancel = useCallback(() => {
    setIsCancelConfirmOpen(true);
  }, []);

  const handleConfirmCancel = useCallback(() => {
    setIsCancelConfirmOpen(false);
    onClose();
  }, [onClose]);

  const handleDismissCancel = useCallback(() => {
    setIsCancelConfirmOpen(false);
  }, []);

  const handleSubmit = useCallback(
    async (values: Record<string, any>) => {
      setError(null);

      let createdSource: any = null;

      try {
        const sourcePayload: CreateSourcePayload = {
          name: values.source_name,
          source_type: 'OCP',
        };

        if (values.credentials && typeof values.credentials === 'object') {
          const creds = values.credentials as Record<string, string>;
          if (Object.keys(creds).length > 0) {
            sourcePayload.authentication = { credentials: creds };
          }
        }

        if (values.billing_source && typeof values.billing_source === 'object') {
          const billing = values.billing_source as Record<string, unknown>;
          if (Object.keys(billing).length > 0) {
            sourcePayload.billing_source = { data_source: billing };
          }
        }

        createdSource = await SourcesService.createSource(sourcePayload);

        const extra: Record<string, any> = {};
        if (values.credentials) {
          Object.assign(extra, values.credentials);
        }
        if (values.billing_source) {
          extra.billing_source = values.billing_source;
        }

        await ApplicationsService.createApplication({
          source_id: createdSource.id,
          application_type_id: 0,
          extra,
        });

        onSubmitSuccess();
        onClose();
      } catch (err: any) {
        if (createdSource?.uuid) {
          try {
            await SourcesService.deleteSource(createdSource.uuid);
          } catch {
            // Best effort cleanup
          }
        }
        setError(err?.message || intl.formatMessage(messages.wizardErrorCreate));
      }
    },
    [onSubmitSuccess, onClose, intl]
  );

  if (!isOpen) {
    return null;
  }

  const schema = buildWizardSchema(formatMessage);
  const initialValues = { source_type: 'OCP' as const };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} variant="large">
        <ModalHeader title={modalTitle} />
        <ModalBody>
          {error && (
            <Alert
              variant="danger"
              title={intl.formatMessage(messages.wizardErrorAlertTitle)}
              isInline
              style={{ marginBottom: '16px' }}
            >
              {error}
            </Alert>
          )}
          <FormRenderer
            schema={schema}
            componentMapper={componentMapper}
            FormTemplate={FormTemplate}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialValues={initialValues}
          />
        </ModalBody>
      </Modal>
      <Modal
        isOpen={isCancelConfirmOpen}
        onClose={handleDismissCancel}
        variant="small"
        aria-label="Cancel confirmation"
      >
        <ModalHeader title={intl.formatMessage(messages.wizardExitTitle)} titleIconVariant="warning" />
        <ModalBody>{intl.formatMessage(messages.wizardExitBody)}</ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={handleConfirmCancel}>
            Exit
          </Button>
          <Button variant="link" onClick={handleDismissCancel}>
            Stay
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

AddSourceWizard.displayName = 'AddSourceWizard';
