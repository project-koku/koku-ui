import './clusterInfoContent.scss';

import { Content, ContentVariants, Icon } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import type { Providers } from 'api/providers';
import { ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { routes } from 'routes';
import { NotAvailable } from 'routes/components/page/notAvailable';
import { LoadingState } from 'routes/components/state/loadingState';
import { CloudIntegration } from 'routes/details/ocpBreakdown/clusterInfo/components/cloudIntegration';
import { filterProviders } from 'routes/utils/providers';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { providersQuery, providersSelectors } from 'store/providers';
import { formatPath, getReleasePath } from 'utils/paths';

import { styles } from './clusterInfo.styles';

interface ClusterInfoContentOwnProps {
  clusterId?: string;
}

interface ClusterInfoContentStateProps {
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  providersQueryString: string;
}

type ClusterInfoContentProps = ClusterInfoContentOwnProps;

const ClusterInfoContent: React.FC<ClusterInfoContentProps> = ({ clusterId }: ClusterInfoContentProps) => {
  const intl = useIntl();

  const { providers, providersError, providersFetchStatus } = useMapToProps();

  if (providersError) {
    return <NotAvailable />;
  }

  if (providersFetchStatus === FetchStatus.inProgress) {
    return (
      <div style={styles.loading}>
        <LoadingState />
      </div>
    );
  }

  // Filter OCP providers to skip an extra API request
  const ocpProviders = filterProviders(providers, ProviderType.ocp);
  const clusterProvider = ocpProviders?.data?.find(val => val.authentication?.credentials?.cluster_id === clusterId);
  const cloudProvider = providers?.data?.find(val => val.uuid === clusterProvider?.infrastructure?.uuid);

  const release = getReleasePath();

  return (
    <Content className="textContentOverride">
      <Content component={ContentVariants.h3}>{intl.formatMessage(messages.clusterId)}</Content>
      <Content component="ul" isPlainList>
        <Content component="li">
          <span style={styles.spacingRight}>{clusterId}</span>
          <a href={`${release}/openshift/details/${clusterId}`}>{intl.formatMessage(messages.ocpClusterDetails)}</a>
        </Content>
      </Content>
      <Content component={ContentVariants.h3}>{intl.formatMessage(messages.metricsOperatorVersion)}</Content>
      <Content component="ul" isPlainList>
        <Content component="li">
          <span style={styles.spacingRight}>{clusterProvider?.additional_context?.operator_version}</span>
          {clusterProvider?.additional_context?.operator_update_available && (
            <>
              <Icon status="warning">
                <ExclamationTriangleIcon />
              </Icon>
              <span style={styles.updateAvailable}>{intl.formatMessage(messages.updateAvailable)}</span>
            </>
          )}
        </Content>
      </Content>
      {clusterProvider && (
        <>
          <Content component={ContentVariants.h3}>{intl.formatMessage(messages.redHatIntegration)}</Content>
          <Content component="ul" isPlainList>
            <Content component="li">
              <span style={styles.spacingRight}>{intl.formatMessage(messages.source, { value: 'ocp' })}</span>
              <a href={`${release}/settings/integrations/detail/${clusterProvider.id}`}>{clusterProvider.name}</a>
            </Content>
            <Content component="li">
              {clusterProvider?.cost_models?.length ? (
                clusterProvider.cost_models.map((cm, index) => (
                  <React.Fragment key={index}>
                    <span style={styles.spacingRight}>{intl.formatMessage(messages.costModel)}</span>
                    <a href={`${formatPath(routes.costModel.basePath, true)}/${cm.uuid}`}>{cm.name}</a>
                  </React.Fragment>
                ))
              ) : (
                <a href={formatPath(routes.settings.path, true)}>{intl.formatMessage(messages.assignCostModel)}</a>
              )}
            </Content>
          </Content>
          {cloudProvider && <CloudIntegration provider={cloudProvider} />}
        </>
      )}
    </Content>
  );
};

const useMapToProps = (): ClusterInfoContentStateProps => {
  // PermissionsWrapper has already made an API request
  const providersQueryString = getProvidersQuery(providersQuery);
  const providers = useSelector((state: RootState) =>
    providersSelectors.selectProviders(state, ProviderType.all, providersQueryString)
  );
  const providersError = useSelector((state: RootState) =>
    providersSelectors.selectProvidersError(state, ProviderType.all, providersQueryString)
  );
  const providersFetchStatus = useSelector((state: RootState) =>
    providersSelectors.selectProvidersFetchStatus(state, ProviderType.all, providersQueryString)
  );

  return {
    providers,
    providersError,
    providersFetchStatus,
    providersQueryString,
  };
};

export { ClusterInfoContent };
