import { Alert, Button, Modal, ModalBody, ModalFooter, ModalHeader } from '@patternfly/react-core';
import { SourcesService } from 'apis/sources-service';
import { messages } from 'i18n/messages';
import React, { useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import type { Source } from 'apis/models/sources';

interface SourceRemoveModalProps {
  isOpen: boolean;
  source: Source;
  onClose: () => void;
  onSuccess: () => void;
}

export const SourceRemoveModal: React.FC<SourceRemoveModalProps> = ({ isOpen, source, onClose, onSuccess }) => {
  const intl = useIntl();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await SourcesService.deleteSource(source.uuid);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to remove source');
    } finally {
      setIsDeleting(false);
    }
  }, [source.uuid, onSuccess, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="small">
      <ModalHeader title={intl.formatMessage(messages.remove)} titleIconVariant="warning" />
      <ModalBody>
        {error && <Alert variant="danger" title={error} isInline style={{ marginBottom: '16px' }} />}
        <FormattedMessage {...messages.removeConfirmation} values={{ name: <strong>{source.name}</strong> }} />
      </ModalBody>
      <ModalFooter>
        <Button variant="danger" onClick={handleDelete} isLoading={isDeleting} isDisabled={isDeleting}>
          {intl.formatMessage(messages.remove)}
        </Button>
        <Button variant="link" onClick={onClose} isDisabled={isDeleting}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

SourceRemoveModal.displayName = 'SourceRemoveModal';
