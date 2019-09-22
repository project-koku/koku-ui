import {
  Card,
  CardActions,
  CardBody,
  CardHead,
  DropdownItem,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { CostModel } from 'api/costModels';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import DeleteMarkupDialog from './deleteMarkupDialog';
import Dropdown from './dropdown';
import { styles } from './markup.styles';
import UpdateMarkupDialog from './updateMarkupDialog';

interface Props extends InjectedTranslateProps {
  isUpdateDialogOpen: boolean;
  current: CostModel;
  setCostModelDialog: typeof costModelsActions.setCostModelDialog;
}

const MarkupCardBase: React.SFC<Props> = ({
  setCostModelDialog,
  current,
  isUpdateDialogOpen,
  t,
}) => {
  return (
    <>
      <DeleteMarkupDialog />
      {isUpdateDialogOpen && <UpdateMarkupDialog />}
      <Card className={css(styles.card)}>
        <CardHead>
          <CardActions>
            <Dropdown
              isPlain
              dropdownItems={[
                <DropdownItem
                  key="delete"
                  onClick={() => {
                    setCostModelDialog({ isOpen: true, name: 'deleteMarkup' });
                  }}
                  component="button"
                >
                  {t('cost_models_wizard.price_list.delete_button')}
                </DropdownItem>,
                <DropdownItem
                  key="edit"
                  onClick={() =>
                    setCostModelDialog({ isOpen: true, name: 'updateMarkup' })
                  }
                  component="button"
                >
                  {t('cost_models_wizard.price_list.update_button')}
                </DropdownItem>,
              ]}
            />
          </CardActions>
        </CardHead>
        <CardBody isFilled />
        <CardBody className={css(styles.cardBody)}>
          {Number(current.markup.value).toFixed(2)}%
        </CardBody>
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
    };
  }),
  {
    setCostModelDialog: costModelsActions.setCostModelDialog,
  }
)(translate()(MarkupCardBase));
