import {
  Alert,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateSecondaryActions,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextList,
  TextListItem,
  TextListItemVariants,
  TextListVariants,
  TextVariants,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { OkIcon } from '@patternfly/react-icons/dist/esm/icons/ok-icon';
import messages from 'locales/messages';
import { RateTable } from 'pages/costModels/components/rateTable';
import { WarningIcon } from 'pages/costModels/components/warningIcon';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

import { CostModelContext } from './context';

const ReviewSuccessBase: React.SFC<WrappedComponentProps> = ({ intl }) => (
  <CostModelContext.Consumer>
    {({ onClose, name }) => (
      <EmptyState>
        <EmptyStateIcon icon={OkIcon} color="green" />
        <Title headingLevel="h2" size={TitleSizes.lg}>
          {intl.formatMessage(messages.CostModelsWizardReviewStatusTitle)}
        </Title>
        <EmptyStateBody>
          {intl.formatMessage(messages.CostModelsWizardReviewStatusSubTitle, { value: name })}
        </EmptyStateBody>
        <EmptyStateSecondaryActions>
          <Button variant="link" onClick={onClose}>
            {intl.formatMessage(messages.Close)}
          </Button>
        </EmptyStateSecondaryActions>
      </EmptyState>
    )}
  </CostModelContext.Consumer>
);

const ReviewSuccess = injectIntl(ReviewSuccessBase);

const ReviewDetailsBase: React.SFC<WrappedComponentProps> = ({ intl }) => (
  <CostModelContext.Consumer>
    {({ name, description, distribution, type, markup, sources, tiers, createError, isDiscount }) => {
      return (
        <>
          {createError && <Alert variant="danger" title={`${createError}`} />}
          <Stack hasGutter>
            <StackItem>
              <Title headingLevel="h2" size={TitleSizes.xl}>
                {intl.formatMessage(messages.CostModelsWizardStepsReview)}
              </Title>
            </StackItem>
            <StackItem>
              <TextContent>
                <Text component={TextVariants.h6}>
                  {intl.formatMessage(messages.CostModelsWizardReviewStatusSubDetails, {
                    create: <strong>{intl.formatMessage(messages.Create)}</strong>,
                    back: <strong>{intl.formatMessage(messages.Back)}</strong>,
                  })}
                </Text>
              </TextContent>
            </StackItem>
            <StackItem>
              <TextContent>
                <TextList component={TextListVariants.dl}>
                  <TextListItem component={TextListItemVariants.dt}>
                    {intl.formatMessage(messages.Names, { count: 1 })}
                  </TextListItem>
                  <TextListItem component={TextListItemVariants.dd}>{name}</TextListItem>
                  <TextListItem component={TextListItemVariants.dt}>
                    {intl.formatMessage(messages.Description)}
                  </TextListItem>
                  <TextListItem component={TextListItemVariants.dd}>{description}</TextListItem>
                  {type === 'OCP' && (
                    <>
                      <TextListItem component={TextListItemVariants.dt}>
                        {intl.formatMessage(messages.PriceList)}
                      </TextListItem>
                      <TextListItem component={TextListItemVariants.dd}>
                        {tiers.length > 0 ? (
                          <RateTable tiers={tiers} />
                        ) : (
                          intl.formatMessage(messages.CostModelsWizardNoRatesAdded)
                        )}
                      </TextListItem>
                    </>
                  )}
                  <TextListItem component={TextListItemVariants.dt}>
                    {intl.formatMessage(messages.CostModelsWizardReviewMarkDiscount)}
                  </TextListItem>
                  <TextListItem component={TextListItemVariants.dd}>{isDiscount ? '-' + markup : markup}%</TextListItem>
                  {type === 'OCP' && (
                    <>
                      <TextListItem component={TextListItemVariants.dt}>
                        {intl.formatMessage(messages.DistributionType)}
                      </TextListItem>
                      <TextListItem component={TextListItemVariants.dd}>{distribution}</TextListItem>
                    </>
                  )}
                  <TextListItem component={TextListItemVariants.dt}>
                    {intl.formatMessage(messages.CostModelsAssignSources)}{' '}
                    {sources.find(src => src.selected && Boolean(src.costmodel)) && (
                      <WarningIcon text={intl.formatMessage(messages.CostModelsWizardWarningSources)} />
                    )}
                  </TextListItem>
                  <TextListItem component={TextListItemVariants.dd}>
                    {sources
                      .filter(r => r.selected)
                      .map(r => r.name)
                      .join(', ')}
                  </TextListItem>
                </TextList>
              </TextContent>
            </StackItem>
          </Stack>
        </>
      );
    }}
  </CostModelContext.Consumer>
);

const ReviewDetails = injectIntl(ReviewDetailsBase);

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
