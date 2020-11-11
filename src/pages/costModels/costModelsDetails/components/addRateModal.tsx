import { Alert, Button, ButtonVariant, Form, Modal } from '@patternfly/react-core';
import { CostModelRequest } from 'api/costModels';
import { MetricHash } from 'api/metrics';
import { Rate } from 'api/rates';
import {
  canSubmit as isReadyForSubmit,
  mergeToRequest,
  RateForm,
  RateFormData,
  useRateData,
} from 'pages/costModels/components/rateForm/index';
import { initialRateFormData } from 'pages/costModels/components/rateForm/utils';
import React from 'react';
import { Translation } from 'react-i18next';
import { connect } from 'react-redux';
import { RootState } from 'store';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { metricsSelectors } from 'store/metrics';

interface AddRateModalBaseProps {
  isOpen: boolean;
  isProcessing?: boolean;
  onClose: () => void;
  onProceed: (rateFormData: RateFormData) => void;
  updateError: string;
  metricsHash: MetricHash;
  rates: Rate[];
}

export const AddRateModalBase: React.FunctionComponent<AddRateModalBaseProps> = ({
  isOpen,
  isProcessing,
  onProceed,
  onClose,
  updateError,
  metricsHash,
  rates,
}) => {
  const rateFormData = useRateData(metricsHash);
  const canSubmit = React.useMemo(() => isReadyForSubmit(rateFormData), [rateFormData.errors, rateFormData.rateKind]);
  React.useEffect(() => {
    rateFormData.reset({ ...initialRateFormData, otherTiers: rates });
  }, [isOpen]);
  return (
    <Translation>
      {t => {
        return (
          <Modal
            title={t('cost_models_details.add_rate_modal.title')}
            isOpen={isOpen}
            onClose={onClose}
            variant="large"
            actions={[
              <Button
                key="add-rate"
                variant={ButtonVariant.primary}
                isDisabled={!canSubmit || isProcessing}
                onClick={() => {
                  onProceed(rateFormData);
                }}
              >
                {t('cost_models_details.add_rate')}
              </Button>,
              <Button key="cancel" variant={ButtonVariant.link} isDisabled={isProcessing} onClick={onClose}>
                {t('cost_models_details.add_rate_modal.cancel')}
              </Button>,
            ]}
          >
            <Form>
              {updateError && <Alert variant="danger" title={`${updateError}`} />}
              <RateForm metricsHash={metricsHash} rateFormData={rateFormData} />
            </Form>
          </Modal>
        );
      }}
    </Translation>
  );
};

export default connect(
  (state: RootState) => {
    const costModels = costModelsSelectors.costModels(state);
    let costModel = null;
    if (costModels.length > 0) {
      costModel = costModels[0];
    }
    return {
      costModel,
      isOpen: costModelsSelectors.isDialogOpen(state)('rate').addRate,
      updateError: costModelsSelectors.updateError(state),
      isProcessing: costModelsSelectors.updateProcessing(state),
      metricsHash: metricsSelectors.metrics(state),
    };
  },
  dispatch => {
    return {
      onClose: () => {
        dispatch(
          costModelsActions.setCostModelDialog({
            name: 'addRate',
            isOpen: false,
          })
        );
      },
      updateCostModel: (uuid: string, request: CostModelRequest) =>
        costModelsActions.updateCostModel(uuid, request, 'addRate')(dispatch),
    };
  },
  (stateProps, dispatchProps) => {
    const { uuid, rates } = stateProps.costModel;
    return {
      isOpen: stateProps.isOpen,
      metricsHash: stateProps.metricsHash,
      rates,
      updateError: stateProps.updateError,
      isProcessing: stateProps.isProcessing,
      onClose: dispatchProps.onClose,
      onProceed: (rateFormData: RateFormData) => {
        const costModelReq = mergeToRequest(stateProps.metricsHash, stateProps.costModel, rateFormData);
        dispatchProps.updateCostModel(uuid, costModelReq);
      },
    };
  }
)(AddRateModalBase);
