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
import { ReadOnlyTooltip } from 'pages/costModels/components/readOnlyTooltip';
import { styles } from 'pages/costModels/costModel/costModelsDetails.styles';
import Dialog from 'pages/costModels/costModel/dialog';
import UpdateCostModelModal from 'pages/costModels/costModel/updateCostModel';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { paths } from 'routes';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { rbacSelectors } from 'store/rbac';
import { getBaseName } from 'utils/getBaseName';

interface Props extends WithTranslation {
  historyObject: H.History;
  tabRefs: any[];
  tabIndex: number;
  onSelectTab: (index: number) => void;
  setDialogOpen: typeof costModelsActions.setCostModelDialog;
  current: CostModel;
  isDialogOpen: { deleteCostModel: boolean; updateCostModel: boolean; createWizard: boolean };
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
  const baseName = getBaseName(window.location.pathname);

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
          <BreadcrumbItem to={`${baseName}${paths.costModels}`}>
            {t('cost_models_details.cost_model.cost_models')}
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{current.name}</BreadcrumbItem>
        </Breadcrumb>
        <Split>
          <SplitItem style={styles.headerDescription}>
            <Title headingLevel="h2" style={styles.title} size="2xl">
              {current.name}
            </Title>
            {current.description}
            <Title headingLevel="h2" style={styles.sourceTypeTitle} size="md">
              {t('cost_models_details.cost_model.source_type')}: {current.source_type}
            </Title>
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
        {current.source_type === 'OpenShift Container Platform' ? (
          <Tabs activeKey={tabIndex} onSelect={(_evt, index: number) => onSelectTab(index)}>
            <Tab
              eventKey={0}
              title={<TabTitleText>{t('price_list')}</TabTitleText>}
              tabContentId="refPriceList"
              tabContentRef={tabRefs[0]}
            />
            <Tab
              eventKey={1}
              title={<TabTitleText>{t('cost_calculations')}</TabTitleText>}
              tabContentId="refMarkup"
              tabContentRef={tabRefs[1]}
            />
            <Tab
              eventKey={2}
              title={<TabTitleText>{t('sources')}</TabTitleText>}
              tabContentId="refSources"
              tabContentRef={tabRefs[2]}
            />
          </Tabs>
        ) : (
          <Tabs activeKey={tabIndex} onSelect={(_evt, index: number) => onSelectTab(index)}>
            <Tab
              eventKey={0}
              title={<TabTitleText>{t('cost_calculations')}</TabTitleText>}
              tabContentId="refMarkup"
              tabContentRef={tabRefs[0]}
            />
            <Tab
              eventKey={1}
              title={<TabTitleText>{t('sources')}</TabTitleText>}
              tabContentId="refSources"
              tabContentRef={tabRefs[1]}
            />
          </Tabs>
        )}
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
