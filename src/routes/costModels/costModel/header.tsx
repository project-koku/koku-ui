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
  TextContent,
  TextList,
  TextListItem,
  TextListItemVariants,
  TextListVariants,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import type { CostModel } from 'api/costModels';
import type * as H from 'history';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { paths } from 'routes';
import { ReadOnlyTooltip } from 'routes/costModels/components/readOnlyTooltip';
import { styles } from 'routes/costModels/costModel/costModelsDetails.styles';
import Dialog from 'routes/costModels/costModel/dialog';
import UpdateCostModelModal from 'routes/costModels/costModel/updateCostModel';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { rbacSelectors } from 'store/rbac';
import { getBaseName } from 'utils/paths';

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

const Header: React.FC<Props> = ({
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
        title={intl.formatMessage(messages.costModelsDelete)}
        onClose={() => setDialogOpen({ name: 'deleteCostModel', isOpen: false })}
        error={deleteError}
        isProcessing={isDeleteProcessing}
        onProceed={() => {
          deleteCostModel(current.uuid, 'deleteCostModel', historyObject);
        }}
        body={
          <>
            {current.sources.length === 0 &&
              intl.formatMessage(messages.costModelsDeleteDesc, {
                costModel: current.name,
              })}
            {current.sources.length > 0 && (
              <>
                {intl.formatMessage(messages.costModelsDeleteSource)}
                <br />
                <br />
                {intl.formatMessage(messages.costModelsAvailableSources)}
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
        actionText={current.sources.length === 0 ? intl.formatMessage(messages.costModelsDelete) : ''}
      />
      <header style={styles.headerCostModel}>
        <div style={styles.headerContent}>
          <Breadcrumb style={styles.breadcrumb}>
            <BreadcrumbItem to={`${baseName}${paths.costModels}`}>
              {intl.formatMessage(messages.costModels)}
            </BreadcrumbItem>
            <BreadcrumbItem isActive>{current.name}</BreadcrumbItem>
          </Breadcrumb>
        </div>
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
                    {intl.formatMessage(messages.edit)}
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
                    {intl.formatMessage(messages.delete)}
                  </DropdownItem>
                </ReadOnlyTooltip>,
              ]}
            />
          </SplitItem>
        </Split>
        <TextContent style={styles.currency}>
          <TextList component={TextListVariants.dl}>
            <TextListItem component={TextListItemVariants.dt}>{intl.formatMessage(messages.currency)}</TextListItem>
            <TextListItem component={TextListItemVariants.dd}>
              {intl.formatMessage(messages.currencyOptions, { units: current.currency || 'USD' })}
            </TextListItem>
          </TextList>
        </TextContent>
        {current.source_type === 'OpenShift Container Platform' ? (
          <Tabs activeKey={tabIndex} onSelect={(_evt, index: number) => onSelectTab(index)}>
            <Tab
              eventKey={0}
              title={<TabTitleText>{intl.formatMessage(messages.priceList)}</TabTitleText>}
              tabContentId="refPriceList"
              tabContentRef={tabRefs[0]}
            />
            <Tab
              eventKey={1}
              title={<TabTitleText>{intl.formatMessage(messages.costCalculations)}</TabTitleText>}
              tabContentId="refMarkup"
              tabContentRef={tabRefs[1]}
            />
            <Tab
              eventKey={2}
              title={<TabTitleText>{intl.formatMessage(messages.sources)}</TabTitleText>}
              tabContentId="refSources"
              tabContentRef={tabRefs[2]}
            />
          </Tabs>
        ) : (
          <Tabs activeKey={tabIndex} onSelect={(_evt, index: number) => onSelectTab(index)}>
            <Tab
              eventKey={0}
              title={<TabTitleText>{intl.formatMessage(messages.costCalculations)}</TabTitleText>}
              tabContentId="refMarkup"
              tabContentRef={tabRefs[0]}
            />
            <Tab
              eventKey={1}
              title={<TabTitleText>{intl.formatMessage(messages.sources)}</TabTitleText>}
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
