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
} from '@patternfly/react-core';
import { CostModel } from 'api/costModels';
import { ReadOnlyTooltip } from 'pages/costModels/components/readOnlyTooltip';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { rbacSelectors } from 'store/rbac';

import { styles } from './costCalc.styles';
import UpdateDistributionDialog from './updateDistributionDialog';

interface Props extends WithTranslation {
  isWritePermission: boolean;
  isUpdateDialogOpen: boolean;
  current: CostModel;
  setCostModelDialog: typeof costModelsActions.setCostModelDialog;
}

const DistributionCardBase: React.FunctionComponent<Props> = ({
  isWritePermission,
  setCostModelDialog,
  current,
  isUpdateDialogOpen,
  t,
}) => {
  const [dropdownIsOpen, setDropdownIsOpen] = React.useState(false);
  const distributionLabel = current.distribution === 'cpu' ? 'CPU' : 'Memory';

  return (
    <>
      {isUpdateDialogOpen && <UpdateDistributionDialog current={current} />}
      <Card style={styles.card}>
        <CardHeader>
          <CardHeaderMain>
            <Title headingLevel="h2" size="md">
              {t('cost_models_details.distribution_type')}
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
                    onClick={() => setCostModelDialog({ isOpen: true, name: 'updateDistribution' })}
                    component="button"
                  >
                    {t('cost_models_details.edit_distribution')}
                  </DropdownItem>
                </ReadOnlyTooltip>,
              ]}
            />
          </CardActions>
        </CardHeader>
        <CardBody style={styles.cardDescription}>{t('cost_models_details.description_distribution')}</CardBody>
        <CardBody isFilled />
        <CardBody style={styles.cardBody}>{distributionLabel}</CardBody>
        <CardBody isFilled />
      </Card>
    </>
  );
};

export default connect(
  createMapStateToProps(state => {
    const { updateDistribution } = costModelsSelectors.isDialogOpen(state)('distribution');
    return {
      isUpdateDialogOpen: updateDistribution,
      costModelDialog: costModelsSelectors.isDialogOpen(state)('distribution'),
      isWritePermission: rbacSelectors.isCostModelWritePermission(state),
    };
  }),
  {
    setCostModelDialog: costModelsActions.setCostModelDialog,
  }
)(withTranslation()(DistributionCardBase));
