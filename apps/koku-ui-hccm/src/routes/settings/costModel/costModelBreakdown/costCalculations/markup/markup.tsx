import { Button, ButtonVariant, Card, CardBody, CardHeader, Title, TitleSizes } from '@patternfly/react-core';
import type { CostModel } from 'api/costModels';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { ReadOnlyTooltip } from 'routes/settings/costModelsDeprecated/components/readOnlyTooltip';
import { formatPercentageMarkup } from 'utils/format';

import { styles } from './markup.styles';
import { MarkupModal } from './markupModal';

interface MarkupOwnProps {
  canWrite?: boolean;
  costModel?: CostModel;
  onSave?: (costModel: CostModel) => void;
}

type MarkupProps = MarkupOwnProps;

const Markup: React.FC<MarkupProps> = ({ canWrite, costModel, onSave }) => {
  const intl = useIntl();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const markupValue = formatPercentageMarkup(costModel?.markup?.value ? Number(costModel.markup.value) : 0);

  // Handlers

  const handleOnSave = (item: CostModel) => {
    setIsModalOpen(false);
    onSave?.(item);
  };

  const handleOnModalClick = () => {
    setIsModalOpen(true);
  };

  const handleOnModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Card style={styles.card}>
        <CardHeader
          actions={{
            actions: (
              <ReadOnlyTooltip key="edit" isDisabled={!canWrite}>
                <Button
                  aria-label={intl.formatMessage(messages.editMarkup)}
                  isAriaDisabled={!canWrite}
                  onClick={handleOnModalClick}
                  variant={ButtonVariant.link}
                >
                  {intl.formatMessage(messages.edit)}
                </Button>
              </ReadOnlyTooltip>
            ),
            hasNoOffset: false,
            className: undefined,
          }}
        >
          <Title headingLevel="h2" size={TitleSizes.md}>
            {intl.formatMessage(messages.markupOrDiscount)}
          </Title>
        </CardHeader>
        <CardBody style={styles.cardDescription}>{intl.formatMessage(messages.markupOrDiscountDesc)}</CardBody>
        <CardBody isFilled />
        <CardBody style={styles.cardBody}>{intl.formatMessage(messages.percent, { value: markupValue })}</CardBody>
        <CardBody isFilled />
      </Card>
      <MarkupModal
        canWrite={canWrite}
        costModel={costModel}
        isOpen={isModalOpen}
        onSave={handleOnSave}
        onClose={handleOnModalClose}
      />
    </>
  );
};

export { Markup };
