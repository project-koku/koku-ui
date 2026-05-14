import { Form, FormGroup, Stack, StackItem } from '@patternfly/react-core';
import type { CostModel } from 'api/costModels';
import messages from 'locales/messages';
import React, { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import type { MessageDescriptor } from 'react-intl';
import { useIntl } from 'react-intl';
import { getCurrencyLabel, getCurrencyOptions } from 'routes/components/currency';
import { Selector, SimpleInput } from 'routes/settings/components';
import { SimpleArea } from 'routes/settings/components/simpleArea';

import { styles } from './editCostModelContent.styles';
import { getSourceType, validateDescription, validateName } from './utils';

interface EditCostModelContentOwnProps {
  costModel: CostModel;
  onDisabled?: (value: boolean) => void;
  onSave?: (costModel: CostModel) => void;
}

export interface EditCostModelContentHandle {
  // Builds the rate from form state and invokes onSave
  save: () => void;
}

type EditCostModelContentProps = EditCostModelContentOwnProps;

const EditCostModelContent = forwardRef<EditCostModelContentHandle, EditCostModelContentProps>(
  ({ costModel, onDisabled, onSave }, ref) => {
    const intl = useIntl();

    /** Latest save handler for imperative `submit()` — updated in layout effect (not during render). */
    const saveHandlerRef = useRef<() => void>(() => {});

    const [currency, setCurrency] = useState(costModel?.currency ?? 'USD');
    const [currencyBaseline] = useState(costModel?.currency ?? 'USD');
    const [description, setDescription] = useState(costModel?.description ?? '');
    const [descriptionBaseline] = useState(costModel?.description ?? '');
    const [descriptionError, setDescriptionError] = useState<MessageDescriptor>();
    const [name, setName] = useState(costModel?.name ?? '');
    const [nameBaseline] = useState(costModel?.name ?? '');
    const [nameError, setNameError] = useState<MessageDescriptor>();

    const isCurrencyDirty = currency !== currencyBaseline;
    const isDescriptionDirty = description !== descriptionBaseline;
    const isNameDirty = name !== nameBaseline;

    const isNameInvalid = (!name && isNameDirty) || nameError !== undefined;
    const isDescriptionInvalid = descriptionError !== undefined;

    // Unsaved changes checks
    const hasUnsavedChanges = isCurrencyDirty || isDescriptionDirty || isNameDirty;
    const isDisabled = !hasUnsavedChanges || isDescriptionInvalid || isNameInvalid;

    // Handlers

    const handleOnDescriptionChange = (value: string) => {
      setDescription(value);

      const error = validateDescription(value);
      if (error) {
        setDescriptionError(error);
      } else {
        setDescriptionError(undefined);
      }
    };

    const handleOnNameChange = (value: string) => {
      setName(value);

      const error = validateName(value);
      if (error) {
        setNameError(error);
      } else {
        setNameError(undefined);
      }
    };

    const handleOnSave = () => {
      onSave?.({
        ...costModel,
        currency,
        description,
        name,
        source_type: getSourceType(costModel?.source_type),
      });
    };

    // Effects

    useEffect(() => {
      onDisabled?.(isDisabled);
    }, [isDisabled]);

    useImperativeHandle(
      ref,
      () => ({
        save: () => {
          saveHandlerRef.current();
        },
      }),
      []
    );

    useLayoutEffect(() => {
      saveHandlerRef.current = handleOnSave;
    });

    return (
      <Form onSubmit={event => event.preventDefault()}>
        <Stack hasGutter>
          <StackItem>
            <SimpleInput
              helperTextInvalid={nameError}
              id="name"
              isRequired
              label={intl.formatMessage(messages.names, { count: 1 })}
              onChange={(_evt, value) => handleOnNameChange(value)}
              validated={nameError ? 'error' : 'default'}
              value={name}
            />
          </StackItem>
          <StackItem>
            <SimpleArea
              helperTextInvalid={descriptionError}
              id="description"
              label={intl.formatMessage(messages.descriptionOptional)}
              onChange={(_evt, value) => handleOnDescriptionChange(value)}
              validated={descriptionError ? 'error' : 'default'}
              value={description}
            />
          </StackItem>
          <StackItem>
            <FormGroup fieldId="currency" label={intl.formatMessage(messages.currency)}>
              <Selector
                appendMenuTo="inline"
                direction="up"
                id="currency"
                maxMenuHeight={styles.currency.maxHeight as string}
                options={getCurrencyOptions()}
                onSelect={(_evt, value) => setCurrency(value)}
                toggleAriaLabel={intl.formatMessage(messages.costModelsWizardCurrencyToggleLabel)}
                value={getCurrencyLabel(currency)}
              />
            </FormGroup>
          </StackItem>
        </Stack>
      </Form>
    );
  }
);

EditCostModelContent.displayName = 'EditCostModelContent';

export { EditCostModelContent };
