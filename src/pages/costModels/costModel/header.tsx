import {
  Breadcrumb,
  BreadcrumbItem,
  Dropdown,
  DropdownItem,
  KebabToggle,
  List,
  ListItem,
  Split,
  SplitItem,
  Tab,
  Tabs,
  TabTitleText,
  Title,
} from '@patternfly/react-core';
import { CostModel } from 'api/costModels';
import * as H from 'history';
import Dialog from 'pages/costModels/costModelsDetails/components/dialog';
import { ReadOnlyTooltip } from 'pages/costModels/costModelsDetails/components/readOnlyTooltip';
import UpdateCostModelModal from 'pages/costModels/costModelsDetails/components/updateCostModel';
import { styles } from 'pages/costModels/costModelsDetails/costModelsDetails.styles';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { rbacSelectors } from 'store/rbac';

interface Props extends WithTranslation {
  historyObject: H.History;
  tabRefs: any[];
  tabIndex: number;
  onSelectTab: (index: number) => void;
  setDialogOpen: typeof costModelsActions.setCostModelDialog;
  current: CostModel;
  isDialogOpen: { deleteCostModel: boolean; updateCostModel: boolean };
  isDeleteProcessing: boolean;
  deleteError: string;
  deleteCostModel: typeof costModelsActions.deleteCostModel;
  isWritePermission: boolean;
}

const Header: React.FunctionComponent<Props> = ({
  t,
  tabRefs,
  tabIndex,
  onSelectTab,
  setDialogOpen,
  isDialogOpen,
  deleteError,
  isDeleteProcessing,
  deleteCostModel,
  current,
  isWritePermission,
  historyObject,
}) => {
  const [dropdownIsOpen, setDropdownIsOpen] = React.useState(false);
  return (
    <>
      {isDialogOpen.updateCostModel && <UpdateCostModelModal />}
      <Dialog
        isSmall
        isOpen={isDialogOpen.deleteCostModel}
        title={t('dialog.delete_cost_model_title')}
        onClose={() => setDialogOpen({ name: 'deleteCostModel', isOpen: false })}
        error={deleteError}
        isProcessing={isDeleteProcessing}
        onProceed={() => {
          deleteCostModel(current.uuid, 'deleteCostModel', historyObject);
        }}
        body={
          <>
            {current.sources.length === 0 &&
              t('dialog.delete_cost_model_body_green', {
                cost_model: current.name,
              })}
            {current.sources.length > 0 && (
              <>
                {t('dialog.delete_cost_model_body_red', {
                  cost_model: current.name,
                })}
                <br />
                <br />
                {t('dialog.delete_cost_model_body_red_costmodel_delete')}
                <br />
                <List>
                  {current.sources.map(provider => (
                    <ListItem key={`${provider.uuid}`}>{provider.name}</ListItem>
                  ))}
                </List>
              </>
            )}
          </>
        }
        actionText={current.sources.length === 0 ? t('dialog.deleteCostModel') : ''}
      />
      <header style={styles.headerCostModel}>
        <Breadcrumb style={styles.breadcrumb}>
          <BreadcrumbItem to="cost-management/cost-models">
            {t('cost_models_details.cost_model.cost_models')}
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{current.name}</BreadcrumbItem>
        </Breadcrumb>
        <Split>
          <SplitItem style={styles.headerDescription}>
            <Title headingLevel="h2" style={styles.title} size="2xl">
              {current.name}
            </Title>
            {current.description && (
              <Title headingLevel="h2" style={styles.title} size="md">
                {current.description}
              </Title>
            )}
            <Title headingLevel="h2" style={styles.sourceTypeTitle} size="md">
              {t('cost_models_details.cost_model.source_type')}: {current.source_type}
            </Title>
            {current.source_type === 'OpenShift Container Platform' ? (
              <Tabs activeKey={tabIndex} onSelect={(_evt, index: number) => onSelectTab(index)}>
                <Tab
                  eventKey={0}
                  title={<TabTitleText>Price list</TabTitleText>}
                  tabContentId="refPriceList"
                  tabContentRef={tabRefs[0]}
                />
                <Tab
                  eventKey={1}
                  title={<TabTitleText>Markup</TabTitleText>}
                  tabContentId="refMarkup"
                  tabContentRef={tabRefs[1]}
                />
                <Tab
                  eventKey={2}
                  title={<TabTitleText>Sources</TabTitleText>}
                  tabContentId="refSources"
                  tabContentRef={tabRefs[2]}
                />
              </Tabs>
            ) : (
              <Tabs activeKey={tabIndex} onSelect={(_evt, index: number) => onSelectTab(index)}>
                <Tab
                  eventKey={0}
                  title={<TabTitleText>Markup</TabTitleText>}
                  tabContentId="refMarkup"
                  tabContentRef={tabRefs[0]}
                />
                <Tab
                  eventKey={1}
                  title={<TabTitleText>Sources</TabTitleText>}
                  tabContentId="refSources"
                  tabContentRef={tabRefs[1]}
                />
              </Tabs>
            )}
          </SplitItem>
          <SplitItem>
            <Dropdown
              toggle={<KebabToggle onToggle={setDropdownIsOpen} />}
              isOpen={dropdownIsOpen}
              onSelect={() => setDropdownIsOpen(false)}
              isPlain
              position="right"
              dropdownItems={[
                <ReadOnlyTooltip key="edit" isDisabled={!isWritePermission}>
                  <DropdownItem
                    isDisabled={!isWritePermission}
                    onClick={() =>
                      setDialogOpen({
                        isOpen: true,
                        name: 'updateCostModel',
                      })
                    }
                  >
                    {t('cost_models_details.action_edit')}
                  </DropdownItem>
                </ReadOnlyTooltip>,
                <ReadOnlyTooltip key="delete" isDisabled={!isWritePermission}>
                  <DropdownItem
                    isDisabled={!isWritePermission}
                    onClick={() =>
                      setDialogOpen({
                        isOpen: true,
                        name: 'deleteCostModel',
                      })
                    }
                  >
                    {t('cost_models_details.action_delete')}
                  </DropdownItem>
                </ReadOnlyTooltip>,
              ]}
            />
          </SplitItem>
        </Split>
      </header>
    </>
  );
};

export default connect(
  createMapStateToProps(state => ({
    isDialogOpen: costModelsSelectors.isDialogOpen(state)('costmodel'),
    isDeleteProcessing: costModelsSelectors.deleteProcessing(state),
    deleteError: costModelsSelectors.deleteError(state),
    isWritePermission: rbacSelectors.isCostModelWritePermission(state),
  })),
  {
    setDialogOpen: costModelsActions.setCostModelDialog,
    deleteCostModel: costModelsActions.deleteCostModel,
  }
)(withTranslation()(Header));
