import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalVariant } from '@patternfly/react-core';
import type { CostModel } from 'api/costModels';
import messages from 'locales/messages';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';

interface ReviewOrderModalOwnProps {
  costModel: CostModel;
  isOpen?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
}

type ReviewOrderModalProps = ReviewOrderModalOwnProps;

const ReviewOrderModal: React.FC<ReviewOrderModalProps> = ({ costModel, isOpen, onClose, onConfirm }) => {
  const intl = useIntl();

  // Skip dialog if cost models does not have sources
  const shouldSkip = costModel?.sources?.length === 0;

  useEffect(() => {
    if (isOpen && shouldSkip) {
      onConfirm?.();
    }
  }, [isOpen, shouldSkip, onConfirm]);

  if (shouldSkip) {
    return null;
  }

  // PatternFly modal appends to document.body, which is outside the scoped "costManagement" dom tree.
  // Use className="costManagement" to override PatternFly styles or append the modal to an element within the tree

  return (
    <Modal className="costManagement" isOpen={isOpen} onClose={onClose} variant={ModalVariant.small}>
      <ModalHeader title={intl.formatMessage(messages.priceListReview)} />
      <ModalBody>
        {intl.formatMessage(messages.priceListReviewOrder, { costModel: <b>{costModel?.name ?? ''}</b> })}
      </ModalBody>
      <ModalFooter>
        <Button onClick={onConfirm} variant="primary">
          {intl.formatMessage(messages.continue)}
        </Button>
        <Button onClick={onClose} variant="link">
          {intl.formatMessage(messages.cancel)}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export { ReviewOrderModal };
