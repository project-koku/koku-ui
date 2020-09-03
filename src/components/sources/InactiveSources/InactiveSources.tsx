import { Alert, AlertActionCloseButton } from '@patternfly/react-core';
import { Providers, ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { AxiosError } from 'axios';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import {
  awsProvidersQuery,
  azureProvidersQuery,
  ocpProvidersQuery,
  providersActions,
  providersSelectors,
} from 'store/providers';
import { getReleasePath } from 'utils/pathname';

interface InactiveSourcesOwnProps {
  isOpen?: boolean;
  sources?: any[];
}

interface InactiveSourcesStateProps {
  awsProviders: Providers;
  awsProvidersError: AxiosError;
  awsProvidersFetchStatus: FetchStatus;
  awsProvidersQueryString: string;
  azureProviders: Providers;
  azureProvidersError: AxiosError;
  azureProvidersFetchStatus: FetchStatus;
  azureProvidersQueryString: string;
  ocpProviders: Providers;
  ocpProvidersError: AxiosError;
  ocpProvidersFetchStatus: FetchStatus;
  ocpProvidersQueryString: string;
}

interface InactiveSourcesDispatchProps {
  fetchProviders: typeof providersActions.fetchProviders;
}

interface InactiveSourcesState {
  isClosed: boolean;
}

type InactiveSourcesProps = InactiveSourcesOwnProps &
  InactiveSourcesDispatchProps &
  InactiveSourcesStateProps &
  InjectedTranslateProps;

class InactiveSourcesBase extends React.Component<InactiveSourcesProps> {
  protected defaultState: InactiveSourcesState = {
    isClosed: false,
  };
  public state: InactiveSourcesState = { ...this.defaultState };

  public componentDidMount() {
    const {
      awsProviders,
      awsProvidersFetchStatus,
      azureProviders,
      azureProvidersFetchStatus,
      ocpProviders,
      ocpProvidersFetchStatus,
    } = this.props;

    if (!awsProviders && awsProvidersFetchStatus !== FetchStatus.inProgress) {
      this.fetchAwsProviders();
    }
    if (
      !azureProviders &&
      azureProvidersFetchStatus !== FetchStatus.inProgress
    ) {
      this.fetchAzureProviders();
    }
    if (!ocpProviders && ocpProvidersFetchStatus !== FetchStatus.inProgress) {
      this.fetchOcpProviders();
    }
  }

  public componentDidUpdate(prevProps: InactiveSourcesProps) {
    const {
      awsProviders,
      awsProvidersError,
      awsProvidersFetchStatus,
      azureProviders,
      azureProvidersError,
      azureProvidersFetchStatus,
      ocpProviders,
      ocpProvidersError,
      ocpProvidersFetchStatus,
    } = this.props;

    if (
      !awsProviders &&
      awsProvidersFetchStatus !== FetchStatus.inProgress &&
      !awsProvidersError
    ) {
      this.fetchAwsProviders();
    }
    if (
      !azureProviders &&
      azureProvidersFetchStatus !== FetchStatus.inProgress &&
      !azureProvidersError
    ) {
      this.fetchAzureProviders();
    }
    if (
      !ocpProviders &&
      ocpProvidersFetchStatus !== FetchStatus.inProgress &&
      !ocpProvidersError
    ) {
      this.fetchOcpProviders();
    }
  }

  private fetchAwsProviders = () => {
    const { awsProvidersQueryString, fetchProviders } = this.props;
    fetchProviders(ProviderType.aws, awsProvidersQueryString);
  };

  private fetchAzureProviders = () => {
    const { azureProvidersQueryString, fetchProviders } = this.props;
    fetchProviders(ProviderType.azure, azureProvidersQueryString);
  };

  private fetchOcpProviders = () => {
    const { fetchProviders, ocpProvidersQueryString } = this.props;
    fetchProviders(ProviderType.ocp, ocpProvidersQueryString);
  };

  private getInactiveSourceNames = () => {
    const { awsProviders, azureProviders, ocpProviders } = this.props;

    const sources = [];

    if (awsProviders && awsProviders.data) {
      awsProviders.data.map(data => {
        if (data.active !== true) {
          sources.push(data.name);
        }
      });
    }
    if (azureProviders && azureProviders.data) {
      azureProviders.data.map(data => {
        if (data.active !== true) {
          sources.push(data.name);
        }
      });
    }
    if (ocpProviders && ocpProviders.data) {
      ocpProviders.data.map(data => {
        if (data.active !== true) {
          sources.push(data.name);
        }
      });
    }
    return sources;
  };

  private getInactiveSources = (names: string[]) => {
    if (names.length < 2) {
      return null;
    }
    return (
      <p>
        {names.map((name, index) => {
          if (index === names.length - 1) {
            return name;
          } else {
            return `${name}, `;
          }
        })}
      </p>
    );
  };

  private handleOnClose = () => {
    this.setState({ isClosed: true });
  };

  public render() {
    const { t } = this.props;
    const { isClosed } = this.state;

    const release = getReleasePath();
    const names = this.getInactiveSourceNames();
    const title =
      names.length === 1
        ? t('inactive_sources.title', { value: names[0] })
        : t('inactive_sources.title_multiple');

    if (names.length === 0 || isClosed) {
      return null;
    }
    return (
      <Alert
        isInline
        variant="danger"
        title={title}
        actionClose={<AlertActionCloseButton onClose={this.handleOnClose} />}
        actionLinks={
          <React.Fragment>
            <a href={`${release}/settings/sources`}>
              {t('inactive_sources.go_to_sources')}
            </a>
          </React.Fragment>
        }
      >
        {this.getInactiveSources(names)}
      </Alert>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  InactiveSourcesOwnProps,
  InactiveSourcesStateProps
>((state, props) => {
  const awsProvidersQueryString = getProvidersQuery(awsProvidersQuery);
  const awsProviders = providersSelectors.selectProviders(
    state,
    ProviderType.aws,
    awsProvidersQueryString
  );
  const awsProvidersError = providersSelectors.selectProvidersError(
    state,
    ProviderType.aws,
    awsProvidersQueryString
  );
  const awsProvidersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.aws,
    awsProvidersQueryString
  );

  const azureProvidersQueryString = getProvidersQuery(azureProvidersQuery);
  const azureProviders = providersSelectors.selectProviders(
    state,
    ProviderType.azure,
    azureProvidersQueryString
  );
  const azureProvidersError = providersSelectors.selectProvidersError(
    state,
    ProviderType.azure,
    azureProvidersQueryString
  );
  const azureProvidersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.azure,
    azureProvidersQueryString
  );

  const ocpProvidersQueryString = getProvidersQuery(ocpProvidersQuery);
  const ocpProviders = providersSelectors.selectProviders(
    state,
    ProviderType.ocp,
    ocpProvidersQueryString
  );
  const ocpProvidersError = providersSelectors.selectProvidersError(
    state,
    ProviderType.ocp,
    ocpProvidersQueryString
  );
  const ocpProvidersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.ocp,
    ocpProvidersQueryString
  );

  // Testing...
  //
  // const awsProviders = {
  //   meta: {
  //     count: 2,
  //   },
  //   links: {
  //     first: '/api/cost-management/v1/sources/?limit=10&offset=0&type=AWS',
  //     next: null,
  //     previous: null,
  //     last: '/api/cost-management/v1/sources/?limit=10&offset=0&type=AWS',
  //   },
  //   data: [
  //     {
  //       id: 1578,
  //       uuid: '9721053f-0874-4c78-8ac6-420fffbac3de',
  //       name: 'AWS for OpenShift',
  //       source_type: 'AWS',
  //       authentication: {
  //         credentials: {
  //           role_arn: 'arn:aws:iam::589173575009:role/NisePopulatorAccessRole',
  //         },
  //       },
  //       billing_source: {
  //         data_source: {
  //           bucket: 'nisepopulator',
  //         },
  //       },
  //       provider_linked: true,
  //       active: false,
  //       infrastructure: 'Unknown',
  //       cost_models: [
  //         {
  //           name: 'ricky bobby',
  //           uuid: '5f4c21bf-f440-43c7-8e4f-9ae1020ef46c',
  //         },
  //       ],
  //     },
  //     {
  //       id: 1532,
  //       uuid: 'bb152a97-319c-4cc3-853f-b70d25585b31',
  //       name: 'AWS Red Hat Cost Management',
  //       source_type: 'AWS',
  //       authentication: {
  //         credentials: {
  //           role_arn: 'arn:aws:iam::589173575009:role/CostManagement',
  //         },
  //       },
  //       billing_source: {
  //         data_source: {
  //           bucket: 'cost-usage-bucket',
  //         },
  //       },
  //       provider_linked: true,
  //       active: true,
  //       infrastructure: 'Unknown',
  //       cost_models: [],
  //     },
  //   ],
  // } as any;
  //
  // const azureProviders = {
  //   meta: {
  //     count: 2,
  //   },
  //   links: {
  //     first: '/api/cost-management/v1/sources/?limit=10&offset=0&type=AZURE',
  //     next: null,
  //     previous: null,
  //     last: '/api/cost-management/v1/sources/?limit=10&offset=0&type=AZURE',
  //   },
  //   data: [
  //     {
  //       id: 1579,
  //       uuid: '493aef6b-9231-4859-b123-649a93727884',
  //       name: 'Azure for OpenShift',
  //       source_type: 'Azure',
  //       authentication: {
  //         credentials: {
  //           client_id: '5d4eb34d-43c7-4b06-8257-1cb599b48d1e',
  //           tenant_id: 'ae4f8f55-f1a8-4080-9aa8-10779e4113e7',
  //           subscription_id: '2639de71-ca37-4a17-a104-17665a50e7fc',
  //         },
  //       },
  //       billing_source: {
  //         data_source: {
  //           resource_group: 'RG1',
  //           storage_account: 'nisepopulator',
  //         },
  //       },
  //       provider_linked: true,
  //       active: false,
  //       infrastructure: 'Unknown',
  //       cost_models: [],
  //     },
  //     {
  //       id: 1524,
  //       uuid: 'e1c91997-d08e-4ba0-b7b6-6deac80f7e58',
  //       name: 'Azure Red Hat Cost Management',
  //       source_type: 'Azure',
  //       authentication: {
  //         credentials: {
  //           client_id: 'f36c251e-ad4a-4447-bfbb-fc9bb10f259a',
  //           tenant_id: 'ae4f8f55-f1a8-4080-9aa8-10779e4113e7',
  //           subscription_id: '2639de71-ca37-4a17-a104-17665a50e7fc',
  //         },
  //       },
  //       billing_source: {
  //         data_source: {
  //           resource_group: 'RG1',
  //           storage_account: 'mysa1',
  //         },
  //       },
  //       provider_linked: true,
  //       active: true,
  //       infrastructure: 'Unknown',
  //       cost_models: [],
  //     },
  //   ],
  // } as any;
  //
  // const ocpProviders = {
  //   meta: {
  //     count: 4,
  //   },
  //   links: {
  //     first: '/api/cost-management/v1/sources/?limit=10&offset=0&type=OCP',
  //     next: null,
  //     previous: null,
  //     last: '/api/cost-management/v1/sources/?limit=10&offset=0&type=OCP',
  //   },
  //   data: [
  //     {
  //       id: 7133,
  //       uuid: '203b0fcf-f93f-4cfd-b3ba-3b6416527c6b',
  //       name: 'mskarbek - ocp',
  //       source_type: 'OCP',
  //       authentication: {
  //         credentials: {
  //           cluster_id: 'cluster_id',
  //         },
  //       },
  //       billing_source: {},
  //       provider_linked: true,
  //       active: true,
  //       infrastructure: 'Unknown',
  //       cost_models: [],
  //     },
  //     {
  //       id: 1542,
  //       uuid: 'a1f6a740-dd37-4916-b842-e45fac9db916',
  //       name: 'OCP 4.3 on OpenStack',
  //       source_type: 'OCP',
  //       authentication: {
  //         credentials: {
  //           cluster_id: 'a94ea9bc-9e4f-4b91-89c2-c7099ec08427',
  //         },
  //       },
  //       billing_source: {},
  //       provider_linked: true,
  //       active: true,
  //       infrastructure: 'Unknown',
  //       cost_models: [
  //         {
  //           name: 'Openstack',
  //           uuid: '3a1a99dc-7ad9-4e47-99d5-f246fdc1e0a3',
  //         },
  //       ],
  //     },
  //     {
  //       id: 1576,
  //       uuid: 'e422a8ff-b94a-4271-8c1f-95b620586c48',
  //       name: 'OpenShift on AWS',
  //       source_type: 'OCP',
  //       authentication: {
  //         credentials: {
  //           cluster_id: '8a3e59b7-23a8-4ed1-b1cf-afd5afea54b9',
  //         },
  //       },
  //       billing_source: {},
  //       provider_linked: true,
  //       active: true,
  //       infrastructure: 'AWS',
  //       cost_models: [],
  //     },
  //     {
  //       id: 1577,
  //       uuid: '31b066d4-a5da-4659-ade4-aec29fd9a86d',
  //       name: 'OpenShift on Azure',
  //       source_type: 'OCP',
  //       authentication: {
  //         credentials: {
  //           cluster_id: 'eb93b259-1369-4f90-88ce-e68c6ba879a9',
  //         },
  //       },
  //       billing_source: {},
  //       provider_linked: true,
  //       active: true,
  //       infrastructure: 'Azure',
  //       cost_models: [],
  //     },
  //   ],
  // } as any;

  return {
    awsProviders,
    awsProvidersError,
    awsProvidersFetchStatus,
    awsProvidersQueryString,
    azureProviders,
    azureProvidersError,
    azureProvidersFetchStatus,
    azureProvidersQueryString,
    ocpProviders,
    ocpProvidersError,
    ocpProvidersFetchStatus,
    ocpProvidersQueryString,
  };
});

const mapDispatchToProps: InactiveSourcesDispatchProps = {
  fetchProviders: providersActions.fetchProviders,
};

const InactiveSources = translate()(
  connect(mapStateToProps, mapDispatchToProps)(InactiveSourcesBase)
);

export { InactiveSources, InactiveSourcesProps };
