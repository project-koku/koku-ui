import {
  Card,
  CardActions,
  CardBody,
  CardHead,
  CardHeader,
  DropdownItem,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { CostModel } from 'api/costModels';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
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
  // Calling current.markup.value is generating an undefined error in prod beta
  const markupValue =
    current && current.markup && current.markup.value
      ? Number(current.markup.value).toFixed(2)
      : 0;

  return (
    <>
      {isUpdateDialogOpen && <UpdateMarkupDialog />}
      <Card className={css(styles.card)}>
        <CardHead>
          <CardActions>
            <Dropdown
              isPlain
              dropdownItems={[
                <DropdownItem
                  key="edit"
                  onClick={() =>
                    setCostModelDialog({ isOpen: true, name: 'updateMarkup' })
                  }
                  component="button"
                >
                  {t('cost_models_details.edit_markup_action')}
                </DropdownItem>,
              ]}
            />
          </CardActions>
          <CardHeader>
            precentage value to add or substract to the base cost of the
            source(s)
          </CardHeader>
        </CardHead>
        <CardBody isFilled />
        <CardBody className={css(styles.cardBody)}>{markupValue}%</CardBody>
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
