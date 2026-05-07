import './detailsContent.scss';

import type { CalendarMonthInlineProps } from '@patternfly/react-core';
import {
  Alert,
  CalendarMonth,
  Content,
  ContentVariants,
  HelperText,
  HelperTextItem,
  Stack,
  StackItem,
  Tooltip,
} from '@patternfly/react-core';
import type { PriceListData } from 'api/priceList';
import messages from 'locales/messages';
import { clone } from 'lodash';
import React, { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import type { MessageDescriptor } from 'react-intl';
import { useIntl } from 'react-intl';
import { Currency } from 'routes/components/currency';
import { SimpleInput } from 'routes/settings/components';
import { SimpleArea } from 'routes/settings/components/simpleArea';
import { formatDate } from 'utils/dates';

import { styles } from './detailsContent.styles';
import { validateDescription, validateEndDate, validateName, validateStartDate } from './utils';

interface DetailsContentOwnProps {
  isEditDetails?: boolean;
  onDisabled?: (value: boolean) => void;
  onSave?: (payload: PriceListData) => void;
  priceList: PriceListData;
}

type DetailsContentProps = DetailsContentOwnProps;

export interface DetailsContentHandle {
  // Builds the rate from form state and invokes onSave
  save: () => void;
}

const DetailsContent = forwardRef<DetailsContentHandle, DetailsContentProps>(
  ({ isEditDetails, onDisabled, onSave, priceList }, ref) => {
    const intl = useIntl();

    /** Latest save handler for imperative `save()` — updated in layout effect (not during render). */
    const saveHandlerRef = useRef<() => void>(() => {});

    const getEffectiveDate = (date: string | undefined) => (date ? new Date(date + 'T00:00:00') : undefined);
    const nextEnd = clone(getEffectiveDate(priceList?.effective_end_date));
    const nextStart = clone(getEffectiveDate(priceList?.effective_start_date));

    const [currency, setCurrency] = useState<string>(priceList?.currency ?? 'USD');
    const [currencyBaseline] = useState<string>(priceList?.currency ?? 'USD');
    const [description, setDescription] = useState<string>(priceList?.description ?? '');
    const [descriptionBaseline] = useState<string>(priceList?.description ?? '');
    const [descriptionError, setDescriptionError] = useState<MessageDescriptor>();
    const [endDate, setEndDate] = useState<Date>(nextEnd);
    const [endDateBaseline] = useState<Date>(nextEnd);
    const [endDateError, setEndDateError] = useState<MessageDescriptor>();
    const [name, setName] = useState<string>(priceList?.name ?? '');
    const [nameBaseline] = useState<string>(priceList?.name ?? '');
    const [nameError, setNameError] = useState<MessageDescriptor>();
    const [startDate, setStartDate] = useState<Date>(nextStart);
    const [startDateBaseline] = useState<Date>(nextStart);
    const [startDateError, setStartDateError] = useState<MessageDescriptor>();

    const isCurrencyDirty = currency !== currencyBaseline && !isEditDetails;
    const isNameDirty = name !== nameBaseline;
    const isDescriptionDirty = description !== descriptionBaseline;
    const isEndDateDirty = endDate !== endDateBaseline;
    const isStartDateDirty = startDate !== startDateBaseline;

    const isCurrencyInvalid = !currency && isCurrencyDirty;
    const isNameInvalid = (!name && isNameDirty) || nameError !== undefined;
    const isDescriptionInvalid = (!description && isDescriptionDirty) || descriptionError !== undefined;
    const isEndDateInvalid = (!endDate && isEndDateDirty) || endDateError !== undefined;
    const isStartDateInvalid = (!startDate && isStartDateDirty) || startDateError !== undefined;

    // Unsaved changes checks
    const hasAddDetailsChanges =
      isCurrencyDirty && isNameDirty && isDescriptionDirty && isEndDateDirty && isStartDateDirty;

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

    const getCalendar = (isStartDate: boolean) => {
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
          className="calendarOverride"
          date={isStartDate ? startDate : endDate}
          id={isStartDate ? 'start-date' : 'end-date'}
          inlineProps={inlineProps}
          onMonthChange={(_event, date: Date) =>
            isStartDate ? handleOnStartMonthChange(date) : handleOnEndMonthChange(date)
          }
        />
      );
    };

    // effective_end_date must be on the last day of the month.
    const getFormattedEndDate = (date: Date | undefined) => {
      if (!date) {
        return undefined;
      }
      const newDate = new Date(date);
      const lastDayOfMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
      newDate.setDate(lastDayOfMonth.getDate());
      return formatDate(newDate);
    };

    // effective_start_date must be on the first day of the month
    const getFormattedStartDate = (date: Date | undefined) => {
      if (!date) {
        return undefined;
      }
      const newDate = new Date(date);
      newDate.setDate(1);
      return formatDate(newDate);
    };

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

    const handleOnEndMonthChange = (date: Date) => {
      setEndDate(date);

      const error = validateEndDate(date, startDate);
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
        effective_end_date: getFormattedEndDate(endDate),
        effective_start_date: getFormattedStartDate(startDate),
        name,
      });
    };

    const handleOnStartMonthChange = (date: Date) => {
      setStartDate(date);

      const error = validateStartDate(date, endDate);
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
          saveHandlerRef.current();
        },
      }),
      []
    );

    useLayoutEffect(() => {
      saveHandlerRef.current = handleOnSave;
    });

    return (
      <Stack hasGutter>
        <StackItem>
          <Content>
            <Content component={ContentVariants.dl}>
              <Content component={ContentVariants.dt}>{intl.formatMessage(messages.names, { count: 1 })}</Content>
              <Content component={ContentVariants.dd}>
                <SimpleInput
                  helperTextInvalid={nameError}
                  id="name"
                  isRequired
                  label={intl.formatMessage(messages.names, { count: 1 })}
                  onChange={(_evt, value) => handleOnNameChange(value)}
                  validated={nameError ? 'error' : 'default'}
                  value={name}
                />
              </Content>
              <Content component={ContentVariants.dt}>{intl.formatMessage(messages.descriptionOptional)}</Content>
              <Content component={ContentVariants.dd}>
                <SimpleArea
                  helperTextInvalid={descriptionError}
                  id="description"
                  label={intl.formatMessage(messages.descriptionOptional)}
                  onChange={(_evt, value) => handleOnDescriptionChange(value)}
                  validated={descriptionError ? 'error' : 'default'}
                  value={description}
                />
              </Content>
              <Content component={ContentVariants.dt}>{intl.formatMessage(messages.currency)}</Content>
              <Content component={ContentVariants.dd}>
                {isEditDetails ? (
                  <Tooltip content={intl.formatMessage(messages.priceListCurrencyReadOnly)}>
                    <span>{priceList?.currency || ''}</span>
                  </Tooltip>
                ) : (
                  <Currency currency={currency} onSelect={setCurrency} />
                )}
              </Content>
              <Content component={ContentVariants.dt}>{intl.formatMessage(messages.validityPeriod)}</Content>
              <Content component={ContentVariants.dd} className="calendarOverride">
                <div style={styles.calendar}>
                  <div style={styles.calendarContainer}>
                    {getCalendar(true)}
                    {startDateError && (
                      <HelperText>
                        <HelperTextItem variant="error">
                          {intl.formatMessage(messages.validityPeriodStartMonthError)}
                        </HelperTextItem>
                      </HelperText>
                    )}
                  </div>
                  <div style={styles.calendarContainer}>
                    {getCalendar(false)}
                    {endDateError && (
                      <HelperText>
                        <HelperTextItem variant="error">
                          {intl.formatMessage(messages.validityPeriodEndMonthError)}
                        </HelperTextItem>
                      </HelperText>
                    )}
                  </div>
                </div>
              </Content>
            </Content>
          </Content>
        </StackItem>
        <StackItem>
          <Alert variant="warning" isInline title={intl.formatMessage(messages.validityPeriodWarning)} />
        </StackItem>
      </Stack>
    );
  }
);

export { DetailsContent };
