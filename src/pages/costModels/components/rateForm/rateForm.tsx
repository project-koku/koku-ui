import { Button, ButtonVariant, FormGroup, Grid, GridItem, Radio, Switch } from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import { MetricHash } from 'api/metrics';
import { intl as defaultIntl } from 'components/i18n';
import messages from 'locales/messages';
import { RateInput } from 'pages/costModels/components/inputs/rateInput';
import { Selector } from 'pages/costModels/components/inputs/selector';
import { SimpleInput } from 'pages/costModels/components/inputs/simpleInput';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { unitsLookupKey } from 'utils/format';

import { TaggingRatesForm } from './taggingRatesForm';
import { UseRateData } from './useRateForm';

interface RateFormOwnProps {
  currencyUnits?: string;
  rateFormData: UseRateData;
  metricsHash: MetricHash;
}

type RateFormProps = RateFormOwnProps & WrappedComponentProps;

// defaultIntl required for testing
const RateFormBase: React.FunctionComponent<RateFormProps> = ({
  currencyUnits,
  intl = defaultIntl,
  metricsHash,
  rateFormData,
}) => {
  const {
    addTag,
    calculation,
    description,
    errors,
    measurement: { value: measurement, isDirty: measurementDirty },
    metric,
    rateKind,
    removeTag,
    setCalculation,
    setDescription,
    setMeasurement,
    setMetric,
    setRegular,
    setTagKey,
    step,
    taggingRates: {
      tagKey: { value: tagKey, isDirty: isTagKeyDirty },
      defaultTag,
      tagValues,
    },
    tieredRates: {
      0: { inputValue, isDirty: regularDirty },
    },
    toggleTaggingRate,
    updateDefaultTag,
    updateTag,
  } = rateFormData;
  const getMetricLabel = m => {
    // Match message descriptor or default to API string
    const value = m.replace(/ /g, '_').toLowerCase();
    const label = intl.formatMessage(messages.MetricValues, { value });
    return label ? label : m;
  };
  const getMeasurementLabel = (m, u) => {
    // Match message descriptor or default to API string
    const _units = u.replace(/-/g, '_').toLowerCase();
    const units = intl.formatMessage(messages.Units, { units: unitsLookupKey(_units) });
    const label = intl.formatMessage(messages.MeasurementValues, {
      value: m.toLowerCase().replace('-', '_'),
      units: units ? units : u,
      count: 2,
    });
    return label ? label : m;
  };
  const getMeasurementDescription = (o, u) => {
    // Match message descriptor or default to API string
    // units only works with Node, Cluster, and PVC. it does not need to be translated
    // if the metric is CPU, Memory, or Storage, units will be like `core_hours` or `gb_hours` and must be translated
    const units = u.toLowerCase().replace('-', '_');
    const desc = intl.formatMessage(messages.MeasurementValuesDesc, {
      value: o.toLowerCase().replace('-', '_'),
      units: units ? units : u,
    });
    return desc ? desc : o;
  };
  const metricOptions = React.useMemo(() => {
    return Object.keys(metricsHash);
  }, [metricsHash]);
  const measurementOptions = React.useMemo(() => {
    if (!metricOptions.includes(metric)) {
      return [];
    }
    return Object.keys(metricsHash[metric]);
  }, [metricOptions, metric]);
  const style = { width: '360px' };
  const addStyle = {
    paddingLeft: '0',
    textAlign: 'left',
  } as React.CSSProperties;

  return (
    <>
      <SimpleInput
        style={style}
        id="description"
        label={messages.Description}
        value={description}
        validated={errors.description ? 'error' : 'default'}
        helperTextInvalid={errors.description}
        onChange={setDescription}
      />
      <Grid hasGutter>
        <GridItem span={6}>
          <Selector
            isRequired
            style={style}
            id="metric-selector"
            toggleAriaLabel={intl.formatMessage(messages.CostModelsSelectMetric)}
            label={intl.formatMessage(messages.Metric)}
            placeholderText={intl.formatMessage(messages.Select)}
            value={metric}
            onChange={setMetric}
            options={[
              ...metricOptions.map(opt => {
                return {
                  label: getMetricLabel(opt),
                  value: opt,
                  isDisabled: false,
                };
              }),
            ]}
          />
        </GridItem>
        {step === 'initial' ? null : (
          <GridItem span={6}>
            <Selector
              isRequired
              helperTextInvalid={errors.measurement}
              isInvalid={errors.measurement && measurementDirty}
              style={style}
              id="measurement-selector"
              label={intl.formatMessage(messages.Measurement)}
              toggleAriaLabel={intl.formatMessage(messages.CostModelsSelectMeasurement)}
              value={
                !metricsHash[metric][measurement]
                  ? measurement
                  : getMeasurementLabel(measurement, metricsHash[metric][measurement].label_measurement_unit)
              }
              onChange={setMeasurement}
              placeholderText="Select..."
              options={[
                ...measurementOptions.map(opt => {
                  const unit = metricsHash[metric][opt].label_measurement_unit;
                  return {
                    label: getMeasurementLabel(opt, unit),
                    value: opt,
                    isDisabled: false,
                    description: getMeasurementDescription(opt, unit),
                  };
                }),
              ]}
            />
          </GridItem>
        )}
      </Grid>
      {step === 'set_rate' ? (
        <>
          <>
            <FormGroup
              isInline
              style={style}
              fieldId="calculation"
              label={intl.formatMessage(messages.CalculationType)}
            >
              <Radio
                name="calculation"
                id="calculation_infra"
                label={intl.formatMessage(messages.Infrastructure)}
                isChecked={calculation === 'Infrastructure'}
                onChange={() => setCalculation('Infrastructure')}
              />
              <Radio
                name="calculation"
                id="calculation_suppl"
                label={intl.formatMessage(messages.Supplementary)}
                isChecked={calculation === 'Supplementary'}
                onChange={() => setCalculation('Supplementary')}
              />
            </FormGroup>
            {metric !== 'Cluster' ? (
              <Switch
                aria-label={intl.formatMessage(messages.CostModelsEnterTagRate)}
                label={intl.formatMessage(messages.CostModelsEnterTagRate)}
                isChecked={rateKind === 'tagging'}
                onChange={toggleTaggingRate}
              />
            ) : null}
          </>
          {rateKind === 'regular' ? (
            <RateInput
              currencyUnits={currencyUnits}
              fieldId="regular-rate"
              helperTextInvalid={errors.tieredRates}
              onChange={setRegular}
              style={style}
              validated={errors.tieredRates && regularDirty ? 'error' : 'default'}
              value={inputValue}
            />
          ) : (
            <>
              <SimpleInput
                isRequired
                style={style}
                value={tagKey}
                onChange={setTagKey}
                id="tag-key"
                label={messages.CostModelsFilterTagKey}
                placeholder={intl.formatMessage(messages.CostModelsEnterTagKey)}
                validated={errors.tagKey && isTagKeyDirty ? 'error' : 'default'}
                helperTextInvalid={errors.tagKey}
              />
              <TaggingRatesForm
                currencyUnits={currencyUnits}
                defaultTag={defaultTag}
                errors={{
                  tagValues: errors.tagValues,
                  tagValueValues: errors.tagValueValues,
                  tagDescription: errors.tagDescription,
                }}
                removeTag={removeTag}
                tagValues={tagValues}
                updateDefaultTag={updateDefaultTag}
                updateTag={updateTag}
              />
              <Button style={addStyle} variant={ButtonVariant.link} onClick={addTag}>
                <PlusCircleIcon /> {intl.formatMessage(messages.CostModelsAddTagValues)}
              </Button>
            </>
          )}
        </>
      ) : null}
    </>
  );
};

const RateForm = injectIntl(RateFormBase);
export { RateForm };
