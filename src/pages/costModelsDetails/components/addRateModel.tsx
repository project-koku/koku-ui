import {
  Alert,
  Button,
  Modal,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
  Title,
  TitleSize,
} from '@patternfly/react-core';
import { CostModel } from 'api/costModels';
import { MetricHash } from 'api/metrics';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { metricsSelectors } from 'store/metrics';
import AddCostModelRateForm, {
  canSubmit,
  isRateValid,
  unusedRates,
} from './addCostModelRateForm';

interface Props extends InjectedTranslateProps {
  current: CostModel;
  isProcessing?: boolean;
  onClose: () => void;
  onProceed: (metric: string, measurement: string, rate: string) => void;
  updateError: string;
  metricsHash: MetricHash;
}

interface State {
  rate: string;
  metric: string;
  measurement: string;
  dirtyRate: boolean;
}

const defaultState: State = {
  metric: '',
  measurement: '',
  rate: '',
  dirtyRate: false,
};

class AddRateModelBase extends React.Component<Props, State> {
  public state = defaultState;
  public render() {
    const {
      metricsHash,
      updateError,
      current,
      onClose,
      onProceed,
      isProcessing,
      t,
    } = this.props;
    const { metric, measurement, rate } = this.state;
    const options = current.rates.map(r => ({
      metric: r.metric.label_metric,
      measurement: r.metric.label_measurement,
    }));
    const availableRates = unusedRates(metricsHash, options);
    return (
      <Modal
        isFooterLeftAligned
        title={t('cost_models_details.add_rate_modal.title', {
          name: current.name,
        })}
        isSmall
        isOpen
        onClose={onClose}
        actions={[
          <Button
            key="cancel"
            variant="secondary"
            onClick={() => {
              onClose();
              this.setState(defaultState);
            }}
            isDisabled={isProcessing}
          >
            {t('cost_models_details.add_rate_modal.cancel')}
          </Button>,
          <Button
            key="proceed"
            variant="primary"
            onClick={() =>
              onProceed(
                this.state.metric,
                this.state.measurement,
                this.state.rate
              )
            }
            isDisabled={canSubmit(rate) || isProcessing}
          >
            {t('cost_models_details.add_rate')}
          </Button>,
        ]}
      >
        <>
          {updateError && <Alert variant="danger" title={`${updateError}`} />}
          <Stack gutter="md">
            <StackItem>
              <Title size={TitleSize.lg}>
                {t('cost_models_details.cost_model.source_type')}
              </Title>
            </StackItem>
            <StackItem>
              <TextContent>
                <Text component={TextVariants.h6}>{current.source_type}</Text>
              </TextContent>
            </StackItem>
            <StackItem>
              <AddCostModelRateForm
                metric={metric}
                setMetric={(value: string) =>
                  this.setState({ metric: value, rate: '', measurement: '' })
                }
                measurement={measurement}
                setMeasurement={(value: string) =>
                  this.setState({ measurement: value })
                }
                rate={rate}
                setRate={(value: string) =>
                  this.setState({ rate: value, dirtyRate: true })
                }
                metricOptions={Object.keys(availableRates).map(m => ({
                  value: m,
                  label: t(`cost_models.${m}`),
                }))}
                measurementOptions={
                  Boolean(metric) && Boolean(availableRates[metric])
                    ? Object.keys(availableRates[metric]).map(m => ({
                        value: m,
                        label: t(`cost_models.${m}`, {
                          units: t(
                            `cost_models.${
                              metricsHash[metric][m].label_measurement_unit
                            }`
                          ),
                        }),
                      }))
                    : []
                }
                validRate={isRateValid(rate)}
              />
            </StackItem>
          </Stack>
        </>
      </Modal>
    );
  }
}

export default connect(
  createMapStateToProps(state => ({
    metricsHash: metricsSelectors.metrics(state),
  }))
)(translate()(AddRateModelBase));
