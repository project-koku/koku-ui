import { Stack, StackItem, Title, TitleSizes } from '@patternfly/react-core';
import type { PriceListData } from 'api/priceList';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import type { PriceListContentHandle } from 'routes/settings/costModels/costModelBreakdown/priceLists/components';
import { PriceListContent } from 'routes/settings/costModels/costModelBreakdown/priceLists/components';

interface AddPriceListOwnProps {
  canWrite?: boolean;
  contentRef?: React.RefObject<PriceListContentHandle>;
  currency?: string;
  onAdd?: (priceLists: PriceListData[]) => void;
  priceLists?: PriceListData[];
}

type AddPriceListProps = AddPriceListOwnProps;

const AddPriceList: React.FC<AddPriceListProps> = ({
  canWrite,
  contentRef,
  currency,
  onAdd,
  priceLists,
}: AddPriceListProps) => {
  const intl = useIntl();

  return (
    <Stack hasGutter>
      <StackItem>
        <Title headingLevel="h2" size={TitleSizes.xl}>
          {intl.formatMessage(messages.assignPriceLists)}
        </Title>
      </StackItem>
      <StackItem>
        <PriceListContent
          canWrite={canWrite}
          currency={currency}
          onAdd={onAdd}
          priceLists={priceLists}
          ref={contentRef}
        />
      </StackItem>
    </Stack>
  );
};

export { AddPriceList };
