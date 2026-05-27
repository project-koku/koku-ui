import { Alert, Content, ContentVariants, Stack, StackItem, Title, TitleSizes } from '@patternfly/react-core';
import type { PriceListData } from 'api/priceList';
import type { Provider } from 'api/providers';
import type { AxiosError } from 'axios';
import { useIsGpuToggleEnabled } from 'components/featureToggle';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { getCurrencyLabel } from 'routes/components/currency';
import { WarningIcon } from 'routes/settings/costModelsDeprecated/components/warningIcon';
import type { RootState } from 'store';
import type { FetchStatus } from 'store/common';
import { costModelsSelectors } from 'store/costModels';

import { styles } from './reviewDetails.styles';

interface ReviewDetailsOwnProps {
  currency?: string;
  description?: string;
  distributeGpu?: boolean;
  distributeNetwork?: boolean;
  distributePlatformUnallocated?: boolean;
  distributeStorage?: boolean;
  distributeWorkerUnallocated?: boolean;
  distributionType?: string;
  isDiscount?: boolean;
  markup?: string;
  name?: string;
  priceLists?: PriceListData[];
  sources?: Provider[];
  sourceType?: string;
}

interface ReviewDetailsStateProps {
  costModelsAddError?: AxiosError;
  costModelsAddStatus?: FetchStatus;
}

type ReviewDetailsProps = ReviewDetailsOwnProps;

const ReviewDetails: React.FC<ReviewDetailsProps> = ({
  currency,
  description,
  distributeGpu,
  distributeNetwork,
  distributePlatformUnallocated,
  distributeStorage,
  distributeWorkerUnallocated,
  distributionType,
  isDiscount,
  markup,
  name,
  priceLists,
  sources,
  sourceType,
}: ReviewDetailsProps) => {
  const intl = useIntl();
  const isGpuToggleEnabled = useIsGpuToggleEnabled();

  const { costModelsAddError } = useMapToProps();

  return (
    <>
      {costModelsAddError && <Alert variant="danger" title={`${costModelsAddError}`} />}
      <Stack hasGutter>
        <StackItem>
          <Title headingLevel="h2" size={TitleSizes.xl}>
            {intl.formatMessage(messages.costModelsWizardStepsReview)}
          </Title>
        </StackItem>
        <StackItem>
          <Content>
            <Content component="p">
              {intl.formatMessage(messages.costModelsWizardReviewStatusSubDetails, {
                create: <strong>{intl.formatMessage(messages.create)}</strong>,
                back: <strong>{intl.formatMessage(messages.back)}</strong>,
              })}
            </Content>
          </Content>
        </StackItem>
        <StackItem>
          <Content>
            <Content component={ContentVariants.dl}>
              <Content component={ContentVariants.dt}>{intl.formatMessage(messages.names, { count: 1 })}</Content>
              <Content component={ContentVariants.dd}>{name}</Content>
              <Content component={ContentVariants.dt}>{intl.formatMessage(messages.description)}</Content>
              <Content component={ContentVariants.dd}>{description}</Content>
              <Content component={ContentVariants.dt}>{intl.formatMessage(messages.currency)}</Content>
              <Content component={ContentVariants.dd}>{getCurrencyLabel(currency)}</Content>
              {sourceType === 'OCP' && (
                <>
                  <Content component={ContentVariants.dt}>{intl.formatMessage(messages.assignedPriceLists)}</Content>
                  <Content component={ContentVariants.dd}>
                    <Content component={ContentVariants.ol}>
                      {priceLists?.map(item => (
                        <Content component={ContentVariants.li} key={item.uuid}>
                          {item.name}
                        </Content>
                      ))}
                    </Content>
                  </Content>
                </>
              )}
              <Content component={ContentVariants.dt} style={styles.markup}>
                {intl.formatMessage(messages.costModelsWizardReviewMarkDiscount)}
              </Content>
              <Content component={ContentVariants.dd}>
                {intl.formatMessage(messages.percent, { value: isDiscount ? '-' + markup : markup })}
              </Content>
              {sourceType === 'OCP' && (
                <>
                  <Content component={ContentVariants.dt}>{intl.formatMessage(messages.costDistribution)}</Content>
                  <Content component={ContentVariants.dd}>
                    {intl.formatMessage(messages.distributionTypeDesc, { type: distributionType })}
                  </Content>
                  <Content component={ContentVariants.dd}>
                    {intl.formatMessage(messages.distributePlatformCosts, {
                      value: distributePlatformUnallocated,
                    })}
                  </Content>
                  <Content component={ContentVariants.dd}>
                    {intl.formatMessage(messages.distributeUnallocatedCapacity, {
                      value: distributeWorkerUnallocated,
                    })}
                  </Content>
                  <Content component={ContentVariants.dd}>
                    {intl.formatMessage(messages.distributeCosts, {
                      value: distributeNetwork,
                      type: 'network',
                    })}
                  </Content>
                  <Content component={ContentVariants.dd}>
                    {intl.formatMessage(messages.distributeCosts, {
                      value: distributeStorage,
                      type: 'storage',
                    })}
                  </Content>
                  {isGpuToggleEnabled && (
                    <Content component={ContentVariants.dd}>
                      {intl.formatMessage(messages.distributeGpuCosts, { value: distributeGpu })}
                    </Content>
                  )}
                </>
              )}
              <Content component={ContentVariants.dt}>
                {intl.formatMessage(messages.costModelsAssignSources, { count: 2 })}{' '}
                {sources.find(src => src.cost_models?.length > 0) && (
                  <WarningIcon text={intl.formatMessage(messages.costModelsWizardWarningSources)} />
                )}
              </Content>
              <Content component={ContentVariants.dd}>{sources.map(r => r.name).join(', ')}</Content>
            </Content>
          </Content>
        </StackItem>
      </Stack>
    </>
  );
};

const useMapToProps = (): ReviewDetailsStateProps => {
  const costModelsAddError = useSelector((state: RootState) => costModelsSelectors.selectCostModelsAddError(state));
  const costModelsAddStatus = useSelector((state: RootState) => costModelsSelectors.selectCostModelsAddStatus(state));

  return {
    costModelsAddError,
    costModelsAddStatus,
  };
};

export { ReviewDetails };
