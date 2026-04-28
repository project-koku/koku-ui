import './editPriceListModal.scss';

import type { CalendarMonthInlineProps } from '@patternfly/react-core';
import {
  Button,
  CalendarMonth,
  Content,
  ContentVariants,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  Stack,
  StackItem,
  TextArea,
  TextInputGroup,
  TextInputGroupMain,
  Tooltip,
} from '@patternfly/react-core';
import type { PriceListData } from 'api/priceList';
import { PriceListType } from 'api/priceList';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { priceListActions, priceListSelectors } from 'store/priceList';
import { formatDate } from 'utils/dates';

import { styles } from './editPriceListModal.styles';

interface EditPriceListModalOwnProps {
  isOpen?: boolean;
  onClose?: () => void;
  onUpdateSuccess?: () => void;
  priceList: PriceListData;
}

interface EditPriceListModalMapProps {
  priceListType: PriceListType;
}

interface EditPriceListModalStateProps {
  priceListUpdateError?: AxiosError;
  priceListUpdateStatus?: FetchStatus;
}

type EditPriceListModalProps = EditPriceListModalOwnProps;

const getEffectiveDate = (date: string | undefined) => (date ? new Date(date + 'T00:00:00') : undefined);

/** Copy so CalendarMonth / React state never share a mutable Date instance with props-derived values. */
const cloneMonthDate = (d: Date | undefined) => (d ? new Date(d.getTime()) : undefined);

