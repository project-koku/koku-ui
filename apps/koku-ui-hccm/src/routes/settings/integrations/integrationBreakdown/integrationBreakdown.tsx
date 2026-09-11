import { ScalprumComponent } from '@scalprum/react-core';
import { getUserAccessQuery } from 'api/queries/userAccessQuery';
import type { UserAccess } from 'api/userAccess';
import { UserAccessType } from 'api/userAccess';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { routes } from 'routes';
import { NotAuthorized } from 'routes/components/page/notAuthorized';
import { LoadingState } from 'routes/components/state/loadingState';
import { SettingsTab } from 'routes/settings/settings';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { userAccessQuery, userAccessSelectors } from 'store/userAccess';
import { formatPath } from 'utils/paths';
import { hasSourcesAccess, hasSourcesWritePermission } from 'utils/userAccess';

interface IntegrationBreakdownStateProps {
  userAccess: UserAccess;
  userAccessError: AxiosError;
  userAccessFetchStatus: FetchStatus;
}

const IntegrationBreakdown: React.FC = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { uuid } = useParams();
  const { userAccess, userAccessFetchStatus } = useMapToProps();

  const handleBack = () => {
    navigate(formatPath(routes.settings.path), {
      state: {
        settingsState: {
          activeTab: SettingsTab.sources,
        },
      },
    });
  };

  if (userAccessFetchStatus === FetchStatus.inProgress) {
    return (
      <LoadingState
        body={intl.formatMessage(messages.userAccessLoadingStateDesc)}
        heading={intl.formatMessage(messages.userAccessLoadingStateTitle)}
      />
    );
  }

  if (!hasSourcesAccess(userAccess) || !uuid) {
    return <NotAuthorized pathname={formatPath(routes.integrationBreakdown.basePath)} />;
  }

  return (
    <ScalprumComponent
      scope="sources"
      module="./SourceDetail"
      fallback={<LoadingState />}
      {...({
        canWrite: hasSourcesWritePermission(userAccess),
        onBack: handleBack,
        uuid,
      } as Record<string, unknown>)}
    />
  );
};

const useMapToProps = (): IntegrationBreakdownStateProps => {
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
  };
};

export default IntegrationBreakdown;
