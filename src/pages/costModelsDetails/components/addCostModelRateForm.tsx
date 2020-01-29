import {
  Button,
  FormGroup,
  FormSelect,
  FormSelectOption,
  InputGroup,
  InputGroupText,
  TextInput,
} from '@patternfly/react-core';
import { DollarSignIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import { MetricHash } from 'api/metrics';
import { Form } from 'components/forms/form';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { styles } from '../../createCostModelWizard/wizard.styles';

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

export interface Option {
  label: string;
  value: string;
}

interface CategorySelectorProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  defaultOption?: Option;
  options: Option[];
}

const CategorySelector: React.SFC<CategorySelectorProps> = ({
  label,
  id,
  value,
  onChange,
  defaultOption,
  options,
}) => (
  <FormGroup label={label} fieldId={id}>
    <FormSelect value={value} onChange={onChange} aria-label={label} id={id}>
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

export const AddCostModelRateFormBase: React.SFC<AddCostModelRateFormProps> = ({
  t,
  metric,
  setMetric,
  metricOptions,
  measurement,
  setMeasurement,
  measurementOptions,
  setRate,
  rate,
  validRate,
  enableSubmit,
  submit,
}) => {
  const defaultOption = {
    label: t('cost_models.add_rate_form.default_option'),
    value: '',
  };
  return (
    <Form className={css(styles.form)}>
      <CategorySelector
        label={t(`cost_models.add_rate_form.metric_select`)}
        id={'metric-selector'}
        value={metric}
        onChange={setMetric}
        defaultOption={defaultOption}
        options={metricOptions}
      />
      {Boolean(metric) && (
        <CategorySelector
          label={t(`cost_models.add_rate_form.measurement_select`)}
          id={'measurement-selector'}
          value={measurement}
          onChange={setMeasurement}
          defaultOption={defaultOption}
          options={measurementOptions}
        />
      )}
      {Boolean(measurement) && (
        <FormGroup
          label={t('cost_models.add_rate_form.rate_input')}
          fieldId="rate-input"
          helperTextInvalid={t('cost_models.add_rate_form.error_message')}
          isValid={validRate}
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
              value={rate}
              onChange={setRate}
              isValid={validRate}
            />
          </InputGroup>
        </FormGroup>
      )}
      {Boolean(measurement) && Boolean(submit) && (
        <div>
          <Button onClick={submit} isDisabled={enableSubmit}>
            {t('cost_models.add_rate_form.save_rate_button')}
          </Button>
        </div>
      )}
    </Form>
  );
};

export default translate()(AddCostModelRateFormBase);
