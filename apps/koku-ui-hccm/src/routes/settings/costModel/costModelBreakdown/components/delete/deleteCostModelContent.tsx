import { Content, ContentVariants, Stack, StackItem } from '@patternfly/react-core';
import type { CostModel } from 'api/costModels';
import messages from 'locales/messages';
import React, { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from 'react';
import { useIntl } from 'react-intl';

interface DeleteCostModelContentOwnProps {
  costModel: CostModel;
  onDelete?: (costModel: CostModel) => void;
}

export interface DeleteCostModelContentHandle {
  // Builds the rate from form state and invokes onSave
  delete: () => void;
}

type DeleteCostModelContentProps = DeleteCostModelContentOwnProps;

const DeleteCostModelContent = forwardRef<DeleteCostModelContentHandle, DeleteCostModelContentProps>(
  ({ costModel, onDelete }, ref) => {
    const intl = useIntl();

    /** Latest save handler for imperative `submit()` — updated in layout effect (not during render). */
    const deleteHandlerRef = useRef<() => void>(() => {});

    // Handler

    const handleOnDelete = () => {
      onDelete?.(costModel);
    };

    // Effects

    useImperativeHandle(
      ref,
      () => ({
        delete: () => {
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
        {costModel?.sources?.length > 0 ? (
          <>
            <StackItem>{intl.formatMessage(messages.costModelsDeleteSource)}</StackItem>
            <StackItem>
              {intl.formatMessage(messages.costModelsCanNotDelete, {
                name: <b>{costModel?.name}</b>,
              })}
            </StackItem>
            <StackItem>
              <Content component={ContentVariants.ol}>
                {costModel?.sources?.map((source, index) => (
                  <Content component={ContentVariants.li} key={`cost-model-${index}`}>
                    {source?.name || ''}
                  </Content>
                ))}
              </Content>
            </StackItem>
          </>
        ) : (
          <StackItem>
            {intl.formatMessage(messages.costModelsDeleteDesc, {
              costModel: <b>{costModel?.name}</b>,
            })}
          </StackItem>
        )}
      </Stack>
    );
  }
);

DeleteCostModelContent.displayName = 'DeleteCostModelContent';

export { DeleteCostModelContent };
