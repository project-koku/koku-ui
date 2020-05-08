import {
  Card,
  CardActions,
  CardBody,
  CardHeader,
  CardTitle,
  DropdownItem,
} from '@patternfly/react-core';
import { CostModel } from 'api/costModels';
import { ReadOnlyTooltip } from 'pages/costModels/costModelsDetails/components/readOnlyTooltip';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { rbacSelectors } from 'store/rbac';
import Dropdown from './dropdown';
import { styles } from './markup.styles';
import UpdateMarkupDialog from './updateMarkupDialog';

interface Props extends InjectedTranslateProps {
  isWritePermission: boolean;
  isUpdateDialogOpen: boolean;
  current: CostModel;
  setCostModelDialog: typeof costModelsActions.setCostModelDialog;
}

const MarkupCardBase: React.SFC<Props> = ({
  isWritePermission,
  setCostModelDialog,
  current,
  isUpdateDialogOpen,
  t,
}) => {
  // Calling current.markup.value is generating an undefined error in prod beta
  const markupValue =
    current && current.markup && current.markup.value
      ? Number(current.markup.value).toFixed(2)
      : 0;

  return (
    <>
      {isUpdateDialogOpen && <UpdateMarkupDialog />}
      <Card style={styles.card}>
        <CardHeader>
          <CardActions>
            <Dropdown
              isPlain
              dropdownItems={[
                <ReadOnlyTooltip key="edit" isDisabled={!isWritePermission}>
                  <DropdownItem
                    isDisabled={!isWritePermission}
                    onClick={() =>
                      setCostModelDialog({ isOpen: true, name: 'updateMarkup' })
                    }
                    component="button"
                  >
                    {t('cost_models_details.edit_markup_action')}
                  </DropdownItem>
                </ReadOnlyTooltip>,
              ]}
            />
          </CardActions>
          <CardTitle>{t('cost_models_details.description_markup')}</CardTitle>
        </CardHeader>
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
)(translate()(MarkupCardBase));
