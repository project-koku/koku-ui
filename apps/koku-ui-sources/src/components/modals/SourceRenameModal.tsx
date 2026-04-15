import {
  Alert,
  Button,
  Form,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextInput,
} from '@patternfly/react-core';
import { SourcesService } from 'apis/sources-service';
import { messages } from 'i18n/messages';
import React, { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import type { Source } from 'apis/models/sources';

interface SourceRenameModalProps {
  isOpen: boolean;
  source: Source;
  onClose: () => void;
  onSuccess: () => void;
}

export const SourceRenameModal: React.FC<SourceRenameModalProps> = ({ isOpen, source, onClose, onSuccess }) => {
  const intl = useIntl();
  const [newName, setNewName] = useState(source.name);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = useCallback(async () => {
    if (!newName.trim()) {
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await SourcesService.updateSource(source.uuid, { name: newName.trim() });
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to rename source');
    } finally {
      setIsSaving(false);
    }
  }, [source.uuid, newName, onSuccess]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="small">
      <ModalHeader title={intl.formatMessage(messages.rename)} />
      <ModalBody>
        {error && <Alert variant="danger" title={error} isInline style={{ marginBottom: '16px' }} />}
        <Form>
          <FormGroup label={intl.formatMessage(messages.name)} isRequired fieldId="source-rename">
            <TextInput id="source-rename" value={newName} onChange={(_event, value) => setNewName(value)} isRequired />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button variant="primary" onClick={handleSave} isLoading={isSaving} isDisabled={isSaving || !newName.trim()}>
          Save
        </Button>
        <Button variant="link" onClick={onClose} isDisabled={isSaving}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

SourceRenameModal.displayName = 'SourceRenameModal';
