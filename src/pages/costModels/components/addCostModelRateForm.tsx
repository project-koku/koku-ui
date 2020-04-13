import {
  FormGroup,
  FormSelect,
  FormSelectOption,
  InputGroup,
  InputGroupText,
  TextInput,
} from '@patternfly/react-core';
import { DollarSignIcon } from '@patternfly/react-icons';
import { MetricHash } from 'api/metrics';
import { Option } from 'pages/costModels/components/logic/types';
import React from 'react';
import { InjectedTranslateProps } from 'react-i18next';

export const isRateValid = (rate: string) =>
  (!isNaN(Number(rate)) && Number(rate) > 0) || rate === '';
export const canSubmit = (rate: string) =>
  rate === '' || isNaN(Number(rate)) || Number(rate) <= 0;

export const unusedRates = (
  metricsHash: MetricHash,
  tiers: { metric: string; measurement: string }[]
) => {
  const tiersMap = tiers.reduce((acc, curr) => {
    const measureObj =
      acc[curr.metric] === undefined
        ? { [curr.measurement]: true }
        : { ...acc[curr.metric], [curr.measurement]: true };
    return {
      ...acc,
      [curr.metric]: measureObj,
    };
  }, {});
  return Object.keys(metricsHash).reduce((acc, mtr) => {
    const availableMeasurements = Object.keys(metricsHash[mtr])
      .filter(
        msr => tiersMap[mtr] === undefined || tiersMap[mtr][msr] === undefined
      )
      .map(msr => metricsHash[mtr][msr]);
    if (availableMeasurements.length === 0) {
      return acc;
    }
    return {
      ...acc,
      [mtr]: availableMeasurements.reduce((acc_, curr_) => {
        return { ...acc_, [curr_.label_measurement]: true };
      }, {}),
    };
  }, {});
};

interface CategorySelectorProps {
  isInvalid?: boolean;
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  defaultOption?: Option;
  options: Option[];
  isDisabled?: boolean;
  testId?: string;
}

const CategorySelector: React.SFC<CategorySelectorProps> = ({
  label,
  id,
  isDisabled = false,
  value,
  onChange,
  defaultOption,
  options,
  isInvalid = false,
  testId,
}) => (
  <FormGroup data-testid={testId} label={label} fieldId={id}>
    <FormSelect
      isValid={!isInvalid}
      isDisabled={isDisabled}
      value={value}
      onChange={onChange}
      aria-label={label}
      id={id}
    >
      <FormSelectOption
        isDisabled
        value={defaultOption.value}
        label={defaultOption.label}
      />
      {options.map(opt => (
        <FormSelectOption
          key={`${opt.value}`}
          value={opt.value}
          label={opt.label}
        />
      ))}
    </FormSelect>
  </FormGroup>
);

interface SelectorBaseProps extends InjectedTranslateProps {
  options: Option[];
  onChange: (value: string) => void;
  value: string;
  isDisabled?: boolean;
  isInvalid?: boolean;
}

export const MetricSelectorBase: React.SFC<SelectorBaseProps> = ({
  t,
  value,
  onChange,
  isDisabled = false,
  options,
  isInvalid = false,
}) => {
  return (
    <CategorySelector
      testId={'metric-selector'}
      label={t(`cost_models.add_rate_form.metric_select`)}
      id={'metric-selector'}
      value={value}
      onChange={onChange}
      defaultOption={{
        label: t('cost_models.add_rate_form.default_option'),
        value: '',
      }}
      options={options}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
    />
  );
};

const MeasurementSelectorBase: React.SFC<SelectorBaseProps> = ({
  t,
  value,
  onChange,
  isDisabled = false,
  options,
  isInvalid = false,
}) => {
  return (
    <CategorySelector
      testId={'measurement-selector'}
      label={t(`cost_models.add_rate_form.measurement_select`)}
      id={'measurement-selector'}
      value={value}
      onChange={onChange}
      defaultOption={{
        label: t('cost_models.add_rate_form.default_option'),
        value: '',
      }}
      options={options}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
    />
  );
};

interface InputBase extends InjectedTranslateProps {
  onChange: (value: string) => void;
  value: string;
  isInvalid?: boolean;
}

const RateInputBase: React.SFC<InputBase> = ({
  t,
  value,
  onChange,
  isInvalid = false,
}) => {
  return (
    <FormGroup
      label={t('cost_models.add_rate_form.rate_input')}
      fieldId="rate-input"
      helperTextInvalid={t('cost_models.add_rate_form.error_message')}
      isValid={!isInvalid}
    >
      <InputGroup>
        <InputGroupText>
          <DollarSignIcon />
        </InputGroupText>
        <TextInput
          type="text"
          aria-label={t('cost_models.add_rate_form.rate_input')}
          id="rate-input"
          placeholder="0.00"
          value={value}
          onChange={onChange}
          isValid={!isInvalid}
        />
      </InputGroup>
    </FormGroup>
  );
};

export interface AddCostModelRateFormProps extends InjectedTranslateProps {
  metric: string;
  setMetric: (value: string) => void;
  measurement: string;
  setMeasurement: (value: string) => void;
  rate: string;
  setRate: (value: string) => void;
  metricOptions: Option[];
  measurementOptions: Option[];
  validRate: boolean;
  enableSubmit?: boolean;
  submit?: () => void;
}

export const SetMetric = ({ t, onChange, value, options }) => {
  return (
    <MetricSelectorBase
      t={t}
      onChange={onChange}
      value={value}
      options={options}
    />
  );
};

export const SetMeasurement = ({
  metricChange,
  metric,
  metricOptions,
  measurementChange,
  measurement,
  measurementOptions,
  t,
}) => {
  return (
    <>
      <MetricSelectorBase
        t={t}
        onChange={metricChange}
        value={metric}
        options={metricOptions}
      />
      <MeasurementSelectorBase
        t={t}
        onChange={measurementChange}
        value={measurement}
        options={measurementOptions}
      />
    </>
  );
};

export const SetRate = ({
  metricChange,
  metric,
  metricOptions,
  measurementChange,
  measurement,
  measurementOptions,
  isMeasurementInvalid,
  rate,
  rateChange,
  isRateInvalid,
  t,
}) => {
  return (
    <>
      <MetricSelectorBase
        t={t}
        onChange={metricChange}
        value={metric}
        options={metricOptions}
      />
      <MeasurementSelectorBase
        t={t}
        onChange={measurementChange}
        value={measurement}
        options={measurementOptions}
        isInvalid={isMeasurementInvalid}
      />
      <RateInputBase
        t={t}
        value={rate}
        onChange={rateChange}
        isInvalid={isRateInvalid}
      />
    </>
  );
};
