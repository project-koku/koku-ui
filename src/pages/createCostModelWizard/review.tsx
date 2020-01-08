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
import { MetricHash } from 'api/metrics';
import CostModelRateItem from 'pages/costModelsDetails/components/costModelRateItem';
import React from 'react';
import { InjectedTranslateProps, Interpolate, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { metricsSelectors } from 'store/metrics';
import { createMapStateToProps } from '../../store/common';
import { CostModelContext } from './context';
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

interface ReviewDetailsProps extends InjectedTranslateProps {
  metricsHash: MetricHash;
}

const ReviewDetailsBase: React.SFC<ReviewDetailsProps> = ({
  metricsHash,
  t,
}) => (
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
                <Interpolate
                  i18nKey="cost_models_wizard.review.sub_title_details"
                  create={<b>{t('cost_models_wizard.review.create_button')}</b>}
                  back={<b>{t('cost_models_wizard.review.back_button')}</b>}
                />
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
                        return (
                          <div
                            key={`review-price-list-tier-${ix}`}
                            style={{ paddingBottom: '30px' }}
                          >
                            <CostModelRateItem
                              index={ix}
                              units={
                                metricsHash[tier.metric][tier.measurement]
                                  .label_measurement_unit
                              }
                              metric={tier.metric}
                              measurement={tier.measurement}
                              rate={tier.rate}
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

const ReviewDetails = connect(
  createMapStateToProps(state => ({
    metricsHash: metricsSelectors.metrics(state),
  }))
)(translate()(ReviewDetailsBase));

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
