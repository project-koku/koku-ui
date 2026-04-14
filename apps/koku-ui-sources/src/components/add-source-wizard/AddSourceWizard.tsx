import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import { Alert, Button, Form, Modal, ModalBody, ModalFooter, ModalHeader } from '@patternfly/react-core';
import { createApplication, createSource, type CreateSourcePayload, deleteSource } from 'api/entities';
import componentMapper from 'components/pf6-ddf-mapper';
import messages from 'locales/messages';
import React, { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import { buildWizardSchema } from './schemaBuilder';

interface AddSourceWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
  preselectedType?: string;
}

const FormTemplate: React.FC<any> = ({ formFields }) => {
  return <Form onSubmit={e => e.preventDefault()}>{formFields}</Form>;
};

const AddSourceWizard: React.FC<AddSourceWizardProps> = ({ isOpen, onClose, onSubmitSuccess, preselectedType }) => {
  const intl = useIntl();
  const modalTitle = useMemo(() => {
    if (!preselectedType) {
      return intl.formatMessage(messages.wizardTitleDefault);
    }
    const byType: Record<string, typeof messages.wizardTitleOcp> = {
      OCP: messages.wizardTitleOcp,
      AWS: messages.wizardTitleAws,
      Azure: messages.wizardTitleAzure,
      GCP: messages.wizardTitleGcp,
    };
    const descriptor = byType[preselectedType];
    return intl.formatMessage(descriptor ?? messages.wizardTitleDefault);
  }, [intl, preselectedType]);
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

      const sourceType = preselectedType || values.source_type;
      let createdSource: any = null;

      try {
        const sourcePayload: CreateSourcePayload = {
          name: values.source_name,
          source_type: sourceType,
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

        createdSource = await createSource(sourcePayload);

        const extra: Record<string, any> = {};
        if (values.credentials) {
          Object.assign(extra, values.credentials);
        }
        if (values.billing_source) {
          extra.billing_source = values.billing_source;
        }

        await createApplication({
          source_id: createdSource.id,
          application_type_id: 0,
          extra,
        });

        onSubmitSuccess();
        onClose();
      } catch (err: any) {
        if (createdSource?.uuid) {
          try {
            await deleteSource(createdSource.uuid);
          } catch {
            // Best effort cleanup
          }
        }
        setError(err?.message || intl.formatMessage(messages.wizardErrorCreate));
      }
    },
    [preselectedType, onSubmitSuccess, onClose, intl]
  );

  if (!isOpen) {
    return null;
  }

  const schema = buildWizardSchema(formatMessage, preselectedType);
  const initialValues = preselectedType ? { source_type: preselectedType } : {};

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

export { AddSourceWizard };
