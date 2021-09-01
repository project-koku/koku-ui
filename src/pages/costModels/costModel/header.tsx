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
  TitleSizes,
} from '@patternfly/react-core';
import { CostModel } from 'api/costModels';
import * as H from 'history';
import messages from 'locales/messages';
import { ReadOnlyTooltip } from 'pages/costModels/components/readOnlyTooltip';
import { styles } from 'pages/costModels/costModel/costModelsDetails.styles';
import Dialog from 'pages/costModels/costModel/dialog';
import UpdateCostModelModal from 'pages/costModels/costModel/updateCostModel';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { paths } from 'routes';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { rbacSelectors } from 'store/rbac';
import { getBaseName } from 'utils/getBaseName';

interface Props extends WrappedComponentProps {
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
  intl,
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
        title={intl.formatMessage(messages.CostModelsDelete)}
        onClose={() => setDialogOpen({ name: 'deleteCostModel', isOpen: false })}
        error={deleteError}
        isProcessing={isDeleteProcessing}
        onProceed={() => {
          deleteCostModel(current.uuid, 'deleteCostModel', historyObject);
        }}
        body={
          <>
            {current.sources.length === 0 &&
              intl.formatMessage(messages.CostModelsDeleteDesc, {
                costModel: current.name,
              })}
            {current.sources.length > 0 && (
              <>
                {intl.formatMessage(messages.CostModelsDeleteSource)}
                <br />
                <br />
                {intl.formatMessage(messages.CostModelsAvailaleSources)}
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
        actionText={current.sources.length === 0 ? intl.formatMessage(messages.CostModelsDelete) : ''}
      />
      <header style={styles.headerCostModel}>
        <Breadcrumb style={styles.breadcrumb}>
          <BreadcrumbItem to={`${baseName}${paths.costModels}`}>
            {intl.formatMessage(messages.CostModels)}
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{current.name}</BreadcrumbItem>
        </Breadcrumb>
        <Split>
          <SplitItem style={styles.headerDescription}>
            <Title headingLevel="h1" style={styles.title} size={TitleSizes['2xl']}>
              {current.name}
            </Title>
            {current.description}
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
                    {intl.formatMessage(messages.Edit)}
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
                    {intl.formatMessage(messages.Delete)}
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
              title={<TabTitleText>{intl.formatMessage(messages.PriceList)}</TabTitleText>}
              tabContentId="refPriceList"
              tabContentRef={tabRefs[0]}
            />
            <Tab
              eventKey={1}
              title={<TabTitleText>{intl.formatMessage(messages.CostCalculations)}</TabTitleText>}
              tabContentId="refMarkup"
              tabContentRef={tabRefs[1]}
            />
            <Tab
              eventKey={2}
              title={<TabTitleText>{intl.formatMessage(messages.Sources)}</TabTitleText>}
              tabContentId="refSources"
              tabContentRef={tabRefs[2]}
            />
          </Tabs>
        ) : (
          <Tabs activeKey={tabIndex} onSelect={(_evt, index: number) => onSelectTab(index)}>
            <Tab
              eventKey={0}
              title={<TabTitleText>{intl.formatMessage(messages.CostCalculations)}</TabTitleText>}
              tabContentId="refMarkup"
              tabContentRef={tabRefs[0]}
            />
            <Tab
              eventKey={1}
              title={<TabTitleText>{intl.formatMessage(messages.Sources)}</TabTitleText>}
              tabContentId="refSources"
              tabContentRef={tabRefs[1]}
            />
          </Tabs>
        )}
      </header>
    </>
  );
};

export default injectIntl(
  connect(
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
  )(Header)
);
