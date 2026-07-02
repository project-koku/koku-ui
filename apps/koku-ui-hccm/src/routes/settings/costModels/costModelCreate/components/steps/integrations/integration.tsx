import { Content, ContentVariants, Stack, StackItem, Title, TitleSizes } from '@patternfly/react-core';
import type { Provider } from 'api/providers';
import { type Providers, ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import type { IntegrationContentHandle } from 'routes/settings/costModels/costModelBreakdown/integrations/components';
import { IntegrationContent } from 'routes/settings/costModels/costModelBreakdown/integrations/components';
import { filterProviders } from 'routes/utils/providers';
import type { RootState } from 'store';
import type { FetchStatus } from 'store/common';
import { providersQuery, providersSelectors } from 'store/providers';

interface IntegrationOwnProps {
  canWrite?: boolean;
  contentRef?: React.RefObject<IntegrationContentHandle>;
  onAdd?: (sources: Provider[]) => void;
  sources?: Provider[];
  sourceType: ProviderType;
}

interface IntegrationStateProps {
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
}

type IntegrationProps = IntegrationOwnProps;

const Integration: React.FC<IntegrationProps> = ({
  canWrite,
  contentRef,
  onAdd,
  sources,
  sourceType,
}: IntegrationProps) => {
  const intl = useIntl();

  const { providers } = useMapToProps();

  return (
    <Stack hasGutter>
      {filterProviders(providers, sourceType)?.meta?.count > 0 && (
        <>
          <StackItem>
            <Title headingLevel="h2" size={TitleSizes.xl}>
              {intl.formatMessage(messages.costModelsWizardSourceTitle)}
            </Title>
          </StackItem>
          <StackItem>
            <Content>
              <Content component="p">{intl.formatMessage(messages.costModelsWizardSourceSubtitle)}</Content>
            </Content>
          </StackItem>
          <StackItem>
            <Content>
              <Content component={ContentVariants.h3}>
                {intl.formatMessage(messages.costModelsWizardSourceCaption, {
                  value: sourceType.toLowerCase(),
                })}
              </Content>
            </Content>
          </StackItem>
        </>
      )}
      <StackItem>
        <IntegrationContent
          canWrite={canWrite}
          onAdd={onAdd}
          ref={contentRef}
          sources={sources}
          sourceType={sourceType}
        />
      </StackItem>
    </Stack>
  );
};

const useMapToProps = (): IntegrationStateProps => {
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
  };
};

export { Integration };
