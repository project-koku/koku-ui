import './costModelCreate.scss';

import { PageSection } from '@patternfly/react-core';
import type { PriceListData } from 'api/priceList';
import { getUserAccessQuery } from 'api/queries/userAccessQuery';
import type { Rate } from 'api/rates';
import type { UserAccess } from 'api/userAccess';
import { UserAccessType } from 'api/userAccess';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { routes } from 'routes';
import { NotAuthorized } from 'routes/components/page/notAuthorized';
import { LoadingState } from 'routes/components/state/loadingState';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { userAccessQuery, userAccessSelectors } from 'store/userAccess';
import { formatPath } from 'utils/paths';
import { hasCostModelAccess, hasCostModelWritePermission } from 'utils/userAccess';

import { CostModelWizard } from './components/create';
import { styles } from './costModelCreate.styles';
import { CostModelCreateHeader } from './costModelCreateHeader';

interface CostModelCreateOwnProps {
  // TBD...
}

interface CostModelCreateStateProps {
  priceListUpdateError?: AxiosError;
  priceListUpdateStatus?: FetchStatus;
  userAccess: UserAccess;
  userAccessError: AxiosError;
  userAccessFetchStatus: FetchStatus;
  userAccessQueryString: string;
}

type CostModelCreateProps = CostModelCreateOwnProps;

const CostModelCreate: React.FC<CostModelCreateProps> = () => {
  const intl = useIntl();
  const location = useLocation();
  const navigate = useNavigate();

  const [isFinish] = useState(false);
  const [priceList, setPriceList] = useState<PriceListData>({});
  const [rates] = useState<Rate[]>([]);

  const { priceListUpdateStatus, priceListUpdateError, userAccess, userAccessFetchStatus } = useMapToProps();

  const canAccess = () => {
    return hasCostModelAccess(userAccess);
  };

  const canWrite = () => {
    return hasCostModelWritePermission(userAccess);
  };

  // Handlers

  const handleOnClose = () => {
    navigateToCostModels();
  };

  const navigateToCostModels = () => {
    navigate(formatPath(routes.settings.path), {
      replace: true,
      state: {
        ...(location?.state || {}),
        settingsState: {
          activeTabKey: 0,
        },
      },
    });
  };

  // Effects

  useEffect(() => {
    setPriceList({
      ...(priceList ?? {}),
      rates,
    });
  }, [rates]);

  useEffect(() => {
    if (isFinish && priceListUpdateStatus === FetchStatus.complete && !priceListUpdateError) {
      navigateToCostModels();
    }
  }, [isFinish, priceListUpdateError, priceListUpdateStatus]);

  if (!(canAccess() && canWrite())) {
    return <NotAuthorized pathname={formatPath(routes.costModelBreakdown.basePath)} />;
  }
  return (
    <>
      <PageSection style={styles.headerContainer}>
        <header>
          <CostModelCreateHeader />
          {userAccessFetchStatus === FetchStatus.inProgress && (
            <LoadingState
              body={intl.formatMessage(messages.userAccessLoadingStateDesc)}
              heading={intl.formatMessage(messages.userAccessLoadingStateTitle)}
            />
          )}
        </header>
      </PageSection>
      <PageSection className="wizardOverride" type="wizard">
        <CostModelWizard canWrite={canWrite()} onClose={handleOnClose} />
      </PageSection>
    </>
  );
};

const useMapToProps = (): CostModelCreateStateProps => {
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
    userAccess,
    userAccessError,
    userAccessFetchStatus,
    userAccessQueryString,
  };
};

export default CostModelCreate;
