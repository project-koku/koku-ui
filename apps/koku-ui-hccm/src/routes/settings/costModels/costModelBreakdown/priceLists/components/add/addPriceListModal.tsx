import {
  Button,
  ButtonVariant,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
} from '@patternfly/react-core';
import type { CostModel } from 'api/costModels';
import { type PriceListData } from 'api/priceList';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import type { PriceListContentHandle } from 'routes/settings/costModels/costModelBreakdown/priceLists/components';
import { PriceListContent } from 'routes/settings/costModels/costModelBreakdown/priceLists/components';
import { getSourceType } from 'routes/settings/costModelsDeprecated/costModelBreakdown/utils/sourceType';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';

interface AddPriceListModalOwnProps {
  canWrite?: boolean;
  costModel: CostModel;
  isDispatch?: boolean;
  isOpen?: boolean;
  onAdd?: (priceLists: PriceListData[]) => void;
  onClose?: () => void;
}

interface AddPriceListModalStateProps {
  costModelsUpdateError?: AxiosError;
  costModelsUpdateStatus?: FetchStatus;
}

interface PriceListDataExt extends PriceListData {
  priority?: number;
}

type AddPriceListModalProps = AddPriceListModalOwnProps;

const AddPriceListModal: React.FC<AddPriceListModalProps> = ({
  canWrite,
  costModel,
  isDispatch = true,
  isOpen,
  onAdd,
  onClose,
}) => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const contentRef = useRef<PriceListContentHandle>(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isFinish, setIsFinish] = useState(false);
  const [priceLists, setPriceLists] = useState<PriceListData[]>([]);

  const { costModelsUpdateError, costModelsUpdateStatus } = useMapToProps();

  const handleOnAdd = (items: PriceListDataExt[]) => {
    if (costModelsUpdateStatus !== FetchStatus.inProgress) {
      // Calculate the highest priority
      let priority = 0;
      items?.forEach(item => {
        priority += item?.priority ?? 0;
      });

      const itemsWithPriority = [];
      items?.forEach(item => {
        itemsWithPriority.push({
          uuid: item?.uuid,
          name: item?.name,
          priority: item?.priority ?? ++priority,
        });
      });
      const newPriceLists = itemsWithPriority.sort((a, b) => a.priority - b.priority);

      if (isDispatch) {
        setIsFinish(true);
        setPriceLists(newPriceLists);

        dispatch(
          costModelsActions.updateCostModel(costModel?.uuid, {
            ...(costModel ?? {}),
            price_lists: undefined,
            price_list_uuids: newPriceLists.map(item => item.uuid),
            source_type: getSourceType(costModel?.source_type),
          })
        );
      } else {
        onAdd?.(newPriceLists);
      }
    }
  };

  // Effects

  useEffect(() => {
    if (isFinish && costModelsUpdateStatus === FetchStatus.complete) {
      setIsFinish(false);

      if (!costModelsUpdateError) {
        onAdd?.(priceLists);
      }
    }
  }, [isFinish, costModel, costModelsUpdateError, costModelsUpdateStatus, onAdd, priceLists]);

  // PatternFly modal appends to document.body, which is outside the scoped "costManagement" dom tree.
  // Use className="costManagement" to override PatternFly styles or append the modal to an element within the tree

  return (
    <Modal className="costManagement" isOpen={isOpen} onClose={onClose} variant={ModalVariant.large}>
      <ModalHeader title={intl.formatMessage(messages.assignPriceLists)} />
      <ModalBody>
        {isOpen && (
          <PriceListContent
            canWrite={canWrite}
            costModel={costModel}
            onAdd={handleOnAdd}
            onDisabled={setIsDisabled}
            ref={contentRef}
          />
        )}
      </ModalBody>
      <ModalFooter>
        <Button
          isAriaDisabled={isDisabled || costModelsUpdateStatus === FetchStatus.inProgress}
          onClick={() => contentRef.current?.save()}
          variant={ButtonVariant.primary}
        >
          {intl.formatMessage(messages.save)}
        </Button>
        <Button onClick={onClose} variant="link">
          {intl.formatMessage(messages.cancel)}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const useMapToProps = (): AddPriceListModalStateProps => {
  const costModelsUpdateError = useSelector((state: RootState) =>
    costModelsSelectors.selectCostModelsUpdateError(state)
  );
  const costModelsUpdateStatus = useSelector((state: RootState) =>
    costModelsSelectors.selectCostModelsUpdateStatus(state)
  );

  return {
    costModelsUpdateError,
    costModelsUpdateStatus,
  };
};

export { AddPriceListModal };
