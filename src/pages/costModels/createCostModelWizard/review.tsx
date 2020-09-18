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
} from '@patternfly/react-core';
import { OkIcon } from '@patternfly/react-icons/dist/js/icons/ok-icon';
import { RateTable } from 'pages/costModels/components/rateTable';
import { WarningIcon } from 'pages/costModels/components/warningIcon';
import React from 'react';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';

import { CostModelContext } from './context';

const ReviewSuccessBase: React.SFC<WithTranslation> = ({ t }) => (
  <CostModelContext.Consumer>
    {({ onClose, name }) => (
      <EmptyState>
        <EmptyStateIcon icon={OkIcon} color="green" />
        <Title headingLevel="h2" size="lg">
          {t('cost_models_wizard.review.title_success')}
        </Title>
        <EmptyStateBody>
          {t('cost_models_wizard.review.sub_title_success', {
            cost_model: name,
          })}
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

const ReviewSuccess = withTranslation()(ReviewSuccessBase);

const ReviewDetailsBase: React.SFC<WithTranslation> = ({ t }) => (
  <CostModelContext.Consumer>
    {({ name, description, type, markup, sources, tiers, createError }) => {
      return (
        <>
          {createError && <Alert variant="danger" title={`${createError}`} />}
          <Stack hasGutter>
            <StackItem>
              <Title headingLevel="h2" size="xl">
                {t('cost_models_wizard.review.title_details')}
              </Title>
            </StackItem>
            <StackItem>
              <TextContent>
                <Text component={TextVariants.h6}>
                  <Trans i18nKey="cost_models_wizard.review.sub_title_details">
                    <b>{t('cost_models_wizard.review.create_button')}</b>
                    <b>{t('cost_models_wizard.review.back_button')}</b>
                  </Trans>
                </Text>
              </TextContent>
            </StackItem>
            <StackItem>
              <TextContent>
                <TextList component={TextListVariants.dl}>
                  <TextListItem component={TextListItemVariants.dt}>
                    {t('cost_models_wizard.general_info.name_label')}
                  </TextListItem>
                  <TextListItem component={TextListItemVariants.dd}>{name}</TextListItem>
                  <TextListItem component={TextListItemVariants.dt}>
                    {t('cost_models_wizard.general_info.description_label')}
                  </TextListItem>
                  <TextListItem component={TextListItemVariants.dd}>{description}</TextListItem>
                  {type === 'OCP' && (
                    <>
                      <TextListItem component={TextListItemVariants.dt}>
                        {t('cost_models_wizard.steps.price_list')}
                      </TextListItem>
                      <TextListItem component={TextListItemVariants.dd}>
                        {tiers.length > 0 ? <RateTable t={t} tiers={tiers} /> : t('cost_models_wizard.no_rates')}
                      </TextListItem>
                    </>
                  )}
                  <TextListItem component={TextListItemVariants.dt}>
                    {t('cost_models_wizard.review.markup')}
                  </TextListItem>
                  <TextListItem component={TextListItemVariants.dd}>{markup}%</TextListItem>
                  <TextListItem component={TextListItemVariants.dt}>
                    {t('cost_models_wizard.review.sources')}{' '}
                    {sources.find(src => src.selected && Boolean(src.costmodel)) && (
                      <WarningIcon text={t('cost_models_wizard.warning_override_sources')} />
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

const ReviewDetails = withTranslation()(ReviewDetailsBase);

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
