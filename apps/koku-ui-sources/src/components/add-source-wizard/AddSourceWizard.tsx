import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import { Alert, Button, Form, Modal, ModalBody, ModalFooter, ModalHeader } from '@patternfly/react-core';
import { createApplication, createSource, deleteSource } from 'api/entities';
import componentMapper from 'components/pf6-ddf-mapper';
import React, { useCallback, useState } from 'react';

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

const getWizardTitle = (preselectedType?: string): string => {
  if (!preselectedType) {
    return 'Add source';
  }
  const typeLabels: Record<string, string> = {
    OCP: 'Add an OpenShift source',
    AWS: 'Add an Amazon Web Services source',
    Azure: 'Add a Microsoft Azure source',
    GCP: 'Add a Google Cloud Platform source',
  };
  return typeLabels[preselectedType] || 'Add source';
};

const AddSourceWizard: React.FC<AddSourceWizardProps> = ({ isOpen, onClose, onSubmitSuccess, preselectedType }) => {
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
        createdSource = await createSource({
          name: values.source_name,
          source_type: sourceType,
        });

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
        setError(err?.message || 'Failed to create source');
      }
    },
    [preselectedType, onSubmitSuccess, onClose]
  );

  if (!isOpen) {
    return null;
  }

  const schema = buildWizardSchema(preselectedType);
  const initialValues = preselectedType ? { source_type: preselectedType } : {};

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} variant="large">
        <ModalHeader title={getWizardTitle(preselectedType)} />
        <ModalBody>
          {error && (
            <Alert variant="danger" title="Error creating source" isInline style={{ marginBottom: '16px' }}>
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
        <ModalHeader title="Exit source creation?" />
        <ModalBody>All inputs will be discarded.</ModalBody>
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
