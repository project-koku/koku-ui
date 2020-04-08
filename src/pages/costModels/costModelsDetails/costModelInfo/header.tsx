import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  DropdownItem,
  List,
  ListItem,
  Split,
  SplitItem,
  Tab,
  Tabs,
  Title,
} from '@patternfly/react-core';
import { CostModel } from 'api/costModels';
import Dialog from 'pages/costModels/costModelsDetails/components/dialog';
import Dropdown from 'pages/costModels/costModelsDetails/components/dropdown';
import { ReadOnlyTooltip } from 'pages/costModels/costModelsDetails/components/readOnlyTooltip';
import UpdateCostModelDialog from 'pages/costModels/costModelsDetails/components/updateCostModel';
import { styles } from 'pages/costModels/costModelsDetails/costModelsDetails.styles';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { rbacSelectors } from 'store/rbac';

interface Props extends InjectedTranslateProps {
  goBack: () => void;
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

class Header extends React.Component<Props> {
  public cmpRef = React.createRef<HTMLElement>();
  public componentDidMount() {
    this.cmpRef.current.scrollIntoView();
  }
  public render() {
    const {
      t,
      tabRefs,
      tabIndex,
      onSelectTab,
      goBack,
      setDialogOpen,
      isDialogOpen,
      deleteError,
      isDeleteProcessing,
      deleteCostModel,
      current,
      isWritePermission,
    } = this.props;
    return (
      <>
        {isDialogOpen.updateCostModel && <UpdateCostModelDialog />}
        <Dialog
          isSmall
          isOpen={isDialogOpen.deleteCostModel}
          title={t('dialog.delete_cost_model_title', {
            cost_model: current.name,
          })}
          onClose={() =>
            setDialogOpen({ name: 'deleteCostModel', isOpen: false })
          }
          error={deleteError}
          isProcessing={isDeleteProcessing}
          onProceed={() => {
            deleteCostModel(current.uuid, 'deleteCostModel');
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
                      <ListItem key={`${provider.uuid}`}>
                        {provider.name}
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </>
          }
          actionText={
            current.sources.length === 0 ? t('dialog.deleteCostModel') : ''
          }
        />
        <header ref={this.cmpRef} style={styles.headerCostModel}>
          <Breadcrumb>
            <BreadcrumbItem>
              <Button
                style={{ paddingLeft: '0', paddingRight: '0' }}
                onClick={goBack}
                variant="link"
              >
                {t('cost_models_details.cost_model.cost_models')}
              </Button>
            </BreadcrumbItem>
            <BreadcrumbItem isActive>{current.name}</BreadcrumbItem>
          </Breadcrumb>
          <Split>
            <SplitItem style={styles.headerDescription}>
              <Title headingLevel="h1" style={styles.title} size="2xl">
                {current.name}
              </Title>
              {current.description && (
                <>
                  <Title headingLevel="h1" style={styles.title} size="md">
                    {current.description}
                  </Title>
                  <br />
                </>
              )}
              <Title headingLevel="h1" style={styles.title} size="md">
                {t('cost_models_details.cost_model.source_type')}:{' '}
                {current.source_type}
              </Title>
              {current.source_type === 'OpenShift Container Platform' ? (
                <Tabs
                  activeKey={tabIndex}
                  onSelect={(_evt, index: number) => onSelectTab(index)}
                >
                  <Tab
                    eventKey={0}
                    title="Price list"
                    tabContentId="refPriceList"
                    tabContentRef={tabRefs[0]}
                  />
                  <Tab
                    eventKey={1}
                    title="Markup"
                    tabContentId="refMarkup"
                    tabContentRef={tabRefs[1]}
                  />
                  <Tab
                    eventKey={2}
                    title="Sources"
                    tabContentId="refSources"
                    tabContentRef={tabRefs[2]}
                  />
                </Tabs>
              ) : (
                <Tabs
                  activeKey={tabIndex}
                  onSelect={(_evt, index: number) => onSelectTab(index)}
                >
                  <Tab
                    eventKey={0}
                    title="Markup"
                    tabContentId="refMarkup"
                    tabContentRef={tabRefs[0]}
                  />
                  <Tab
                    eventKey={1}
                    title="Sources"
                    tabContentId="refSources"
                    tabContentRef={tabRefs[1]}
                  />
                </Tabs>
              )}
            </SplitItem>
            <SplitItem>
              <Dropdown
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
                      style={isWritePermission ? { color: 'red' } : undefined}
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
  }
}

export default connect(
  createMapStateToProps(state => ({
    isDialogOpen: costModelsSelectors.isDialogOpen(state)('costmodel'),
    isDeleteProcessing: costModelsSelectors.deleteProcessing(state),
    deleteError: costModelsSelectors.deleteError(state),
    current: costModelsSelectors.selected(state),
    isWritePermission: rbacSelectors.isCostModelWritePermission(state),
  })),
  {
    setDialogOpen: costModelsActions.setCostModelDialog,
    deleteCostModel: costModelsActions.deleteCostModel,
  }
)(translate()(Header));
