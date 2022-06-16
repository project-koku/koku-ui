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
import messages from 'locales/messages';
import { ReadOnlyTooltip } from 'pages/costModels/components/readOnlyTooltip';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { rbacSelectors } from 'store/rbac';

import { styles } from './costCalc.styles';
import UpdateDistributionDialog from './updateDistributionDialog';

interface Props extends WrappedComponentProps {
  isWritePermission: boolean;
  isUpdateDialogOpen: boolean;
  current: CostModel;
  setCostModelDialog: typeof costModelsActions.setCostModelDialog;
}

const DistributionCardBase: React.FunctionComponent<Props> = ({
  intl,
  isWritePermission,
  setCostModelDialog,
  current,
  isUpdateDialogOpen,
}) => {
  const [dropdownIsOpen, setDropdownIsOpen] = React.useState(false);
  const distributionLabel =
    current.distribution === 'cpu' ? intl.formatMessage(messages.cpuTitle) : intl.formatMessage(messages.memoryTitle);

  return (
    <>
      {isUpdateDialogOpen && <UpdateDistributionDialog current={current} />}
      <Card style={styles.card}>
        <CardHeader>
          <CardHeaderMain>
            <Title headingLevel="h2" size={TitleSizes.md}>
              {intl.formatMessage(messages.distributionType)}
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
        <CardBody style={styles.cardBody}>{distributionLabel}</CardBody>
        <CardBody isFilled />
      </Card>
    </>
  );
};

export default injectIntl(
  connect(
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
  )(DistributionCardBase)
);
