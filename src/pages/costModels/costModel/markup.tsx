import {
  Card,
  CardActions,
  CardBody,
  CardHeader,
  CardHeaderMain,
  Dropdown,
  DropdownItem,
  DropdownPosition,
  KebabToggle,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { CostModel } from 'api/costModels';
import { ReadOnlyTooltip } from 'pages/costModels/components/readOnlyTooltip';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { rbacSelectors } from 'store/rbac';
import { formatValue } from 'utils/formatValue';

import { styles } from './costCalc.styles';
import UpdateMarkupDialog from './updateMarkupDialog';

interface Props extends WithTranslation {
  isWritePermission: boolean;
  isUpdateDialogOpen: boolean;
  current: CostModel;
  setCostModelDialog: typeof costModelsActions.setCostModelDialog;
}

const MarkupCardBase: React.FunctionComponent<Props> = ({
  isWritePermission,
  setCostModelDialog,
  current,
  isUpdateDialogOpen,
  t,
}) => {
  const [dropdownIsOpen, setDropdownIsOpen] = React.useState(false);
  const markupValue =
    current && current.markup && current.markup.value
      ? formatValue(Number(current.markup.value), 'markup', {
          fractionDigits: 2,
        })
      : '0.0';

  return (
    <>
      {isUpdateDialogOpen && <UpdateMarkupDialog current={current} />}
      <Card style={styles.card}>
        <CardHeader>
          <CardHeaderMain>
            <Title headingLevel="h2" size={TitleSizes.md}>
              {t('cost_models_details.markup_or_discount')}
            </Title>
          </CardHeaderMain>
          <CardActions>
            <Dropdown
              toggle={<KebabToggle onToggle={setDropdownIsOpen} />}
              isOpen={dropdownIsOpen}
              onSelect={() => setDropdownIsOpen(false)}
              position={DropdownPosition.right}
              isPlain
              dropdownItems={[
                <ReadOnlyTooltip key="edit" isDisabled={!isWritePermission}>
                  <DropdownItem
                    isDisabled={!isWritePermission}
                    onClick={() => setCostModelDialog({ isOpen: true, name: 'updateMarkup' })}
                    component="button"
                  >
                    {t('cost_models_details.edit_markup_action')}
                  </DropdownItem>
                </ReadOnlyTooltip>,
              ]}
            />
          </CardActions>
        </CardHeader>
        <CardBody style={styles.cardDescription}>{t('cost_models_details.description_markup')}</CardBody>
        <CardBody isFilled />
        <CardBody style={styles.cardBody}>{markupValue}%</CardBody>
        <CardBody isFilled />
      </Card>
    </>
  );
};

export default connect(
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
)(withTranslation()(MarkupCardBase));
