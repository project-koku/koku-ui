import './detailContent.scss';

import type { CalendarMonthInlineProps } from '@patternfly/react-core';
import {
  Alert,
  AlertActionCloseButton,
  CalendarMonth,
  Content,
  Form,
  FormGroup,
  HelperText,
  HelperTextItem,
  Tooltip,
} from '@patternfly/react-core';
import type { PriceListData } from 'api/priceList';
import messages from 'locales/messages';
import { isEqual } from 'lodash';
import React, { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import type { MessageDescriptor } from 'react-intl';
import { useIntl } from 'react-intl';
import { Currency } from 'routes/components/currency';
import { SimpleArea, SimpleInput } from 'routes/settings/components';
import { formatDate } from 'utils/dates';

import { styles } from './detailContent.styles';
import {
  getEffectiveDate,
  getEffectiveEndDate,
  getEffectiveStartDate,
  validateDescription,
  validateEndDate,
  validateName,
  validateStartDate,
} from './utils';

interface DetailContentOwnProps {
  isEditDetails?: boolean;
  /** Fired when currency changes in the create flow so sibling UI (e.g. add rate) stays in sync. */
  onCurrencyChange?: (currency: string) => void;
  onDisabled?: (value: boolean) => void;
  onSave?: (payload: PriceListData) => void;
  priceList?: PriceListData;
}

export interface DetailContentHandle {
  // Builds the rate from form state and invokes onSave
  save: () => void;
}

type DetailContentProps = DetailContentOwnProps;

const DetailContent = forwardRef<DetailContentHandle, DetailContentProps>(
  ({ isEditDetails, onCurrencyChange, onDisabled, onSave, priceList }, ref) => {
    const intl = useIntl();

    /** Latest save handler for imperative `save()` — updated in layout effect (not during render). */
    const currentHandlerRef = useRef<() => void>(() => {});

    const effectiveEnd = getEffectiveEndDate(getEffectiveDate(priceList?.effective_end_date));
    const effectiveStart = getEffectiveStartDate(getEffectiveDate(priceList?.effective_start_date));

    const [currency, setCurrency] = useState<string>(priceList?.currency ?? 'USD');
    const [currencyBaseline] = useState<string>(priceList?.currency ?? 'USD');
    const [description, setDescription] = useState<string>(priceList?.description ?? '');
    const [descriptionBaseline] = useState<string>(priceList?.description ?? '');
    const [descriptionError, setDescriptionError] = useState<MessageDescriptor>();
    const [endDate, setEndDate] = useState<Date>(effectiveEnd);
    const [endDateBaseline] = useState<Date>(effectiveEnd);
    const [endDateError, setEndDateError] = useState<MessageDescriptor>();
    const [isInfoAlertOpen, setIsInfoAlertOpen] = useState(true);
    const [name, setName] = useState<string>(priceList?.name ?? '');
    const [nameBaseline] = useState<string>(priceList?.name ?? '');
    const [nameError, setNameError] = useState<MessageDescriptor>();
    const [startDate, setStartDate] = useState<Date>(effectiveStart);
    const [startDateBaseline] = useState<Date>(effectiveStart);
    const [startDateError, setStartDateError] = useState<MessageDescriptor>();

    const isCurrencyDirty = currency !== currencyBaseline && !isEditDetails;
    const isNameDirty = name !== nameBaseline;
    const isDescriptionDirty = description !== descriptionBaseline;
    const isEndDateDirty = !isEqual(endDate, endDateBaseline);
    const isStartDateDirty = !isEqual(startDate, startDateBaseline);

    const isCurrencyInvalid = !currency && isCurrencyDirty;
    const isNameInvalid = (!name && isNameDirty) || nameError !== undefined;
    const isDescriptionInvalid = descriptionError !== undefined;
    const isEndDateInvalid = (!endDate && isEndDateDirty) || endDateError !== undefined;
    const isStartDateInvalid = (!startDate && isStartDateDirty) || startDateError !== undefined;

    // Unsaved changes checks
    const hasAddDetailsChanges = isNameDirty; // Other fields all have default values

    const hasEditDetailsChanges =
      isCurrencyDirty || isDescriptionDirty || isEndDateDirty || isNameDirty || isStartDateDirty;

    const hasUnsavedChanges = isEditDetails ? hasEditDetailsChanges : hasAddDetailsChanges;

    const isDisabled =
      !hasUnsavedChanges ||
      isCurrencyInvalid ||
      isDescriptionInvalid ||
      isEndDateInvalid ||
      isNameInvalid ||
      isStartDateInvalid;

    // Getters

    const getCalendar = (id: string, isStartDate: boolean) => {
      const inlineProps: CalendarMonthInlineProps = {
        title: (
          <Content id={isStartDate ? 'start-date' : 'end-date'} style={styles.calendarContent}>
            {intl.formatMessage(messages.detailsResourceNames, { value: isStartDate ? 'start' : 'end' })}
          </Content>
        ),
        ariaLabelledby: isStartDate ? 'start-date' : 'end-date',
      };

      return (
        <CalendarMonth
          date={(isStartDate ? startDate : endDate) ?? new Date()}
          id={id}
          inlineProps={inlineProps}
          onMonthChange={(_event, date: Date) =>
            isStartDate ? handleOnStartMonthChange(date) : handleOnEndMonthChange(date)
          }
          monthAppendTo={document.body}
        />
      );
    };

    // Handlers

    const handleOnCurrencySelect = (value: string) => {
      setCurrency(value);
      onCurrencyChange?.(value);
    };

    const handleOnDescriptionChange = (value: string) => {
      setDescription(value);

      const error = validateDescription(value);
      if (error) {
        setDescriptionError(error);
      } else {
        setDescriptionError(undefined);
      }
    };

    const handleOnEndMonthChange = (date: Date) => {
      const newDate = getEffectiveEndDate(date);
      setEndDate(newDate);

      const error = validateEndDate(newDate, startDate);
      if (error) {
        setEndDateError(error);
      } else {
        setEndDateError(undefined);
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
        currency,
        description,
        ...(endDate !== undefined && {
          effective_end_date: formatDate(endDate),
        }),
        ...(startDate !== undefined && {
          effective_start_date: formatDate(startDate),
        }),
        name,
      });
    };

    const handleOnStartMonthChange = (date: Date) => {
      const newDate = getEffectiveStartDate(date);
      setStartDate(newDate);

      const error = validateStartDate(newDate, endDate);
      if (error) {
        setStartDateError(error);
      } else {
        setStartDateError(undefined);
      }
    };

    // Effects

    useEffect(() => {
      onDisabled?.(isDisabled);
    }, [isDisabled]);

    useImperativeHandle(
      ref,
      () => ({
        save: () => {
          currentHandlerRef.current();
        },
      }),
      []
    );

    useLayoutEffect(() => {
      currentHandlerRef.current = handleOnSave;
    });

    return (
      <>
        <Form isHorizontal onSubmit={event => event.preventDefault()}>
          <SimpleInput
            helperTextInvalid={nameError}
            id="name"
            isRequired
            label={intl.formatMessage(messages.names, { count: 1 })}
            onChange={(_evt, value) => handleOnNameChange(value)}
            validated={nameError ? 'error' : 'default'}
            value={name}
          />
          <SimpleArea
            helperTextInvalid={descriptionError}
            id="description"
            label={intl.formatMessage(messages.descriptionOptional)}
            onChange={(_evt, value) => handleOnDescriptionChange(value)}
            validated={descriptionError ? 'error' : 'default'}
            value={description}
          />
          <FormGroup isRequired fieldId="currency" label={intl.formatMessage(messages.currency)}>
            {isEditDetails ? (
              <Tooltip content={intl.formatMessage(messages.priceListCurrencyReadOnly)}>
                <Currency currency={currency} id="currency" isDisabled showLabel={false} />
              </Tooltip>
            ) : (
              <Currency currency={currency} id="currency" onSelect={handleOnCurrencySelect} showLabel={false} />
            )}
          </FormGroup>
          <FormGroup isRequired fieldId="start-date" label={intl.formatMessage(messages.validityPeriod)}>
            <div className="calendarOverride">
              <div style={styles.calendarContainer}>
                {getCalendar('start-date', true)}
                {startDateError && (
                  <HelperText>
                    <HelperTextItem variant="error">
                      {intl.formatMessage(messages.validityPeriodStartMonthError)}
                    </HelperTextItem>
                  </HelperText>
                )}
              </div>
              <div style={styles.calendarContainer}>
                {getCalendar('end-date', false)}
                {endDateError && (
                  <HelperText>
                    <HelperTextItem variant="error">
                      {intl.formatMessage(messages.validityPeriodEndMonthError)}
                    </HelperTextItem>
                  </HelperText>
                )}
              </div>
            </div>
          </FormGroup>
        </Form>
        {isInfoAlertOpen && (
          <Alert
            actionClose={<AlertActionCloseButton onClose={() => setIsInfoAlertOpen(false)} />}
            id="info"
            isInline
            title={intl.formatMessage(messages.validityPeriodWarning)}
            variant="info"
          />
        )}
      </>
    );
  }
);

export { DetailContent };
