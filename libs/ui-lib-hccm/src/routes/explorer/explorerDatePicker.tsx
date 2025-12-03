import messages from '@koku-ui/i18n/locales/messages';
import type { DatePickerRef } from '@patternfly/react-core';
import { DatePicker } from '@patternfly/react-core';
import type { FormEvent } from 'react';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import { formatDate, getLast90DaysDate, getToday } from '../../utils/dates';
import type { RouterComponentProps } from '../../utils/router';
import { withRouter } from '../../utils/router';
import { DateRangeType } from '../utils/dateRange';
import { styles } from './explorerDatePicker.styles';

interface ExplorerDatePickerOwnProps extends RouterComponentProps, WrappedComponentProps {
  dateRangeType?: DateRangeType;
  endDate?: string;
  onSelect(startDate: Date, endDate: Date);
  startDate?: string;
}

interface ExplorerDatePickerState {
  endDate?: Date;
  startDate?: Date;
}

type ExplorerDatePickerProps = ExplorerDatePickerOwnProps;

const MAX_DAYS = 65; // Max date range allowed for cost API

class ExplorerDatePickerBase extends React.Component<ExplorerDatePickerProps, ExplorerDatePickerState> {
  protected defaultState: ExplorerDatePickerState = {
    // TBD
  };
  public state: ExplorerDatePickerState = { ...this.defaultState };

  private startDateRef = React.createRef<DatePickerRef>();
  private endDateRef = React.createRef<DatePickerRef>();

  public componentDidMount() {
    const { dateRangeType, endDate, startDate } = this.props;

    if (this.startDateRef?.current) {
      this.startDateRef.current.setCalendarOpen(dateRangeType !== DateRangeType.custom);
    }
    if (dateRangeType === DateRangeType.custom && endDate && startDate) {
      this.setState({
        startDate: new Date(startDate + 'T00:00:00'),
        endDate: new Date(endDate + 'T00:00:00'),
      });
    }
  }

  public componentDidUpdate(prevProps: ExplorerDatePickerProps, prevState: ExplorerDatePickerState) {
    const { endDate, startDate } = this.state;

    if (prevState.startDate !== startDate) {
      // Don't adjust unless an end date has already been selected
      if (endDate && !this.isEndDateValid(startDate, endDate)) {
        this.setState({ endDate: undefined });
      }
    }
  }

  private getStartDatePicker = () => {
    const { intl } = this.props;
    const { startDate } = this.state;

    const { start_date, end_date } = getLast90DaysDate(false);

    const rangeValidator = (date: Date) => {
      if (date < start_date) {
        return intl.formatMessage(messages.datePickerBeforeError);
      } else if (date > end_date) {
        return intl.formatMessage(messages.datePickerAfterError);
      }
      return '';
    };
    return (
      <DatePicker
        aria-label={intl.formatMessage(messages.datePickerStartDateAriaLabel)}
        onChange={this.handleOnStartDateOnChange}
        placeholder={intl.formatMessage(messages.start)}
        ref={this.startDateRef}
        validators={[rangeValidator]}
        value={formatDate(startDate)}
      />
    );
  };

  private getEndDatePicker = () => {
    const { intl } = this.props;
    const { endDate, startDate } = this.state;

    const end_date = this.getMaxEndDate();
    const rangeValidator = (date: Date) => {
      if (date < startDate) {
        return intl.formatMessage(messages.datePickerBeforeError);
      } else if (date > end_date) {
        return intl.formatMessage(messages.datePickerAfterError);
      }
      return '';
    };
    return (
      <DatePicker
        aria-label={intl.formatMessage(messages.datePickerEndDateAriaLabel)}
        isDisabled={!startDate}
        onChange={this.handleOnEndDateOnChange}
        placeholder={intl.formatMessage(messages.end)}
        rangeStart={startDate}
        ref={this.endDateRef}
        validators={[rangeValidator]}
        value={formatDate(endDate)}
      />
    );
  };

  private getMaxEndDate = () => {
    const { startDate } = this.state;

    const today = getToday();
    const end_date = startDate ? new Date(startDate.getTime()) : today;
    end_date.setDate(end_date.getDate() + MAX_DAYS - 1); // 65 days including start date

    if (end_date > today) {
      end_date.setTime(today.getTime());
    }
    return end_date;
  };

  private isEndDateValid = (startDate, endDate) => {
    const minDate = startDate;
    const maxDate = startDate ? new Date(startDate.getTime()) : undefined;
    if (maxDate) {
      maxDate.setDate(maxDate.getDate() + MAX_DAYS - 1); // 65 days including start date
    }
    return endDate >= minDate && endDate <= maxDate;
  };

  private isStartDateValid = startDate => {
    const maxDate = getToday();
    const { start_date: minDate } = getLast90DaysDate(false);

    return startDate >= minDate && startDate <= maxDate;
  };

  private handleOnEndDateOnChange = (evt: FormEvent, value: string, date?: Date) => {
    const { onSelect } = this.props;
    const { startDate } = this.state;

    if (date && this.isEndDateValid(startDate, date)) {
      this.setState({ endDate: date }, () => {
        if (onSelect) {
          onSelect(startDate, date);
        }
      });
    }
  };

  private handleOnStartDateOnChange = (evt: FormEvent, value: string, date?: Date) => {
    if (date && this.isStartDateValid(date)) {
      this.setState({ startDate: date }, () => {
        if (this.endDateRef?.current) {
          this.endDateRef.current.setCalendarOpen(true);
        }
      });
    }
  };

  public render() {
    const { intl } = this.props;
    return (
      <>
        {this.getStartDatePicker()}
        <span style={styles.toContainer}>{intl.formatMessage(messages.to)}</span>
        {this.getEndDatePicker()}
      </>
    );
  }
}

const ExplorerDatePicker = injectIntl(withRouter(ExplorerDatePickerBase));

export { ExplorerDatePicker };
