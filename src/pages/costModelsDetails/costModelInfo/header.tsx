import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  DropdownItem,
  Flex,
  FlexItem,
  List,
  ListItem,
  Tab,
  Tabs,
  Title,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { CostModel } from 'api/costModels';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import Dialog from '../components/dialog';
import Dropdown from '../components/dropdown';
import UpdateCostModelDialog from '../components/updateCostModel';
import { styles } from '../costModelsDetails.styles';

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
              {current.providers.length === 0 &&
                t('dialog.delete_cost_model_body_green', {
                  cost_model: current.name,
                })}
              {current.providers.length > 0 && (
                <>
                  {t('dialog.delete_cost_model_body_red', {
                    cost_model: current.name,
                  })}
                  <br />
                  <br />
                  {t('dialog.delete_cost_model_body_red_costmodel_delete')}
                  <br />
                  <List>
                    {current.providers.map(provider => (
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
            current.providers.length === 0 ? t('dialog.deleteCostModel') : ''
          }
        />
        <header ref={this.cmpRef} className={css(styles.headerCostModel)}>
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
          <Flex className="pf-m-justify-content-space-between example-border">
            <FlexItem>
              <Title className={css(styles.title)} size="2xl">
                {current.name}
              </Title>
              {current.description && (
                <>
                  <Title className={css(styles.title)} size="md">
                    {current.description}
                  </Title>
                  <br />
                </>
              )}
              <Title className={css(styles.title)} size="md">
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
            </FlexItem>
            <FlexItem>
              <Dropdown
                isPlain
                position="right"
                dropdownItems={[
                  <DropdownItem
                    onClick={() =>
                      setDialogOpen({
                        isOpen: true,
                        name: 'updateCostModel',
                      })
                    }
                    key="edit"
                  >
                    {t('cost_models_details.action_edit')}
                  </DropdownItem>,
                  <DropdownItem
                    onClick={() =>
                      setDialogOpen({
                        isOpen: true,
                        name: 'deleteCostModel',
                      })
                    }
                    key="delete"
                    style={{ color: 'red' }}
                  >
                    {t('cost_models_details.action_delete')}
                  </DropdownItem>,
                ]}
              />
            </FlexItem>
          </Flex>
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
  })),
  {
    setDialogOpen: costModelsActions.setCostModelDialog,
    deleteCostModel: costModelsActions.deleteCostModel,
  }
)(translate()(Header));
