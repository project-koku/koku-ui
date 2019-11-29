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
  TitleSize,
} from '@patternfly/react-core';
import { OkIcon } from '@patternfly/react-icons';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { CostModelContext } from './context';
import { getLabels, PriceListTier } from './priceListTier';
import { WarningIcon } from './warningIcon';

const ReviewSuccessBase: React.SFC<InjectedTranslateProps> = ({ t }) => (
  <CostModelContext.Consumer>
    {({ onClose }) => (
      <EmptyState>
        <EmptyStateIcon icon={OkIcon} color="green" />
        <Title size={TitleSize.lg}>
          {t('cost_models_wizard.review.title_success')}
        </Title>
        <EmptyStateBody>
          {t('cost_models_wizard.review.sub_title_success')}
        </EmptyStateBody>
        <EmptyStateSecondaryActions>
          <Button variant="link" onClick={onClose}>
            {t('cost_models_wizard.review.close_button')}
          </Button>
        </EmptyStateSecondaryActions>
      </EmptyState>
    )}
  </CostModelContext.Consumer>
);

const ReviewSuccess = translate()(ReviewSuccessBase);

const ReviewDetailsBase: React.SFC<InjectedTranslateProps> = ({ t }) => (
  <CostModelContext.Consumer>
    {({ name, description, type, markup, sources, tiers, createError }) => (
      <>
        {createError && <Alert variant="danger" title={`${createError}`} />}
        <Stack gutter="md">
          <StackItem>
            <Title size={TitleSize.xl}>
              {t('cost_models_wizard.review.title_details')}
            </Title>
          </StackItem>
          <StackItem>
            <TextContent>
              <Text component={TextVariants.h6}>
                {t('cost_models_wizard.review.sub_title_details')}
              </Text>
            </TextContent>
          </StackItem>
          <StackItem>
            <TextContent>
              <TextList component={TextListVariants.dl}>
                <TextListItem component={TextListItemVariants.dt}>
                  {t('cost_models_wizard.general_info.name_label')}
                </TextListItem>
                <TextListItem component={TextListItemVariants.dd}>
                  {name}
                </TextListItem>
                <TextListItem component={TextListItemVariants.dt}>
                  {t('cost_models_wizard.general_info.description_label')}
                </TextListItem>
                <TextListItem component={TextListItemVariants.dd}>
                  {description}
                </TextListItem>
                {type === 'OCP' && (
                  <>
                    <TextListItem component={TextListItemVariants.dt}>
                      {t('cost_models_wizard.steps.price_list')}
                    </TextListItem>
                    <TextListItem component={TextListItemVariants.dd}>
                      {tiers.map((tier, ix) => {
                        const [
                          metric_label,
                          units_label,
                          measurement_label,
                        ] = getLabels(t, tier);
                        return (
                          <div
                            key={`review-price-list-tier-${ix}`}
                            style={{ paddingBottom: '30px' }}
                          >
                            <PriceListTier
                              rate={tier.rate}
                              metricLabel={metric_label}
                              unitsLabel={units_label}
                              measurementLabel={measurement_label}
                            />
                          </div>
                        );
                      })}
                    </TextListItem>
                  </>
                )}
                <TextListItem component={TextListItemVariants.dt}>
                  {t('cost_models_wizard.steps.markup')}
                </TextListItem>
                <TextListItem component={TextListItemVariants.dd}>
                  {markup}%
                </TextListItem>
                <TextListItem component={TextListItemVariants.dt}>
                  {t('cost_models_wizard.steps.sources')}{' '}
                  {sources.find(
                    src => src.selected && src.costmodel !== undefined
                  ) && (
                    <WarningIcon
                      text={t('cost_models_wizard.warning_override_sources')}
                    />
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
    )}
  </CostModelContext.Consumer>
);

const ReviewDetails = translate()(ReviewDetailsBase);

const Review = () => {
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

export default Review;
