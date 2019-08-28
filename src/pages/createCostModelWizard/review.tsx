import {
  Alert,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateSecondaryActions,
  Grid,
  GridItem,
  Title,
  TitleSize,
} from '@patternfly/react-core';
import { OkIcon } from '@patternfly/react-icons';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { CostModelContext } from './context';
import { getLabels, PriceListTier } from './priceListTier';

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
        <Title size={TitleSize.xl}>
          {t('cost_models_wizard.review.title_details')}
        </Title>
        <Title size={TitleSize.md}>
          {t('cost_models_wizard.review.sub_title_details')}
        </Title>
        <Grid>
          <GridItem span={4}>
            {t('cost_models_wizard.general_info.name_label')}
          </GridItem>
          <GridItem span={8}>{name}</GridItem>
          <GridItem span={4}>
            {t('cost_models_wizard.general_info.description_label')}
          </GridItem>
          <GridItem span={8}>{description}</GridItem>
          <GridItem span={4}>
            {t('cost_models_wizard.steps.price_list')}
          </GridItem>
          <GridItem span={8}>
            {tiers.map((tier, ix) => {
              const [metric_label, units_label, measurement_label] = getLabels(
                t,
                tier
              );
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
          </GridItem>
          <GridItem span={4}>{t('cost_models_wizard.steps.markup')}</GridItem>
          <GridItem span={8}>{markup}%</GridItem>
          <GridItem span={4}>{t('cost_models_wizard.steps.sources')}</GridItem>
          <GridItem span={8}>
            {sources
              .filter(r => r.selected)
              .map(r => r.name)
              .join(', ')}
          </GridItem>
        </Grid>
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
