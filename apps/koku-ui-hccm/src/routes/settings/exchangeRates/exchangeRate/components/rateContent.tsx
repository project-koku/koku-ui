import './rateContent.scss';

import type { CalendarMonthInlineProps } from '@patternfly/react-core';
import { Button } from '@patternfly/react-core';
import { ContentVariants } from '@patternfly/react-core';
import { Split, Stack, StackItem } from '@patternfly/react-core';
import { SplitItem } from '@patternfly/react-core';
import {
  Alert,
  AlertActionCloseButton,
  CalendarMonth,
  Content,
  Form,
  FormGroup,
  HelperText,
  HelperTextItem,
} from '@patternfly/react-core';
import { ArrowsAltHIcon } from '@patternfly/react-icons';
import { getQuery } from 'api/queries/query';
import type { Settings, SettingsData, SettingsRateData } from 'api/settings';
import { SettingsType } from 'api/settings';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import { isEqual } from 'lodash';
import React, { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import type { MessageDescriptor } from 'react-intl';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import type { SelectWrapperOption } from 'routes/components/selectWrapper';
import { Selector, SimpleInput } from 'routes/settings/components';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { settingsActions, settingsSelectors } from 'store/settings';
import { formatDate } from 'utils/dates';
import { formatCurrencyRateRaw, getCurrencySymbol } from 'utils/format';

import { styles } from './rateContent.styles';
import {
  findOverlappingRate,
  getEffectiveDate,
  getEffectiveEndDate,
  getEffectiveStartDate,
  parseRateValue,
  validateEndDate,
  validateRate,
  validateStartDate,
} from './utils';

interface RateContentOwnProps {
  isAddRate?: boolean;
  onDisabled?: (value: boolean) => void;
  onSave?: (payload: SettingsRateData) => void;
  settings?: SettingsData[];
  uuid?: string;
}

export interface RateContentStateProps {
  settings?: Settings;
  settingsError?: AxiosError;
  settingsFetchStatus?: FetchStatus;
}

export interface RateContentHandle {
  // Builds the rate from form state and invokes onSave
  save: () => void;
}

type RateContentProps = RateContentOwnProps;

const RateContent = forwardRef<RateContentHandle, RateContentProps>(
  ({ isAddRate, onDisabled, onSave, settings, uuid }, ref) => {
    const intl = useIntl();

    /** Latest save handler for imperative `save()` — updated in layout effect (not during render). */
    const currentHandlerRef = useRef<() => void>(() => {});

    const rate = settings?.flatMap(item => item.static_rates ?? []).find(item => item.uuid === uuid);

    const effectiveEnd = getEffectiveEndDate(getEffectiveDate(rate?.end_date));
    const effectiveStart = getEffectiveStartDate(getEffectiveDate(rate?.start_date));

    const { settings: currencies } = useMapToProps();

    // Form variables

    const [baseCurrency, setBaseCurrency] = useState<string>(rate?.base_currency);
    const [baseCurrencyBaseline] = useState<string>(rate?.base_currency);
    const [endDate, setEndDate] = useState<Date>(effectiveEnd);
    const [endDateBaseline] = useState<Date>(effectiveEnd);
    const [endDateError, setEndDateError] = useState<MessageDescriptor>();
    const [exchangeRateInput, setExchangeRateInput] = useState<string>(
      rate?.exchange_rate != null ? formatCurrencyRateRaw(Number(rate?.exchange_rate), rate.target_currency) : ''
    );
    const [exchangeRate, setExchangeRate] = useState<number>(rate?.exchange_rate);
    const [exchangeRateValueBaseline] = useState<number>(rate?.exchange_rate);
    const [exchangeRateError, setExchangeRateError] = useState<MessageDescriptor>();
    const [startDate, setStartDate] = useState<Date>(effectiveStart);
    const [startDateBaseline] = useState<Date>(effectiveStart);
    const [startDateError, setStartDateError] = useState<MessageDescriptor>();
    const [targetCurrency, setTargetCurrency] = useState<string>(rate?.target_currency);
    const [targetCurrencyBaseline] = useState<string>(rate?.target_currency);

    const [isValidityAlertOpen, setIsValidityAlertOpen] = useState(true);

    const isBaseCurrencyDirty = baseCurrency !== baseCurrencyBaseline;
    const isEndDateDirty = !isEqual(endDate, endDateBaseline);
    const isExchangeRateDirty = exchangeRate !== exchangeRateValueBaseline;
    const isStartDateDirty = !isEqual(startDate, startDateBaseline);
    const isTargetCurrencyDirty = targetCurrency !== targetCurrencyBaseline;

    const isBaseCurrencyInvalid = !baseCurrency && isBaseCurrencyDirty;
    const isEndDateInvalid = (!endDate && isEndDateDirty) || endDateError !== undefined;
    const isExchangeRateInvalid = (!exchangeRate && isExchangeRateDirty) || exchangeRateError !== undefined;
    const isStartDateInvalid = (!startDate && isStartDateDirty) || startDateError !== undefined;
    const isTargetCurrencyInvalid = !targetCurrency && isTargetCurrencyDirty;

    const overlappingRate = findOverlappingRate(
      currencies?.data,
      baseCurrency,
      targetCurrency,
      startDate,
      endDate,
      uuid
    );
    const isDateRangeOverlapping = overlappingRate !== undefined;

    // Unsaved changes checks — add requires all required fields (like price list measurement)
    const hasAddRateChanges = isBaseCurrencyDirty && isExchangeRateDirty && isTargetCurrencyDirty;

    const hasEditRateChanges =
      isBaseCurrencyDirty || isEndDateDirty || isExchangeRateDirty || isStartDateDirty || isTargetCurrencyDirty;

    const hasUnsavedChanges = isAddRate ? hasAddRateChanges : hasEditRateChanges;

    const isDisabled =
      !hasUnsavedChanges ||
      isBaseCurrencyInvalid ||
      isDateRangeOverlapping ||
      isEndDateInvalid ||
      isExchangeRateInvalid ||
      isStartDateInvalid ||
      isTargetCurrencyInvalid;

    // Getters

    const getCalendar = (id: string, isStartDate: boolean) => {
      const inlineProps: CalendarMonthInlineProps = {
        title: (
          <FormGroup
            fieldId={id}
            label={intl.formatMessage(messages.detailsResourceNames, { value: isStartDate ? 'start' : 'end' })}
          />
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

    const handleOnBaseCurrencySelect = (value: string) => {
      setBaseCurrency(value);
    };

    const handleOnEndMonthChange = (date: Date) => {
      const newDate = getEffectiveEndDate(date);
      setEndDate(newDate);

      // Only the field being edited shows an ordering error; keep past-month start errors
      setEndDateError(validateEndDate(newDate, startDate) || undefined);
      setStartDateError(validateStartDate(startDate) || undefined);
    };

    const handleOnExchangeRateChange = (value: string) => {
      const error = validateRate(value);
      setExchangeRate(error ? undefined : parseRateValue(value));
      setExchangeRateError(error || undefined);
      setExchangeRateInput(value);
    };

    const handleOnSave = () => {
      onSave?.({
        base_currency: baseCurrency,
        ...(endDate !== undefined && {
          end_date: formatDate(endDate),
        }),
        exchange_rate: exchangeRate,
        ...(startDate !== undefined && {
          start_date: formatDate(startDate),
        }),
        target_currency: targetCurrency,
      });
    };

    const handleOnStartMonthChange = (date: Date) => {
      const newDate = getEffectiveStartDate(date);
      setStartDate(newDate);

      // Only the field being edited shows an error; clear the other so it doesn't go stale
      setStartDateError(validateStartDate(newDate, endDate) || undefined);
      setEndDateError(undefined);
    };

    const handleOnSwapCurrency = () => {
      setBaseCurrency(targetCurrency);
      setTargetCurrency(baseCurrency);
    };

    const handleOnTargetCurrencySelect = (value: string) => {
      setTargetCurrency(value);
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

    const getCurrencyOptions = (selected: string): SelectWrapperOption[] => {
      return (currencies?.data ?? [])
        .map(currency => ({
          isDisabled: selected === currency.code,
          toString: () =>
            intl.formatMessage(messages.currencyOptions, {
              currency: currency.code,
              symbol: getCurrencySymbol(currency.code),
            }) || currency.description,
          value: currency.code,
        }))
        .sort((a, b) => (a?.toString() ?? '').localeCompare(b?.toString() ?? ''));
    };

    const baseCurrencyOptions = getCurrencyOptions(targetCurrency);
    const targetCurrencyOptions = getCurrencyOptions(baseCurrency);

    return (
      <>
        <Form onSubmit={event => event.preventDefault()}>
          <Stack hasGutter>
            <StackItem>
              <FormGroup
                isRequired
                fieldId="currency-pair"
                label={intl.formatMessage(messages.exchangeRateCurrencyPair)}
              >
                <Split>
                  <SplitItem isFilled>
                    <Selector
                      helperTextInvalid={intl.formatMessage(messages.requiredField)}
                      id="base-currency"
                      isDisabled={baseCurrencyOptions?.length === 0}
                      isInvalid={isBaseCurrencyInvalid}
                      isRequired
                      label={intl.formatMessage(messages.detailsResourceNames, { value: 'base_currency' })}
                      maxMenuHeight={styles.selector.maxHeight as string}
                      options={baseCurrencyOptions}
                      onSelect={(_evt, value) => handleOnBaseCurrencySelect(value)}
                      placeholderText={intl.formatMessage(messages.select)}
                      toggleAriaLabel={intl.formatMessage(messages.priceListSelectMetric)}
                      value={baseCurrency}
                    />
                  </SplitItem>
                  <SplitItem>
                    <div style={styles.swapCurrency}>
                      <Button
                        aria-label={intl.formatMessage(messages.exchangeRateSwapCurrency)}
                        icon={<ArrowsAltHIcon />}
                        isDisabled={!(baseCurrency && targetCurrency)}
                        onClick={handleOnSwapCurrency}
                        variant="plain"
                      />
                    </div>
                  </SplitItem>
                  <SplitItem isFilled>
                    <Selector
                      helperTextInvalid={intl.formatMessage(messages.requiredField)}
                      id="target-currency"
                      isDisabled={targetCurrencyOptions?.length === 0}
                      isInvalid={isTargetCurrencyInvalid}
                      isRequired
                      label={intl.formatMessage(messages.detailsResourceNames, { value: 'target_currency' })}
                      maxMenuHeight={styles.selector.maxHeight as string}
                      options={targetCurrencyOptions}
                      onSelect={(_evt, value) => handleOnTargetCurrencySelect(value)}
                      placeholderText={intl.formatMessage(messages.select)}
                      toggleAriaLabel={intl.formatMessage(messages.priceListSelectMetric)}
                      value={targetCurrency}
                    />
                  </SplitItem>
                </Split>
                <div style={styles.currencyPairDesc}>
                  <Content component={ContentVariants.p}>
                    {intl.formatMessage(messages.exchangeRateCurrencyPairDesc)}
                  </Content>
                </div>
              </FormGroup>
            </StackItem>
          </Stack>
          <FormGroup isRequired fieldId="exchangeRate" label={intl.formatMessage(messages.exchangeRate, { count: 1 })}>
            <SimpleInput
              helperTextInvalid={exchangeRateError}
              id="exchange-rate"
              isRequired
              onChange={(_evt, value) => handleOnExchangeRateChange(value)}
              validated={exchangeRateError ? 'error' : 'default'}
              value={exchangeRateInput}
            />
          </FormGroup>
          <FormGroup isRequired fieldId="start-date" label={intl.formatMessage(messages.validityPeriod)}>
            <div style={styles.validityPeriodDesc}>
              <Content component={ContentVariants.p}>
                {intl.formatMessage(messages.exchangeRateValidityPeriodDesc)}
              </Content>
            </div>
            <div className="calendarOverride">
              <div style={styles.calendarContainer}>
                {getCalendar('start-date', true)}
                {startDateError && (
                  <HelperText>
                    <HelperTextItem variant="error">{intl.formatMessage(startDateError)}</HelperTextItem>
                  </HelperText>
                )}
              </div>
              <div style={styles.calendarContainer}>
                {getCalendar('end-date', false)}
                {endDateError && (
                  <HelperText>
                    <HelperTextItem variant="error">{intl.formatMessage(endDateError)}</HelperTextItem>
                  </HelperText>
                )}
              </div>
            </div>
            {isDateRangeOverlapping && (
              <Alert
                id="overlap"
                isInline
                title={intl.formatMessage(messages.exchangeRateValidityPeriodOverlap, {
                  date: intl.formatDate(getEffectiveDate(overlappingRate.end_date), {
                    month: 'long',
                    year: 'numeric',
                  }),
                })}
                variant="danger"
              />
            )}
          </FormGroup>
        </Form>
        {isValidityAlertOpen && (
          <Alert
            actionClose={<AlertActionCloseButton onClose={() => setIsValidityAlertOpen(false)} />}
            id="info"
            isInline
            style={isDateRangeOverlapping ? styles.validityAlert : undefined}
            title={intl.formatMessage(messages.validityPeriodWarning)}
            variant="info"
          />
        )}
      </>
    );
  }
);

const useMapToProps = (): RateContentStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  const settingsQuery = {
    limit: 1000, // Need all currencies for base and target options
    enabled: true,
  };
  const settingsQueryString = getQuery(settingsQuery);
  const settings = useSelector((state: RootState) =>
    settingsSelectors.selectSettings(state, SettingsType.currency, settingsQueryString)
  );
  const settingsError = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsError(state, SettingsType.currency, settingsQueryString)
  );
  const settingsFetchStatus = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsFetchStatus(state, SettingsType.currency, settingsQueryString)
  );

  useEffect(() => {
    if (settingsFetchStatus !== FetchStatus.inProgress) {
      dispatch(settingsActions.fetchSettings(SettingsType.currency, settingsQueryString));
    }
  }, [dispatch, settingsQueryString]);

  return {
    settings,
    settingsError,
    settingsFetchStatus,
  };
};

RateContent.displayName = 'RateContent';

export { RateContent };
