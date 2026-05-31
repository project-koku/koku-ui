import { Stack, StackItem, Title, TitleSizes } from '@patternfly/react-core';
import type { PriceListData } from 'api/priceList';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import type { OrderPriceListContentHandle } from 'routes/settings/costModels/costModelBreakdown/priceLists/orderPriceListContent';
import { OrderPriceListContent } from 'routes/settings/costModels/costModelBreakdown/priceLists/orderPriceListContent';

interface OrderPriceListOwnProps {
  canWrite?: boolean;
  contentRef?: React.RefObject<OrderPriceListContentHandle>;
  onRemove?: (priceLists: PriceListData[]) => void;
  onSave?: (priceLists: PriceListData[]) => void;
  priceLists?: PriceListData[];
}

type OrderPriceListProps = OrderPriceListOwnProps;

const OrderPriceList: React.FC<OrderPriceListProps> = ({
  canWrite,
  contentRef,
  onRemove,
  onSave,
  priceLists,
}: OrderPriceListProps) => {
  const intl = useIntl();

  return (
    <Stack hasGutter>
      <StackItem>
        <Title headingLevel="h2" size={TitleSizes.xl}>
          {intl.formatMessage(messages.orderPriceLists)}
        </Title>
      </StackItem>
      <StackItem>
        <OrderPriceListContent
          canWrite={canWrite}
          isDispatch={false}
          isWizardStep
          onRemove={onRemove}
          onSave={onSave}
          priceLists={priceLists}
          ref={contentRef}
        />
      </StackItem>
    </Stack>
  );
};

export { OrderPriceList };
