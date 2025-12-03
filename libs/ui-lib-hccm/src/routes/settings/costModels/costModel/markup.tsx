import type { CostModel } from '@koku-ui/api/costModels';
import messages from '@koku-ui/i18n/locales/messages';
import { Button, ButtonVariant, Card, CardBody, CardHeader, Title, TitleSizes } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { createMapStateToProps } from '../../../../store/common';
import { costModelsActions, costModelsSelectors } from '../../../../store/costModels';
import { rbacSelectors } from '../../../../store/rbac';
import { formatPercentageMarkup } from '../../../../utils/format';
import { ReadOnlyTooltip } from '../components/readOnlyTooltip';
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
        <CardHeader
          actions={{
            actions: (
              <ReadOnlyTooltip key="edit" isDisabled={!isWritePermission}>
                <Button
                  aria-label={intl.formatMessage(messages.editMarkup)}
                  isAriaDisabled={!isWritePermission}
                  onClick={() => setCostModelDialog({ isOpen: true, name: 'updateMarkup' })}
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
