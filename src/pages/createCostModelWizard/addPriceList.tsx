import {
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
  Title,
  TitleSize,
} from '@patternfly/react-core';
import { MetricHash } from 'api/metrics';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { metricsSelectors } from 'store/metrics';
import AddCostModelRateForm, {
  unusedRates,
} from '../costModelsDetails/components/addCostModelRateForm';
import {
  canSubmit,
  isRateValid,
} from '../costModelsDetails/components/addCostModelRateForm';
import { CostModelContext } from './context';

interface Props extends InjectedTranslateProps {
  metricsHash: MetricHash;
}

const AddPriceList: React.SFC<Props> = ({ t, metricsHash }) => {
  return (
    <CostModelContext.Consumer>
      {({ priceListCurrent, updateCurrentPL, submitCurrentPL, tiers }) => {
        const availableRates = unusedRates(metricsHash, tiers);
        return (
          <Stack gutter="md">
            <StackItem>
              <Title size={TitleSize.xl}>
                {t('cost_models_wizard.price_list.title')}
              </Title>
            </StackItem>
            <StackItem>
              <TextContent>
                <Text component={TextVariants.h6}>
                  {t('cost_models_wizard.price_list.sub_title_add')}
                </Text>
              </TextContent>
            </StackItem>
            <StackItem>
              <AddCostModelRateForm
                metric={priceListCurrent.metric}
                setMetric={(value: string) => {
                  updateCurrentPL('metric', value);
                }}
                measurement={priceListCurrent.measurement}
                setMeasurement={(value: string) =>
                  updateCurrentPL('measurement', value)
                }
                rate={priceListCurrent.rate}
                setRate={(value: string) => updateCurrentPL('rate', value)}
                metricOptions={Object.keys(availableRates).map(m => ({
                  value: m,
                  label: t(`cost_models.${m}`),
                }))}
                measurementOptions={
                  Boolean(priceListCurrent.metric)
                    ? Object.keys(availableRates[priceListCurrent.metric]).map(
                        m => ({
                          value: m,
                          label: t(`cost_models.${m}`, {
                            units: t(
                              `cost_models.${
                                metricsHash[priceListCurrent.metric][m]
                                  .label_measurement_unit
                              }`
                            ),
                          }),
                        })
                      )
                    : []
                }
                validRate={isRateValid(priceListCurrent.rate)}
                enableSubmit={canSubmit(priceListCurrent.rate)}
                submit={submitCurrentPL}
              />
            </StackItem>
          </Stack>
        );
      }}
    </CostModelContext.Consumer>
  );
};

export default connect(
  createMapStateToProps(state => ({
    metricsHash: metricsSelectors.metrics(state),
  }))
)(translate()(AddPriceList));
