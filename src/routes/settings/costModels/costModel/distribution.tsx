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
import type { CostModel } from 'api/costModels';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { ReadOnlyTooltip } from 'routes/settings/costModels/components/readOnlyTooltip';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { rbacSelectors } from 'store/rbac';

import { styles } from './costCalc.styles';
import UpdateDistributionDialog from './updateDistributionDialog';

interface Props {
  isWritePermission: boolean;
  isUpdateDialogOpen: boolean;
  current: CostModel;
  setCostModelDialog: typeof costModelsActions.setCostModelDialog;
}

const DistributionCardBase: React.FC<Props> = ({
  isWritePermission,
  setCostModelDialog,
  current,
  isUpdateDialogOpen,
}) => {
  const intl = useIntl();
  const [dropdownIsOpen, setDropdownIsOpen] = React.useState(false);

  return (
    <>
      {isUpdateDialogOpen && <UpdateDistributionDialog current={current} />}
      <Card style={styles.card}>
        <CardHeader>
          <CardHeaderMain>
            <Title headingLevel="h2" size={TitleSizes.md}>
              {intl.formatMessage(messages.costDistribution)}
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
                    {intl.formatMessage(messages.costModelsDistributionEdit)}
                  </DropdownItem>
                </ReadOnlyTooltip>,
              ]}
            />
          </CardActions>
        </CardHeader>
        <CardBody style={styles.cardDescription}>{intl.formatMessage(messages.costModelsDistributionDesc)}</CardBody>
        <CardBody isFilled />
        <CardBody style={styles.cardBody}>
          <div>
            {intl.formatMessage(messages.distributionTypeDesc, {
              type: current.distribution_info.distribution_type,
            })}
          </div>
          <div>
            {intl.formatMessage(messages.distributeCosts, {
              value: current.distribution_info.platform_cost,
              type: 'platform',
            })}
          </div>
          <div>
            {intl.formatMessage(messages.distributeCosts, {
              value: current.distribution_info.worker_cost,
              type: 'worker',
            })}
          </div>
        </CardBody>
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
)(DistributionCardBase);
