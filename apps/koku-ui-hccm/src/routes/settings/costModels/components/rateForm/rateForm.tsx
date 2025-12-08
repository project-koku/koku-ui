import { Alert, Button, ButtonVariant, FormGroup, Grid, GridItem, Radio, Switch } from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import type { MetricHash } from 'api/metrics';
import { intl as defaultIntl } from 'components/i18n';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { RateInput } from 'routes/settings/costModels/components/inputs/rateInput';
import { Selector } from 'routes/settings/costModels/components/inputs/selector';
import { SimpleInput } from 'routes/settings/costModels/components/inputs/simpleInput';
import { unitsLookupKey } from 'utils/format';

import { GpuRatesForm } from './gpuRatesForm';
import { TaggingRatesForm } from './taggingRatesForm';
import type { UseRateData } from './useRateForm';

interface RateFormOwnProps {
  currencyUnits?: string;
  rateFormData: UseRateData;
  metricsHash: MetricHash;
}

type RateFormProps = RateFormOwnProps & WrappedComponentProps;

// defaultIntl required for testing
const RateFormBase: React.FC<RateFormProps> = ({ currencyUnits, intl = defaultIntl, metricsHash, rateFormData }) => {
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
      0: { value: tagValue, isDirty: regularDirty },
    },
    toggleTaggingRate,
    updateDefaultTag,
    updateTag,
  } = rateFormData;
  const getMetricLabel = m => {
    // Match message descriptor or default to API string
    const value = m.replace(/ /g, '_').toLowerCase();
    return intl.formatMessage(messages.metricValues, { value }) || m;
  };
  const getMeasurementLabel = (m, u) => {
    // Match message descriptor or default to API string
    const units = intl.formatMessage(messages.units, { units: unitsLookupKey(u) }) || u;
    return (
      intl.formatMessage(messages.measurementValues, {
        value: m.toLowerCase().replace('-', '_'),
        units,
        count: 2,
      }) || m
    );
  };
  const getMeasurementDescription = (o, u) => {
    // Match message descriptor or default to API string
    const units = intl.formatMessage(messages.units, { units: unitsLookupKey(u) }) || u;
    const desc = intl.formatMessage(messages.measurementValuesDesc, {
      value: o.toLowerCase().replace('-', '_'),
      units: units ? units : u,
    });
    return desc ? desc : o;
  };
  const metricOptions = React.useMemo(() => {
    return Object.keys(metricsHash).map(m => ({
      label: getMetricLabel(m),
      value: m,
    }));
  }, [metricsHash]);
  const measurementOptions = React.useMemo(() => {
    if (!metricOptions.find(m => m.value === metric)) {
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
        label={messages.description}
        value={description}
        validated={errors.description ? 'error' : 'default'}
        helperTextInvalid={errors.description}
        onChange={(_evt, value) => setDescription(value)}
      />
      <Grid hasGutter>
        <GridItem span={6}>
          <Selector
            isRequired
            style={style}
            id="metric-selector"
            toggleAriaLabel={intl.formatMessage(messages.costModelsSelectMetric)}
            label={intl.formatMessage(messages.metric)}
            placeholderText={intl.formatMessage(messages.select)}
            value={metric}
            onSelect={(_evt, value) => setMetric(value)}
            options={metricOptions}
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
              label={intl.formatMessage(messages.measurement)}
              toggleAriaLabel={intl.formatMessage(messages.costModelsSelectMeasurement)}
              value={
                !metricsHash[metric]?.[measurement]
                  ? measurement
                  : getMeasurementLabel(
                      metricsHash[metric]?.[measurement].label_measurement,
                      metricsHash[metric]?.[measurement].label_measurement_unit
                    )
              }
              onSelect={(_evt, value) => setMeasurement(value)}
              placeholderText={intl.formatMessage(messages.select)}
              options={[
                ...measurementOptions.map(opt => {
                  const m = metricsHash[metric][opt];
                  const unit = m.label_measurement_unit;
                  return {
                    label: getMeasurementLabel(m.label_measurement, unit),
                    value: m.metric,
                    isDisabled: false,
                    description: getMeasurementDescription(m.label_measurement, unit),
                  };
                }),
              ]}
            />
          </GridItem>
        )}
      </Grid>
      {step === 'set_rate' ? (
        <>
          {metric.toLowerCase() === 'gpu' && (
            <Alert isInline isPlain title={intl.formatMessage(messages.costModelsGpuDesc)} variant="info">
              <a href={intl.formatMessage(messages.docsCostModelsGpu)} rel="noreferrer" target="_blank">
                {intl.formatMessage(messages.costModelsGpuLearnMore)}
              </a>
            </Alert>
          )}
          <FormGroup isInline style={style} fieldId="calculation" label={intl.formatMessage(messages.calculationType)}>
            <Radio
              name="calculation"
              id="calculation-infra"
              label={intl.formatMessage(messages.infrastructure)}
              isChecked={calculation === 'Infrastructure'}
              onChange={() => setCalculation('Infrastructure')}
            />
            <Radio
              name="calculation"
              id="calculation-suppl"
              label={intl.formatMessage(messages.supplementary)}
              isChecked={calculation === 'Supplementary'}
              onChange={() => setCalculation('Supplementary')}
            />
          </FormGroup>
          {metric.toLowerCase() !== 'cluster' && metric.toLowerCase() !== 'gpu' ? (
            <Switch
              aria-label={intl.formatMessage(messages.costModelsEnterTagRate)}
              label={intl.formatMessage(messages.costModelsEnterTagRate)}
              isChecked={rateKind === 'tagging'}
              isDisabled={metric.toLowerCase() === 'project'}
              onChange={toggleTaggingRate}
            />
          ) : null}
          {rateKind === 'regular' ? (
            <RateInput
              currencyUnits={currencyUnits}
              fieldId="regular-rate"
              helperTextInvalid={errors.tieredRates}
              onChange={(_evt, value) => setRegular(value)}
              style={style}
              validated={errors.tieredRates && regularDirty ? 'error' : 'default'}
              value={tagValue}
            />
          ) : (
            <>
              {metric.toLowerCase() === 'gpu' ? (
                <>
                  <SimpleInput
                    helperTextInvalid={errors.tagKey}
                    id="tag-key"
                    isRequired
                    label={messages.costModelsGpuVendor}
                    onChange={(_evt, value) => setTagKey(value)}
                    placeholder={intl.formatMessage(messages.costModelsEnterGpuVendor)}
                    style={style}
                    validated={errors.tagKey && isTagKeyDirty ? 'error' : 'default'}
                    value={tagKey}
                  />
                  <GpuRatesForm
                    currencyUnits={currencyUnits}
                    errors={{
                      tagValues: errors.tagValues,
                      tagValueValues: errors.tagValueValues,
                      tagDescription: errors.tagDescription,
                    }}
                    removeTag={removeTag}
                    tagValues={tagValues}
                    updateTag={updateTag}
                  />
                </>
              ) : (
                <>
                  <SimpleInput
                    helperTextInvalid={errors.tagKey}
                    isRequired
                    id="tag-key"
                    label={messages.costModelsFilterTagKey}
                    onChange={(_evt, value) => setTagKey(value)}
                    placeholder={intl.formatMessage(messages.costModelsEnterTagKey)}
                    style={style}
                    validated={errors.tagKey && isTagKeyDirty ? 'error' : 'default'}
                    value={tagKey}
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
                </>
              )}
              <Button icon={<PlusCircleIcon />} style={addStyle} variant={ButtonVariant.link} onClick={addTag}>
                {intl.formatMessage(
                  metric.toLowerCase() === 'gpu' ? messages.costModelsAddGpu : messages.costModelsAddTagValues
                )}
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
