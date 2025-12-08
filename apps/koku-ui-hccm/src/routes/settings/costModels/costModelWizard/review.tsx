import {
  Alert,
  Button,
  Content,
  ContentVariants,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  Stack,
  StackItem,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { RateTable } from 'routes/settings/costModels/components/rateTable';
import { WarningIcon } from 'routes/settings/costModels/components/warningIcon';
import { createMapStateToProps } from 'store/common';
import { FeatureToggleSelectors } from 'store/featureToggle';

import { CostModelContext } from './context';

const ReviewSuccessBase: React.FC<WrappedComponentProps> = ({ intl }) => (
  <CostModelContext.Consumer>
    {({ onClose, name }) => (
      <EmptyState headingLevel="h2" titleText={intl.formatMessage(messages.costModelsWizardReviewStatusTitle)}>
        <EmptyStateBody>
          {intl.formatMessage(messages.costModelsWizardReviewStatusSubTitle, { value: name })}
        </EmptyStateBody>
        <EmptyStateFooter>
          <EmptyStateActions>
            <Button variant="link" onClick={onClose}>
              {intl.formatMessage(messages.close)}
            </Button>
          </EmptyStateActions>
        </EmptyStateFooter>
      </EmptyState>
    )}
  </CostModelContext.Consumer>
);

const ReviewSuccess = injectIntl(ReviewSuccessBase);

interface ReviewDetailsOwnProps extends WrappedComponentProps {
  // TBD...
}

interface ReviewDetailsStateProps {
  isGpuToggleEnabled?: boolean;
}

type ReviewDetailsProps = ReviewDetailsOwnProps & ReviewDetailsStateProps;

const ReviewDetailsBase: React.FC<ReviewDetailsProps> = ({ intl, isGpuToggleEnabled }) => (
  <CostModelContext.Consumer>
    {({
      checked,
      createError,
      currencyUnits,
      description,
      distribution,
      distributeGpu,
      distributeNetwork,
      distributePlatformUnallocated,
      distributeStorage,
      distributeWorkerUnallocated,
      isDiscount,
      markup,
      name,
      tiers,
      type,
    }) => {
      const selectedSources = Object.keys(checked)
        .filter(key => checked[key].selected)
        .map(key => checked[key].meta);

      return (
        <>
          {createError && <Alert variant="danger" title={`${createError}`} />}
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
                  <Content component={ContentVariants.dd}>
                    {intl.formatMessage(messages.currencyOptions, { units: currencyUnits })}
                  </Content>
                  {type === 'OCP' && (
                    <>
                      <Content component={ContentVariants.dt}>{intl.formatMessage(messages.priceList)}</Content>
                      <Content component={ContentVariants.dd}>
                        {tiers.length > 0 ? (
                          <RateTable tiers={tiers} />
                        ) : (
                          intl.formatMessage(messages.costModelsWizardNoRatesAdded)
                        )}
                      </Content>
                    </>
                  )}
                  <Content component={ContentVariants.dt}>
                    {intl.formatMessage(messages.costModelsWizardReviewMarkDiscount)}
                  </Content>
                  <Content component={ContentVariants.dd}>
                    {intl.formatMessage(messages.percent, { value: isDiscount ? '-' + markup : markup })}
                  </Content>
                  {type === 'OCP' && (
                    <>
                      <Content component={ContentVariants.dt}>{intl.formatMessage(messages.costDistribution)}</Content>
                      <Content component={ContentVariants.dd}>
                        {intl.formatMessage(messages.distributionTypeDesc, { type: distribution })}
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
                    {selectedSources.find(src => Boolean(src.costmodel)) && (
                      <WarningIcon text={intl.formatMessage(messages.costModelsWizardWarningSources)} />
                    )}
                  </Content>
                  <Content component={ContentVariants.dd}>{selectedSources.map(r => r.name).join(', ')}</Content>
                </Content>
              </Content>
            </StackItem>
          </Stack>
        </>
      );
    }}
  </CostModelContext.Consumer>
);

const mapStateToProps = createMapStateToProps<undefined, ReviewDetailsStateProps>(state => {
  return {
    isGpuToggleEnabled: FeatureToggleSelectors.selectIsGpuToggleEnabled(state),
  };
});

const ReviewDetails = injectIntl(connect(mapStateToProps, {})(ReviewDetailsBase));

const ReviewWithDistribution = () => {
  return (
    <CostModelContext.Consumer>
      {({ createSuccess }) => {
        if (!createSuccess) {
          return <ReviewDetails />;
        }
        return <ReviewSuccess />;
      }}
    </CostModelContext.Consumer>
  );
};

export default ReviewWithDistribution;
