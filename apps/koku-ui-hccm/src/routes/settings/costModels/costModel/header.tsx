import {
  Breadcrumb,
  BreadcrumbItem,
  Content,
  ContentVariants,
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
import type { CostModel } from 'api/costModels';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { routes } from 'routes';
import { styles } from 'routes/settings/costModels/costModel/costModelsDetails.styles';
import Dialog from 'routes/settings/costModels/costModel/dialog';
import UpdateCostModelModal from 'routes/settings/costModels/costModel/updateCostModel';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { rbacSelectors } from 'store/rbac';
import { formatPath } from 'utils/paths';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

interface Props extends RouterComponentProps, WrappedComponentProps {
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
import { DropdownWrapper } from 'routes/components/dropdownWrapper';
import { getCurrencySymbol } from 'utils/format';

const Header: React.FC<Props> = ({
  current,
  deleteCostModel,
  deleteError,
  isDeleteProcessing,
  isDialogOpen,
  isWritePermission,
  onSelectTab,
  router,
  setDialogOpen,
  tabRefs,
  tabIndex,
}) => {
  const intl = useIntl();

  const dateTime: any = intl.formatDate(current.updated_timestamp, {
    day: 'numeric',
    hour: 'numeric',
    hour12: false,
    minute: 'numeric',
    month: 'short',
    timeZone: 'UTC',
    timeZoneName: 'short',
    year: 'numeric',
  });

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
          deleteCostModel(current.uuid, 'deleteCostModel', router);
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
            <BreadcrumbItem
              render={() => (
                <Link to={`${formatPath(routes.settings.path)}`}>{intl.formatMessage(messages.costModels)}</Link>
              )}
            />
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
            <DropdownWrapper
              isKebab
              items={[
                {
                  isDisabled: !isWritePermission,
                  onClick: () =>
                    setDialogOpen({
                      isOpen: true,
                      name: 'updateCostModel',
                    }),
                  ...(!isWritePermission && {
                    tooltipProps: {
                      content: intl.formatMessage(messages.readOnlyPermissions),
                      isContentLeftAligned: true,
                    },
                  }),
                  toString: () => intl.formatMessage(messages.edit),
                },
                {
                  isDisabled: !isWritePermission,
                  onClick: () =>
                    setDialogOpen({
                      isOpen: true,
                      name: 'deleteCostModel',
                    }),
                  ...(!isWritePermission && {
                    tooltipProps: {
                      content: intl.formatMessage(messages.readOnlyPermissions),
                      isContentLeftAligned: true,
                    },
                  }),
                  toString: () => intl.formatMessage(messages.delete),
                },
              ]}
              position="right"
            />
          </SplitItem>
        </Split>
        <Content style={styles.currency}>
          <Content component={ContentVariants.dl}>
            <Content component={ContentVariants.dt}>{intl.formatMessage(messages.costModelsLastUpdated)}</Content>
            <Content component={ContentVariants.dd}>{dateTime}</Content>
            <Content component={ContentVariants.dt}>{intl.formatMessage(messages.currency)}</Content>
            <Content component={ContentVariants.dd}>
              {intl.formatMessage(messages.currencyOptions, {
                [current.currency]: getCurrencySymbol(current.currency),
                units: current.currency,
              })}
            </Content>
          </Content>
        </Content>
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

export default withRouter(
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
