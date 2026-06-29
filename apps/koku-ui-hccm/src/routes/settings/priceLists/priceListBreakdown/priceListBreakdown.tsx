import { PageSection, Tab, TabContent, Tabs, TabTitleText } from '@patternfly/react-core';
import type { PriceListData } from 'api/priceList';
import { PriceListType } from 'api/priceList';
import type { Query } from 'api/queries/query';
import { getQuery } from 'api/queries/query';
import { getUserAccessQuery } from 'api/queries/userAccessQuery';
import { type UserAccess, UserAccessType } from 'api/userAccess';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { type RefObject, useCallback, useState } from 'react';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { routes } from 'routes';
import { NotAuthorized } from 'routes/components/page/notAuthorized';
import { NotAvailable } from 'routes/components/page/notAvailable';
import { LoadingState } from 'routes/components/state/loadingState';
import { usePriceListNotifications } from 'routes/settings/priceLists/utils';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { priceListActions, priceListSelectors } from 'store/priceLists';
import { userAccessQuery, userAccessSelectors } from 'store/userAccess';
import { formatPath } from 'utils/paths';
import { hasCostModelAccess, hasCostModelWritePermission } from 'utils/userAccess';

import { CostModels } from './costModels';
import { styles } from './priceListBreakdown.styles';
import { PriceListBreakdownHeader } from './priceListBreakdownHeader';
import { Rate } from './rates';

interface AvailableTab {
  contentRef: RefObject<any>;
  tab: PriceListBreakdownTab;
}

export interface PriceListBreakdownOwnProps {
  // TBD...
}

export interface PriceListBreakdownMapProps {
  query?: Query;
}

export interface PriceListBreakdownStateProps {
  priceList?: PriceListData;
  priceListError?: AxiosError;
  priceListFetchStatus?: FetchStatus;
  userAccess: UserAccess;
  userAccessError: AxiosError;
  userAccessFetchStatus: FetchStatus;
  userAccessQueryString: string;
}

type PriceListBreakdownProps = PriceListBreakdownOwnProps;

const baseQuery: Query = {
  filter_by: {},
};

const enum PriceListBreakdownTab {
  costModels = 'costModels',
  rates = 'rates',
}

const getIdKeyForTab = (tab: PriceListBreakdownTab) => {
  switch (tab) {
    case PriceListBreakdownTab.costModels:
      return 'costModels';
    case PriceListBreakdownTab.rates:
      return 'rates';
  }
};

