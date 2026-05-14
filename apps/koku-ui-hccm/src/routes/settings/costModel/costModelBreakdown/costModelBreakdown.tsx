import { PageSection, Tab, TabContent, Tabs, TabTitleText } from '@patternfly/react-core';
import type { CostModel } from 'api/costModels';
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
import { NotAvailable } from 'routes/components/page/notAvailable';
import { LoadingState } from 'routes/components/state/loadingState';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { userAccessQuery, userAccessSelectors } from 'store/userAccess';
import { formatPath } from 'utils/paths';
import { hasSettingsAccess } from 'utils/userAccess';

import { styles } from './costModelBreakdown.styles';
import { CostModelBreakdownHeader } from './costModelBreakdownHeader';

interface AvailableTab {
  contentRef: RefObject<any>;
  tab: CostModelBreakdownTab;
}

export interface CostModelBreakdownOwnProps {
  // TBD...
}

export interface CostModelBreakdownMapProps {
  query?: Query;
}

export interface CostModelBreakdownStateProps {
  costModel?: CostModel;
  costModelsError?: AxiosError;
  costModelsStatus?: FetchStatus;
  userAccess: UserAccess;
  userAccessError: AxiosError;
  userAccessFetchStatus: FetchStatus;
  userAccessQueryString: string;
}

type CostModelBreakdownProps = CostModelBreakdownOwnProps;

const baseQuery: Query = {
  filter_by: {},
};

const enum CostModelBreakdownTab {
  costCalculations = 'cost_calculations',
  integrations = 'integrations',
  priceLists = 'price_lists',
}

const getIdKeyForTab = (tab: CostModelBreakdownTab) => {
  switch (tab) {
    case CostModelBreakdownTab.priceLists:
      return 'price_lists';
    case CostModelBreakdownTab.costCalculations:
      return 'cost_calculations';
    case CostModelBreakdownTab.integrations:
      return 'integrations';
  }
};

const CostModelBreakdown: React.FC<CostModelBreakdownProps> = () => {
  const intl = useIntl();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTabKey, setActiveTabKey] = useState(0);
  const [query, setQuery] = useState<Query>({ ...baseQuery });

  const { costModel, costModelsError, costModelsStatus, userAccess, userAccessFetchStatus } = useMapToProps({ query });

  const canWrite = () => {
    return hasSettingsAccess(userAccess);
  };

  // Force update
  const forceUpdate = useCallback(() => {
    setQuery(prev => ({ ...prev }));
  }, []);

  const getAvailableTabs = () => {
    const availableTabs: AvailableTab[] = [
      {
        contentRef: React.createRef(),
        tab: CostModelBreakdownTab.priceLists,
      },
      {
        contentRef: React.createRef(),
        tab: CostModelBreakdownTab.costCalculations,
      },
      {
        contentRef: React.createRef(),
        tab: CostModelBreakdownTab.integrations,
      },
    ];
    return availableTabs;
  };

  const getTab = (tab: CostModelBreakdownTab, contentRef, index: number) => {
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

  const getTabItem = (tab: CostModelBreakdownTab, index: number) => {
    const emptyTab = <></>; // Lazily load tabs

    if (activeTabKey !== index) {
      return emptyTab;
    }

    const currentTab = getIdKeyForTab(tab);
    if (currentTab === CostModelBreakdownTab.priceLists) {
      return <span>TBD...</span>;
    } else if (currentTab === CostModelBreakdownTab.costCalculations) {
      return <span>TBD...</span>;
    } else if (currentTab === CostModelBreakdownTab.integrations) {
      return <span>TBD...</span>;
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

  const getTabTitle = (tab: CostModelBreakdownTab) => {
    if (tab === CostModelBreakdownTab.priceLists) {
      return intl.formatMessage(messages.priceList, { count: 2 });
    } else if (tab === CostModelBreakdownTab.costCalculations) {
      return intl.formatMessage(messages.costCalculations);
    } else if (tab === CostModelBreakdownTab.integrations) {
      return intl.formatMessage(messages.sources);
    }
  };

  // Handlers

  const handleOnDelete = () => {
    navigate(`${formatPath(routes.settings.path)}`, {
      replace: true,
      state: {
        ...(location?.state || {}),
        settingsState: {
          activeTabKey: 0,
        },
      },
    });
  };

  const handleTabClick = (_event, tabIndex) => {
    if (activeTabKey !== tabIndex) {
      setActiveTabKey(tabIndex);
    }
  };

  const availableTabs = getAvailableTabs();

  if (costModelsError) {
    return <NotAvailable />;
  }
  return (
    <>
      <PageSection style={styles.headerContainer}>
        <header>
          <CostModelBreakdownHeader
            canWrite={canWrite()}
            costModel={costModel}
            isDisabled={costModelsStatus === FetchStatus.inProgress}
            onAlertClose={forceUpdate}
            onDelete={handleOnDelete}
            onEdit={forceUpdate}
          />
          {userAccessFetchStatus === FetchStatus.inProgress ? (
            <LoadingState />
          ) : (
            <div style={styles.tabs}>{getTabs(availableTabs)}</div>
          )}
        </header>
      </PageSection>
      <PageSection>{getTabContent(availableTabs)}</PageSection>
    </>
  );
};

const useMapToProps = ({ query }: CostModelBreakdownMapProps): CostModelBreakdownStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  const { uuid } = useParams();

  const costModelsQuery = {
    uuid: uuid ?? undefined,
  } as Query;
  const costModelsQueryString = getQuery(costModelsQuery);

  const costModels = useSelector((state: RootState) => costModelsSelectors.costModels(state));
  const costModelsError = useSelector((state: RootState) => costModelsSelectors.error(state));
  const costModelsStatus = useSelector((state: RootState) => costModelsSelectors.status(state));

  useEffect(() => {
    if (!costModelsError && costModelsStatus !== FetchStatus.inProgress) {
      dispatch(costModelsActions.fetchCostModels(costModelsQueryString));
    }
  }, [costModelsQueryString, costModelsError, dispatch, query]);

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

  return {
    costModel: costModels?.data?.[0],
    costModelsError,
    costModelsStatus,
    userAccess,
    userAccessError,
    userAccessFetchStatus,
    userAccessQueryString,
  };
};

export default CostModelBreakdown;
