import {
  Button,
  Content,
  ContentVariants,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import type { CostModel } from 'api/costModels';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';

interface ReviewModalOwnProps {
  costModel: CostModel;
  isOpen?: boolean;
  onClose?: () => void;
}

type ReviewModalProps = ReviewModalOwnProps;

const ReviewModal: React.FC<ReviewModalProps> = ({ costModel, isOpen, onClose }) => {
  const intl = useIntl();

  // PatternFly modal appends to document.body, which is outside the scoped "costManagement" dom tree.
  // Use className="costManagement" to override PatternFly styles or append the modal to an element within the tree

  return (
    <Modal className="costManagement" isOpen={isOpen} onClose={onClose} variant={ModalVariant.small}>
      <ModalHeader title={intl.formatMessage(messages.costModelsDelete)} />
      <ModalBody>
        <Stack hasGutter>
          <StackItem>
            <Content>{intl.formatMessage(messages.costModelsDeleteSource)}</Content>
          </StackItem>
          <StackItem>
            <Content>{intl.formatMessage(messages.costModelsCanNotDelete, { name: <b>costModel?.name</b> })}</Content>
          </StackItem>
          <StackItem>
            <Content component={ContentVariants.ol}>
              {costModel?.sources?.map((source, index) => (
                <Content component={ContentVariants.li} key={`source-${index}`}>
                  {source?.name || ''}
                </Content>
              ))}
            </Content>
          </StackItem>
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose} variant="link">
          {intl.formatMessage(messages.cancel)}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export { ReviewModal };
