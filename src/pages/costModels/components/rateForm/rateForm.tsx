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

import { TaggingRatesForm } from './taggingRatesForm';
import { UseRateData } from './useRateForm';

interface RateFormOwnProps {
  rateFormData: UseRateData;
  metricsHash: MetricHash;
}

type RateFormProps = RateFormOwnProps & WrappedComponentProps;

// defaultIntl required for testing
const RateFormBase: React.FunctionComponent<RateFormProps> = ({ intl = defaultIntl, metricsHash, rateFormData }) => {
  const {
    step,
    description,
    metric,
    measurement: { value: measurement, isDirty: measurementDirty },
    calculation,
    rateKind,
    taggingRates: {
      tagKey: { value: tagKey, isDirty: isTagKeyDirty },
      defaultTag,
      tagValues,
    },
    tieredRates: {
      0: { value: regular, isDirty: regularDirty },
    },
    setDescription,
    setMetric,
    setMeasurement,
    setCalculation,
    setRegular,
    toggleTaggingRate,
    setTagKey,
    updateTag,
    updateDefaultTag,
    removeTag,
    addTag,
    errors,
  } = rateFormData;
  const getMetricLabel = m => {
    // Match message descriptor or default to API string
    const value = m.replace(/ /g, '_').toLowerCase();
    const label = intl.formatMessage(messages.MetricValues, { value });
    return label ? label : m;
  };
  const getMeasurementLabel = (m, u) => {
    // Match message descriptor or default to API string
    const units = intl.formatMessage(messages.Units, { units: u.replace(/-/g, '_').toLowerCase() });
    const label = intl.formatMessage(messages.MeasurementValues, {
      value: m.toLowerCase(),
      units: units ? units : u,
      count: 2,
    });
    return label ? label : m;
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
            id="metric"
            label={messages.Metric}
            value={metric}
            onChange={setMetric}
            options={[
              {
                label: messages.Select,
                value: '',
                isDisabled: true,
              },
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
              id="measurement"
              label={messages.Measurement}
              value={measurement}
              onChange={setMeasurement}
              options={[
                {
                  label: messages.Select,
                  value: '',
                  isDisabled: true,
                },
                ...measurementOptions.map(opt => {
                  return {
                    label: getMeasurementLabel(opt, metricsHash[metric][opt].label_measurement_unit),
                    value: opt,
                    isDisabled: false,
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
              style={style}
              helperTextInvalid={errors.tieredRates}
              validated={errors.tieredRates && regularDirty ? 'error' : 'default'}
              value={regular}
              onChange={setRegular}
              fieldId="regular-rate"
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
                errors={{
                  tagValues: errors.tagValues,
                  tagValueValues: errors.tagValueValues,
                  tagDescription: errors.tagDescription,
                }}
                updateDefaultTag={updateDefaultTag}
                defaultTag={defaultTag}
                tagValues={tagValues}
                updateTag={updateTag}
                removeTag={removeTag}
              />
              <Button data-testid="add_more" style={addStyle} variant={ButtonVariant.link} onClick={addTag}>
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
