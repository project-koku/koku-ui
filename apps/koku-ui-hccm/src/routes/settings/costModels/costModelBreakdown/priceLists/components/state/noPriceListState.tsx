import { EmptyState, EmptyStateBody, EmptyStateFooter, EmptyStateVariant } from '@patternfly/react-core';
import type { CostModel } from 'api/costModels';
import type { PriceListData } from 'api/priceList';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { AddPriceListAction } from 'routes/settings/costModels/costModelBreakdown/priceLists/components/actions';

interface NoPriceListStateOwnProps {
  canWrite?: boolean;
  costModel: CostModel;
  isDisabled?: boolean;
  onAdd?: (priceLists: PriceListData[]) => void;
}

// defaultIntl required for testing
const NoPriceListState: React.FC<NoPriceListStateOwnProps> = ({ canWrite, costModel, isDisabled, onAdd }) => {
  const intl = useIntl();

  return (
    <>
      <EmptyState
        headingLevel="h5"
        titleText={intl.formatMessage(messages.priceListEmptyPriceLists)}
        variant={EmptyStateVariant.lg}
      >
        <EmptyStateBody>{intl.formatMessage(messages.priceListEmptyPriceListsDesc)}</EmptyStateBody>
        <EmptyStateFooter>
          <AddPriceListAction isDisabled={isDisabled} canWrite={canWrite} costModel={costModel} onAdd={onAdd} />
        </EmptyStateFooter>
      </EmptyState>
    </>
  );
};

export { NoPriceListState };
