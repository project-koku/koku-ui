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
import { WarningIcon } from 'pages/costModels/components/warningIcon';
import React from 'react';
import {
  FormattedMessage,
  injectIntl,
  WrappedComponentProps,
} from 'react-intl';
import { RateTable } from '../components/rateTable';
import { CostModelContext } from './context';

const ReviewSuccessBase: React.SFC<WrappedComponentProps> = ({ intl }) => (
  <CostModelContext.Consumer>
    {({ onClose, name }) => (
      <EmptyState>
        <EmptyStateIcon icon={OkIcon} color="green" />
        <Title size={TitleSize.lg}>
          {intl.formatMessage({
            id: 'cost_models_wizard.review.title_success',
          })}
        </Title>
        <EmptyStateBody>
          {intl.formatMessage(
            { id: 'cost_models_wizard.review.sub_title_success' },
            {
              cost_model: name,
            }
          )}
        </EmptyStateBody>
        <EmptyStateSecondaryActions>
          <Button variant="link" onClick={onClose}>
            {intl.formatMessage({
              id: 'cost_models_wizard.review.close_button',
            })}
          </Button>
        </EmptyStateSecondaryActions>
      </EmptyState>
    )}
  </CostModelContext.Consumer>
);

const ReviewSuccess = injectIntl(ReviewSuccessBase);

const ReviewDetailsBase: React.SFC<WrappedComponentProps> = ({ intl }) => (
  <CostModelContext.Consumer>
    {({ name, description, type, markup, sources, tiers, createError }) => {
      return (
        <>
          {createError && <Alert variant="danger" title={`${createError}`} />}
          <Stack gutter="md">
            <StackItem>
              <Title size={TitleSize.xl}>
                {intl.formatMessage({
                  id: 'cost_models_wizard.review.title_details',
                })}
              </Title>
            </StackItem>
            <StackItem>
              <TextContent>
                <Text component={TextVariants.h6}>
                  <FormattedMessage
                    id="cost_models_wizard.review.sub_title_details"
                    values={{
                      create: (
                        <b>
                          {intl.formatMessage({
                            id: 'cost_models_wizard.review.create_button',
                          })}
                        </b>
                      ),
                      back: (
                        <b>
                          {intl.formatMessage({
                            id: 'cost_models_wizard.review.back_button',
                          })}
                        </b>
                      ),
                    }}
                  />
                </Text>
              </TextContent>
            </StackItem>
            <StackItem>
              <TextContent>
                <TextList component={TextListVariants.dl}>
                  <TextListItem component={TextListItemVariants.dt}>
                    {intl.formatMessage({
                      id: 'cost_models_wizard.general_info.name_label',
                    })}
                  </TextListItem>
                  <TextListItem component={TextListItemVariants.dd}>
                    {name}
                  </TextListItem>
                  <TextListItem component={TextListItemVariants.dt}>
                    {intl.formatMessage({
                      id: 'cost_models_wizard.general_info.description_label',
                    })}
                  </TextListItem>
                  <TextListItem component={TextListItemVariants.dd}>
                    {description}
                  </TextListItem>
                  {type === 'OCP' && (
                    <>
                      <TextListItem component={TextListItemVariants.dt}>
                        {intl.formatMessage({
                          id: 'cost_models_wizard.steps.price_list',
                        })}
                      </TextListItem>
                      <TextListItem component={TextListItemVariants.dd}>
                        {tiers.length > 0 ? (
                          <RateTable intl={intl} tiers={tiers} />
                        ) : (
                          intl.formatMessage({
                            id: 'cost_models_wizard.no_rates',
                          })
                        )}
                      </TextListItem>
                    </>
                  )}
                  <TextListItem component={TextListItemVariants.dt}>
                    {intl.formatMessage({
                      id: 'cost_models_wizard.review.markup',
                    })}
                  </TextListItem>
                  <TextListItem component={TextListItemVariants.dd}>
                    {markup}%
                  </TextListItem>
                  <TextListItem component={TextListItemVariants.dt}>
                    {intl.formatMessage({
                      id: 'cost_models_wizard.review.sources',
                    })}{' '}
                    }
                    {sources.find(
                      src => src.selected && Boolean(src.costmodel)
                    ) && (
                      <WarningIcon
                        text={intl.formatMessage({
                          id: 'cost_models_wizard.warning_override_sources',
                        })}
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
      );
    }}
  </CostModelContext.Consumer>
);

const ReviewDetails = injectIntl(ReviewDetailsBase);

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
