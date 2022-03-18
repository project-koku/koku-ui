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
      0: { value: regular, isDirty: regularDirty },
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
    console.log("get label", {m, u})
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
    console.log("get desc", o, u);
    const key = (o === "Count" ? o + u : o).toLowerCase();
    return {
      usage: "The pod resources used, as reported by OpenShift",
      request: "The pod resources requested, as reported by OpenShift",
      'effective-usage': "The greater of usage and request each hour",
      'countnode-month': "The distinct number of nodes identified during the month",
      'countcluster-month': "The distinct number of clusters identified during the month",
      'countpvc-month': "The distinct number of volume claims identified during the month",
    } [key] || "";

  }
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
              usesSelectComponent
              value={measurement}
              onChange={setMeasurement}
              options={[
                {
                  label: messages.Select,
                  value: '',
                  isDisabled: true,
                },
                ...measurementOptions.map(opt => {
                  const unit =  metricsHash[metric][opt].label_measurement_unit;
                  return {
                    label: getMeasurementLabel(opt, unit),
                    value: opt,
                    isDisabled: false,
                    description: getMeasurementDescription(opt, unit)
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
              value={regular}
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
