import { Button, ButtonVariant, FormGroup, Grid, GridItem, Radio, Switch } from '@patternfly/react-core';
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
              label={intl.formatMessage(messages.measurement)}
              toggleAriaLabel={intl.formatMessage(messages.costModelsSelectMeasurement)}
              value={
                !metricsHash[metric][measurement]
                  ? measurement
                  : getMeasurementLabel(measurement, metricsHash[metric][measurement].label_measurement_unit)
              }
              onSelect={(_evt, value) => setMeasurement(value)}
              placeholderText={intl.formatMessage(messages.select)}
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
              label={intl.formatMessage(messages.calculationType)}
            >
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
            {metric !== 'Cluster' ? (
              <Switch
                aria-label={intl.formatMessage(messages.costModelsEnterTagRate)}
                label={intl.formatMessage(messages.costModelsEnterTagRate)}
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
              onChange={(_evt, value) => setRegular(value)}
              style={style}
              validated={errors.tieredRates && regularDirty ? 'error' : 'default'}
              value={tagValue}
            />
          ) : (
            <>
              <SimpleInput
                isRequired
                style={style}
                value={tagKey}
                onChange={(_evt, value) => setTagKey(value)}
                id="tag-key"
                label={messages.costModelsFilterTagKey}
                placeholder={intl.formatMessage(messages.costModelsEnterTagKey)}
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
                <PlusCircleIcon /> {intl.formatMessage(messages.costModelsAddTagValues)}
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