const PriceListBreakdown: React.FC<PriceListBreakdownProps> = () => {
  const intl = useIntl();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTabKey, setActiveTabKey] = useState(0);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [query, setQuery] = useState<Query>({ ...baseQuery });

  const { priceList, priceListError, priceListFetchStatus, userAccess, userAccessFetchStatus } = useMapToProps({
    query,
  });

  const isLoading = priceListFetchStatus === FetchStatus.inProgress;

  const canAccess = () => {
    return hasCostModelAccess(userAccess);
  };

  const canWrite = () => {
    return hasCostModelWritePermission(userAccess);
  };

  // Force update
  const forceUpdate = useCallback(() => {
    setQuery(prev => ({ ...prev }));
  }, []);

  const getAvailableTabs = () => {
    const availableTabs: AvailableTab[] = [
      {
        contentRef: React.createRef(),
        tab: PriceListBreakdownTab.rates,
      },
      {
        contentRef: React.createRef(),
        tab: PriceListBreakdownTab.costModels,
      },
    ];
    return availableTabs;
  };

  const getTab = (tab: PriceListBreakdownTab, contentRef, index: number) => {
    return (
      <Tab
        eventKey={index}
        key={`${getIdKeyForTab(tab)}-tab`}
        tabContentId={`tab-${index}`}
        tabContentRef={contentRef}
        title={<TabTitleText>{getTabTitle(tab)}</TabTitleText>}
      />
    );
  };

  const getTabContent = (availableTabs: AvailableTab[]) => {
    return availableTabs.map((val, index) => {
      return (
        <TabContent
          eventKey={index}
          key={`${getIdKeyForTab(val.tab)}-tabContent`}
          id={`tab-${index}`}
          ref={val.contentRef as any}
        >
          {getTabItem(val.tab, index)}
        </TabContent>
      );
    });
  };

  const getTabItem = (tab: PriceListBreakdownTab, index: number) => {
    const emptyTab = <></>; // Lazily load tabs

    if (activeTabKey !== index) {
      return emptyTab;
    }

    const currentTab = getIdKeyForTab(tab);
    if (currentTab === PriceListBreakdownTab.costModels) {
      return <CostModels />;
    } else if (currentTab === PriceListBreakdownTab.rates) {
      return <Rate canWrite={canWrite()} onAdd={forceUpdate} onDelete={forceUpdate} onEdit={handleOnEdit} />;
    } else {
      return emptyTab;
    }
  };

  const getTabs = (availableTabs: AvailableTab[]) => {
    return (
      <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
        {availableTabs.map((val, index) => getTab(val.tab, val.contentRef, index))}
      </Tabs>
    );
  };

  const getTabTitle = (tab: PriceListBreakdownTab) => {
    if (tab === PriceListBreakdownTab.costModels) {
      return intl.formatMessage(messages.assignedCostModels);
    } else if (tab === PriceListBreakdownTab.rates) {
      return intl.formatMessage(messages.rates);
    }
  };

  // Handlers

  const handleOnAlertClose = () => {
    setIsRecalculating(false);
  };

  const handleOnDeletePriceList = () => {
    navigate(`${formatPath(routes.settings.path)}`, {
      replace: true,
      state: {
        ...(location?.state || {}),
        settingsState: {
          activeTabKey: 1,
        },
      },
    });
  };

  const handleOnEdit = () => {
    setIsRecalculating(true);
    forceUpdate();
  };

  const handleTabClick = (_event, tabIndex) => {
    if (activeTabKey !== tabIndex) {
      setActiveTabKey(tabIndex);
    }
  };

  const availableTabs = getAvailableTabs();

  if (userAccessFetchStatus === FetchStatus.inProgress) {
    return (
      <LoadingState
        body={intl.formatMessage(messages.userAccessLoadingStateDesc)}
        heading={intl.formatMessage(messages.userAccessLoadingStateTitle)}
      />
    );
  }
  if (!canAccess()) {
    return <NotAuthorized pathname={formatPath(routes.priceListBreakdown.basePath)} />;
  }
  if (priceListError) {
    return <NotAvailable />;
  }
  return (
    <>
      <PageSection style={styles.headerContainer}>
        <header>
          <PriceListBreakdownHeader
            canWrite={canWrite()}
            isDisabled={isLoading}
            isRecalculating={isRecalculating && priceList?.assigned_cost_model_count > 0}
            onAlertClose={handleOnAlertClose}
            onDelete={handleOnDeletePriceList}
            onDeprecate={forceUpdate}
            onDuplicate={forceUpdate}
            onEdit={handleOnEdit}
            priceList={priceList}
          />
          <div style={styles.tabs}>{getTabs(availableTabs)}</div>
        </header>
      </PageSection>
      <PageSection>{getTabContent(availableTabs)}</PageSection>
    </>
  );
};

const useMapToProps = ({ query }: PriceListBreakdownMapProps): PriceListBreakdownStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const { uuid } = useParams();

  const priceListQuery = {
    filter_by: query.filter_by,
  };
  const priceListQueryString = getQuery(priceListQuery);
  const priceList = useSelector((state: RootState) =>
    priceListSelectors.selectPriceList(state, PriceListType.priceList, priceListQueryString)
  ) as PriceListData;
  const priceListError = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListError(state, PriceListType.priceList, priceListQueryString)
  );
  const priceListFetchStatus = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListFetchStatus(state, PriceListType.priceList, priceListQueryString)
  );

  useEffect(() => {
    if (!priceListError && priceListFetchStatus !== FetchStatus.inProgress && uuid) {
      dispatch(priceListActions.fetchPriceList(PriceListType.priceList, uuid, priceListQueryString));
    }
  }, [dispatch, priceListError, priceListQueryString, query, uuid]);

  // User access

  const userAccessQueryString = getUserAccessQuery(userAccessQuery);
  const userAccess = useSelector((state: RootState) =>
    userAccessSelectors.selectUserAccess(state, UserAccessType.all, userAccessQueryString)
  );
  const userAccessError = useSelector((state: RootState) =>
    userAccessSelectors.selectUserAccessError(state, UserAccessType.all, userAccessQueryString)
  );
  const userAccessFetchStatus = useSelector((state: RootState) =>
    userAccessSelectors.selectUserAccessFetchStatus(state, UserAccessType.all, userAccessQueryString)
  );

  // Notifications
  usePriceListNotifications();

  return {
    priceList,
    priceListError,
    priceListFetchStatus,
    userAccess,
    userAccessError,
    userAccessFetchStatus,
    userAccessQueryString,
  };
};

export default PriceListBreakdown;
