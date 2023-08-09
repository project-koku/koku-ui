import {
  Button,
  ButtonVariant,
  Card,
  CardActions,
  CardBody,
  CardHeader,
  CardHeaderMain,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import type { CostModel } from 'api/costModels';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { ReadOnlyTooltip } from 'routes/settings/costModels/components/readOnlyTooltip';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { rbacSelectors } from 'store/rbac';
import { formatPercentageMarkup } from 'utils/format';

import { styles } from './costCalc.styles';
import UpdateMarkupDialog from './updateMarkupDialog';

interface Props extends WrappedComponentProps {
  isWritePermission: boolean;
  isUpdateDialogOpen: boolean;
  current: CostModel;
  setCostModelDialog: typeof costModelsActions.setCostModelDialog;
}

const MarkupCardBase: React.FC<Props> = ({
  intl,
  isWritePermission,
  setCostModelDialog,
  current,
  isUpdateDialogOpen,
}) => {
  const markupValue = formatPercentageMarkup(
    current && current.markup && current.markup.value ? Number(current.markup.value) : 0
  );

  return (
    <>
      {isUpdateDialogOpen && <UpdateMarkupDialog current={current} />}
      <Card style={styles.card}>
        <CardHeader>
          <CardHeaderMain>
            <Title headingLevel="h2" size={TitleSizes.md}>
              {intl.formatMessage(messages.markupOrDiscount)}
            </Title>
          </CardHeaderMain>
          <CardActions>
            <ReadOnlyTooltip key="edit" isDisabled={!isWritePermission}>
              <Button
                aria-label={intl.formatMessage(messages.editMarkup)}
                variant={ButtonVariant.link}
                isAriaDisabled={!isWritePermission}
                onClick={() => setCostModelDialog({ isOpen: true, name: 'updateMarkup' })}
              >
                {intl.formatMessage(messages.edit)}
              </Button>
            </ReadOnlyTooltip>
          </CardActions>
        </CardHeader>
        <CardBody style={styles.cardDescription}>{intl.formatMessage(messages.markupOrDiscountDesc)}</CardBody>
        <CardBody isFilled />
        <CardBody style={styles.cardBody}>{intl.formatMessage(messages.percent, { value: markupValue })}</CardBody>
        <CardBody isFilled />
      </Card>
    </>
  );
};

export default injectIntl(
  connect(
    createMapStateToProps(state => {
      const { updateMarkup } = costModelsSelectors.isDialogOpen(state)('markup');
      return {
        isUpdateDialogOpen: updateMarkup,
        costModelDialog: costModelsSelectors.isDialogOpen(state)('markup'),
        isWritePermission: rbacSelectors.isCostModelWritePermission(state),
      };
    }),
    {
      setCostModelDialog: costModelsActions.setCostModelDialog,
    }
  )(MarkupCardBase)
);
