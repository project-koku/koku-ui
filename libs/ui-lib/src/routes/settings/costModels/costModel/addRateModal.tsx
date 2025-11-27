import type { CostModelRequest } from '@koku-ui/api/costModels';
import type { CostModel } from '@koku-ui/api/costModels';
import type { MetricHash } from '@koku-ui/api/metrics';
import messages from '@koku-ui/i18n/locales/messages';
import {
  Alert,
  Button,
  ButtonVariant,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
} from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { createMapStateToProps } from '../../../../store/common';
import { costModelsActions, costModelsSelectors } from '../../../../store/costModels';
import { metricsSelectors } from '../../../../store/metrics';
import { canSubmit as isReadyForSubmit, mergeToRequest, RateForm, useRateData } from '../components/rateForm';
import { initialRateFormData } from '../components/rateForm/utils';

interface AddRateModalOwnProps extends WrappedComponentProps {
  // TBD...
}

interface AddRateModalStateProps {
  costModel?: CostModel;
  isOpen?: boolean;
  isProcessing?: boolean;
  metricsHash?: MetricHash;
  updateError?: string;
}

interface AddRateModalDispatchProps {
  onClose?: () => void;
  updateCostModel?: (uuid: string, request: CostModelRequest) => void;
}

type AddRateModalProps = AddRateModalOwnProps & AddRateModalStateProps & AddRateModalDispatchProps;

export const AddRateModalBase: React.FC<AddRateModalProps> = ({
  costModel,
  intl,
  isOpen,
  isProcessing,
  metricsHash,
  onClose,
  updateCostModel,
  updateError,
}) => {
  const rateFormData: any = useRateData(metricsHash);
  const canSubmit = React.useMemo(() => isReadyForSubmit(rateFormData), [rateFormData.errors, rateFormData.rateKind]);
  const onProceed = () => {
    const costModelReq = mergeToRequest(metricsHash, costModel, rateFormData);
    updateCostModel(costModel.uuid, costModelReq);
  };

  React.useEffect(() => {
    rateFormData.reset({ ...initialRateFormData, otherTiers: costModel.rates });
  }, [isOpen]);

  return (
    <Modal className="costManagement" isOpen={isOpen} onClose={onClose} variant={ModalVariant.large}>
      <ModalHeader title={intl.formatMessage(messages.priceListAddRate)} />
      <ModalBody>
        <Form>
          {updateError && <Alert variant="danger" title={`${updateError}`} />}
          <RateForm currencyUnits={costModel.currency} metricsHash={metricsHash} rateFormData={rateFormData} />
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          key="add-rate"
          variant={ButtonVariant.primary}
          isDisabled={!canSubmit || isProcessing}
          onClick={onProceed}
        >
          {intl.formatMessage(messages.priceListAddRate)}
        </Button>
        <Button key="cancel" variant={ButtonVariant.link} isDisabled={isProcessing} onClick={onClose}>
          {intl.formatMessage(messages.cancel)}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = createMapStateToProps<AddRateModalOwnProps, AddRateModalStateProps>(state => {
  const costModels = costModelsSelectors.costModels(state);
  let costModel = null;
  if (costModels.length > 0) {
    costModel = costModels[0];
  }
  return {
    costModel,
    isOpen: (costModelsSelectors.isDialogOpen(state)('rate') as any).addRate,
    updateError: costModelsSelectors.updateError(state),
    isProcessing: costModelsSelectors.updateProcessing(state),
    metricsHash: metricsSelectors.metrics(state),
  };
});

const mapDispatchToProps = (dispatch): AddRateModalDispatchProps => {
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
};

const AddRateModal = injectIntl(connect(mapStateToProps, mapDispatchToProps)(AddRateModalBase));

export default AddRateModal;
