import { Content, ContentVariants, Stack, StackItem } from '@patternfly/react-core';
import type { PriceListData } from 'api/priceList';
import type { Rate } from 'api/rates';
import messages from 'locales/messages';
import React, { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from 'react';
import { useIntl } from 'react-intl';

interface DeleteRateContentOwnProps {
  onDelete?: (rates: Rate[]) => void;
  priceList: PriceListData;
  rateIndex?: number;
}

export interface DeleteRateContentHandle {
  // Builds the rate from form state and invokes onSave
  submit: () => void;
}

type DeleteRateContentProps = DeleteRateContentOwnProps;

const DeleteRateContent = forwardRef<DeleteRateContentHandle, DeleteRateContentProps>(
  ({ onDelete, priceList, rateIndex }, ref) => {
    const intl = useIntl();

    /** Latest save handler for imperative `submit()` — updated in layout effect (not during render). */
    const deleteHandlerRef = useRef<() => void>(() => {});

    // Handlers

    const handleOnDelete = () => {
      onDelete?.(priceList?.rates?.filter((_, index) => index !== rateIndex) ?? []);
    };

    // Effects

    useImperativeHandle(
      ref,
      () => ({
        submit: () => {
          deleteHandlerRef.current();
        },
      }),
      []
    );

    useLayoutEffect(() => {
      deleteHandlerRef.current = handleOnDelete;
    });

    return (
      <Stack hasGutter>
        <StackItem>
          {priceList?.name
            ? intl.formatMessage(messages.deleteRateDesc, {
                metric: (
                  <b>
                    {priceList?.rates?.[rateIndex]?.metric?.label_metric || priceList?.rates?.[rateIndex]?.metric?.name}
                  </b>
                ),
                priceList: <b>{priceList?.name || ''}</b>,
                count: priceList?.assigned_cost_model_count > 0 ? 2 : 1,
              })
            : intl.formatMessage(messages.deleteRateCurrentPriceListDesc, {
                metric: (
                  <b>
                    {priceList?.rates?.[rateIndex]?.metric?.label_metric || priceList?.rates?.[rateIndex]?.metric?.name}
                  </b>
                ),
              })}
        </StackItem>
        {priceList?.assigned_cost_model_count > 0 && (
          <>
            <StackItem>
              <Content component={ContentVariants.ol}>
                {priceList?.assigned_cost_models?.map((costModel, index) => (
                  <Content component={ContentVariants.li} key={`cost-model-${index}`}>
                    {costModel?.name || ''}
                  </Content>
                ))}
              </Content>
            </StackItem>
            <StackItem>
              <Content component={ContentVariants.ul}>
                <Content component={ContentVariants.li}>
                  {intl.formatMessage(messages.recalculateCurrentMonthDesc)}
                </Content>
                <Content component={ContentVariants.li}>
                  {intl.formatMessage(messages.recalculatePreviousMonthDesc)}
                </Content>
              </Content>
            </StackItem>
          </>
        )}
      </Stack>
    );
  }
);

DeleteRateContent.displayName = 'DeleteRateContent';

export { DeleteRateContent };