const EditPriceListModal: React.FC<EditPriceListModalProps> = ({ isOpen, onClose, onUpdateSuccess, priceList }) => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const priceListType = PriceListType.priceListUpdate;
  const [isFinish, setIsFinish] = useState(false);
  const { priceListUpdateError, priceListUpdateStatus } = useMapToProps({ priceListType });

  const [description, setDescription] = useState<string>();
  const [descriptionBaseline, setDescriptionBaseline] = useState<string>();
  const [endDate, setEndDate] = useState<Date>();
  const [endDateBaseline, setEndDateBaseline] = useState<Date>();
  const [name, setName] = useState<string>();
  const [nameBaseline, setNameBaseline] = useState<string>();
  const [startDate, setStartDate] = useState<Date>();
  const [startDateBaseline, setStartDateBaseline] = useState<Date>();

  const modalWasClosedRef = useRef(true);
  const [calendarMountKey, setCalendarMountKey] = useState(0);

  // Reset the form from props whenever the modal is opened or `priceList` changes while it is open.
  // (Syncing on `isOpen` ensures unsaved edits are dropped when the user closes and reopens the modal.)
  useEffect(() => {
    if (isOpen === false) {
      modalWasClosedRef.current = true;
      return;
    }

    const reopening = modalWasClosedRef.current;
    modalWasClosedRef.current = false;

    const nextEnd = cloneMonthDate(getEffectiveDate(priceList?.effective_end_date));
    const nextStart = cloneMonthDate(getEffectiveDate(priceList?.effective_start_date));

    setIsFinish(false);
    setDescription(priceList?.description ?? '');
    setDescriptionBaseline(priceList?.description ?? '');
    setEndDate(nextEnd);
    setEndDateBaseline(cloneMonthDate(nextEnd));
    setName(priceList?.name ?? '');
    setNameBaseline(priceList?.name ?? '');
    setStartDate(nextStart);
    setStartDateBaseline(cloneMonthDate(nextStart));

    // CalendarMonth keeps internal navigation state; remount when the modal was closed so dates match props.
    if (reopening) {
      setCalendarMountKey(k => k + 1);
    }
  }, [isOpen, priceList]);

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
        key={isStartDate ? `edit-pl-cal-start-${calendarMountKey}` : `edit-pl-cal-end-${calendarMountKey}`}
        className="calendarOverride"
        date={isStartDate ? startDate : endDate}
        inlineProps={inlineProps}
        onMonthChange={(_event, date: Date) => (isStartDate ? setStartDate(date) : setEndDate(date))}
      />
    );
  };

  // effective_end_date must be on the last day of the month.
  const getFormattedEndDateFrom = (d: Date | undefined) => {
    if (!d) {
      return undefined;
    }
    const newDate = new Date(d);
    const lastDayOfMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
    newDate.setDate(lastDayOfMonth.getDate());
    return formatDate(newDate);
  };

  // effective_start_date must be on the first day of the month
  const getFormattedStartDateFrom = (d: Date | undefined) => {
    if (!d) {
      return undefined;
    }
    const newDate = new Date(d);
    newDate.setDate(1);
    return formatDate(newDate);
  };

  const getFormattedEndDate = () => getFormattedEndDateFrom(endDate);
  const getFormattedStartDate = () => getFormattedStartDateFrom(startDate);

  const hasUnsavedChanges =
    (name ?? '') !== nameBaseline ||
    (description ?? '') !== descriptionBaseline ||
    getFormattedStartDateFrom(startDate) !== getFormattedStartDateFrom(startDateBaseline) ||
    getFormattedEndDateFrom(endDate) !== getFormattedEndDateFrom(endDateBaseline);

  const handleOnSave = () => {
    if (!hasUnsavedChanges || priceListUpdateStatus === FetchStatus.inProgress) {
      return;
    }
    setIsFinish(true);
    dispatch(
      priceListActions.updatePriceList(priceListType, priceList?.uuid, {
        description,
        effective_end_date: getFormattedEndDate(),
        effective_start_date: getFormattedStartDate(),
        name,
      })
    );
  };

  useEffect(() => {
    if (isFinish && priceListUpdateStatus === FetchStatus.complete && !priceListUpdateError) {
      onUpdateSuccess?.();
    }
  }, [isFinish, priceListUpdateError, priceListUpdateStatus]);

  // PatternFly modal appends to document.body, which is outside the scoped "costManagement" dom tree.
  // Use className="costManagement" to override PatternFly styles or append the modal to an element within the tree

  return (
    <Modal className="costManagement" isOpen={isOpen} onClose={onClose} variant={ModalVariant.medium}>
      <ModalHeader title={intl.formatMessage(messages.editPriceListTitle)} />
      <ModalBody className="modalBodyOverride">
        <Stack hasGutter>
          <StackItem>
            <Content>
              <Content component={ContentVariants.dl}>
                <Content component={ContentVariants.dt}>{intl.formatMessage(messages.names, { count: 1 })}</Content>
                <Content component={ContentVariants.dd}>
                  <TextInputGroup>
                    <TextInputGroupMain value={name} onChange={(_event, value) => setName(value)} />
                  </TextInputGroup>
                </Content>
                <Content component={ContentVariants.dt}>{intl.formatMessage(messages.descriptionOptional)}</Content>
                <Content component={ContentVariants.dd}>
                  <TextArea
                    aria-label={intl.formatMessage(messages.descriptionOptional)}
                    value={description}
                    onChange={(_event, value) => setDescription(value)}
                  />
                </Content>
                <Content component={ContentVariants.dt}>{intl.formatMessage(messages.currency)}</Content>
                <Content component={ContentVariants.dd}>
                  <Tooltip content={intl.formatMessage(messages.priceListCurrencyReadOnly)}>
                    <span>{priceList?.currency || ''}</span>
                  </Tooltip>
                </Content>
                <Content component={ContentVariants.dt}>{intl.formatMessage(messages.validityPeriod)}</Content>
                <Content component={ContentVariants.dd} className="calendarOverride">
                  <div style={styles.calendar}>
                    {getCalendar(true)}
                    <div style={styles.calendarSeparator} />
                    {getCalendar(false)}
                  </div>
                </Content>
              </Content>
            </Content>
          </StackItem>
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button
          isAriaDisabled={!hasUnsavedChanges || priceListUpdateStatus === FetchStatus.inProgress}
          onClick={handleOnSave}
          variant="primary"
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

const useMapToProps = ({ priceListType }: EditPriceListModalMapProps): EditPriceListModalStateProps => {
  const priceListUpdateError = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListUpdateError(state, priceListType, undefined)
  );
  const priceListUpdateStatus = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListUpdateStatus(state, priceListType, undefined)
  );

  return {
    priceListUpdateError,
    priceListUpdateStatus,
  };
};

export { EditPriceListModal };
