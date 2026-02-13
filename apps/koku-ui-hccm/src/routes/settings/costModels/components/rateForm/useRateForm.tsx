import type { MetricHash } from 'api/metrics';
import type { Rate } from 'api/rates';
import React from 'react';

import { textHelpers } from './constants';
import type { RateFormData, RateFormTagValue } from './utils';
import {
  descriptionErrors,
  initialTaggingRates,
  isDuplicateTagRate,
  OtherTierFromRate,
  OtherTierFromRateForm,
  tagKeyValueErrors,
} from './utils';
import { checkRateOnChange, genFormDataFromRate, getDefaultCalculation, initialRateFormData } from './utils';

type Actions =
  | { type: 'ADD_TAG' }
  | { type: 'REMOVE_TAG'; index: number }
  | { type: 'RESET_FORM'; payload: RateFormData }
  | { type: 'TOGGLE_RATE_KIND' }
  | { type: 'UPDATE_CALCULATION'; value: string }
  | { type: 'UPDATE_DESCRIPTION'; value: string }
  | { type: 'UPDATE_METRIC'; value: string; defaultCalculation: string }
  | { type: 'UPDATE_MEASUREMENT'; value: string }
  | { type: 'UPDATE_REGULAR'; value: string }
  | {
      type: 'UPDATE_TAG';
      index: number;
      payload: Partial<RateFormTagValue>;
    }
  | { type: 'UPDATE_TAG_KEY'; value: string }
  | { type: 'UPDATE_TAG_DEFAULT'; index: number };

export function rateFormReducer(state = initialRateFormData, action: Actions) {
  switch (action.type) {
    case 'ADD_TAG': {
      if (state.step !== 'set_rate' || state.rateKind !== 'tagging') {
        return state;
      }
      return {
        ...state,
        errors: {
          ...state.errors,
          tagValues: [...state.errors.tagValues, textHelpers.required],
          tagDescription: [...state.errors.tagDescription, null],
        },
        taggingRates: {
          ...state.taggingRates,
          tagValues: [...state.taggingRates.tagValues, { ...initialTaggingRates.tagValues[0] }],
        },
      };
    }
    case 'REMOVE_TAG': {
      if (state.step !== 'set_rate' || state.rateKind !== 'tagging') {
        return state;
      }
      return {
        ...state,
        errors: {
          ...state.errors,
          tagValues: [
            ...state.errors.tagValues.slice(0, action.index),
            ...state.errors.tagValues.slice(action.index + 1),
          ],
          tagValueValues: [
            ...state.errors.tagValueValues.slice(0, action.index),
            ...state.errors.tagValueValues.slice(action.index + 1),
          ],
        },
        taggingRates: {
          ...state.taggingRates,
          defaultTag:
            state.taggingRates.defaultTag === action.index
              ? null
              : state.taggingRates.defaultTag > action.index
                ? state.taggingRates.defaultTag - 1
                : state.taggingRates.defaultTag,
          tagValues: [
            ...state.taggingRates.tagValues.slice(0, action.index),
            ...state.taggingRates.tagValues.slice(action.index + 1),
          ],
        },
      };
    }
    case 'RESET_FORM': {
      return action.payload;
    }
    case 'TOGGLE_RATE_KIND': {
      if (state.step !== 'set_rate') {
        return state;
      }
      return {
        ...state,
        rateKind: state.rateKind === 'regular' ? 'tagging' : 'regular',
      };
    }
    case 'UPDATE_CALCULATION': {
      if (state.step !== 'set_rate') {
        return state;
      }
      const newState = {
        ...state,
        calculation: action.value,
      };
      const cur = OtherTierFromRateForm(newState);
      const duplicate = newState.otherTiers.find(val => isDuplicateTagRate(OtherTierFromRate(val), cur));
      return {
        ...newState,
        errors: { ...newState.errors, tagKey: duplicate ? textHelpers.duplicate : null },
      };
    }
    case 'UPDATE_DESCRIPTION':
      return {
        ...state,
        description: action.value,
        errors: {
          ...state.errors,
          description: descriptionErrors(action.value),
        },
      };
    case 'UPDATE_METRIC': {
      const errors = state.errors;
      const newMeasurement = state.measurement;
      if (newMeasurement.isDirty) {
        newMeasurement.value = '';
        // Past discussions, we've agreed this required error should show on measurement when metric updates
        errors.measurement = textHelpers.required;
      }
      let step = state.step;
      if (step === 'initial') {
        step = 'set_metric';
      }

      // Set type based on selected metric
      let rateKind = state.rateKind;
      if (action.value.toLowerCase() === 'cluster') {
        rateKind = 'regular';
      } else if (action.value.toLowerCase() === 'gpu' || action.value.toLowerCase() === 'project') {
        rateKind = 'tagging';
      }

      const newState = {
        ...state,
        metric: action.value,
        measurement: newMeasurement,
        errors,
        step,
        calculation: action.defaultCalculation,
        rateKind,
      };
      const cur = OtherTierFromRateForm(newState);
      const duplicate = newState.otherTiers.find(val => isDuplicateTagRate(OtherTierFromRate(val), cur));
      return {
        ...newState,
        errors: { ...newState.errors, tagKey: duplicate ? textHelpers.duplicate : null },
      };
    }
    case 'UPDATE_MEASUREMENT': {
      if (state.step === 'initial') {
        return state;
      }
      let step: string = state.step;
      if (step === 'set_metric') {
        step = 'set_rate';
      }
      const newState = {
        ...state,
        measurement: { value: action.value, isDirty: true },
        errors: { ...state.errors, measurement: null },
        step,
      };
      const cur = OtherTierFromRateForm(newState);
      const duplicate = newState.otherTiers.find(val => isDuplicateTagRate(OtherTierFromRate(val), cur));
      return {
        ...newState,
        errors: { ...newState.errors, tagKey: duplicate ? textHelpers.duplicate : null },
      };
    }
    case 'UPDATE_REGULAR': {
      return {
        ...state,
        tieredRates: [
          {
            isDirty: true,
            value: action.value,
          },
        ],
        errors: {
          ...state.errors,
          tieredRates: checkRateOnChange(action.value),
        },
      };
    }
    case 'UPDATE_TAG_DEFAULT': {
      if (state.step !== 'set_rate' && state.rateKind !== 'tagging') {
        return state;
      }
      return {
        ...state,
        taggingRates: {
          ...state.taggingRates,
          defaultTag: state.taggingRates.defaultTag === action.index ? null : action.index,
        },
      };
    }
    case 'UPDATE_TAG_KEY': {
      if (state.step !== 'set_rate' || state.rateKind !== 'tagging') {
        return state;
      }
      const newState = {
        ...state,
        taggingRates: {
          ...state.taggingRates,
          tagKey: { value: action.value, isDirty: true },
        },
        errors: {
          ...state.errors,
          tagKey: tagKeyValueErrors(action.value),
        },
      };
      const cur = OtherTierFromRateForm(newState);
      const duplicate = newState.otherTiers.find(val => isDuplicateTagRate(OtherTierFromRate(val), cur));
      return {
        ...newState,
        errors: { ...newState.errors, tagKey: duplicate ? textHelpers.duplicate : newState.errors.tagKey },
      };
    }
    case 'UPDATE_TAG': {
      if (state.step !== 'set_rate' || state.rateKind !== 'tagging') {
        return state;
      }
      let error = state.errors.tagValues[action.index];
      let tagValueError = state.errors.tagValueValues[action.index];
      let descriptionError = state.errors.tagDescription[action.index];
      let isDirty = state.taggingRates.tagValues[action.index].isDirty;
      let isTagValueDirty = state.taggingRates.tagValues[action.index].isTagValueDirty;

      if (action.payload.value !== undefined) {
        const { value: rate } = action.payload;
        error = checkRateOnChange(rate);
        isDirty = true;
      }
      if (action.payload.tagValue !== undefined) {
        // Skip validation for GPU metric -- see https://issues.redhat.com/browse/COST-7241
        tagValueError = state.metric?.toLowerCase() === 'gpu' ? null : tagKeyValueErrors(action.payload.tagValue);
        isTagValueDirty = true;
      }
      if (action.payload.description !== undefined) {
        descriptionError = descriptionErrors(action.payload.description);
      }
      return {
        ...state,
        taggingRates: {
          ...state.taggingRates,
          tagValues: [
            ...state.taggingRates.tagValues.slice(0, action.index),
            {
              ...state.taggingRates.tagValues[action.index],
              ...action.payload,
              ...(action.payload.value !== undefined && {
                value: action.payload.value,
              }),
              isDirty,
              isTagValueDirty,
            },
            ...state.taggingRates.tagValues.slice(action.index + 1),
          ],
        },
        errors: {
          ...state.errors,
          tagDescription: [
            ...state.errors.tagDescription.slice(0, action.index),
            descriptionError,
            ...state.errors.tagDescription.slice(action.index + 1),
          ],
          tagValueValues: [
            ...state.errors.tagValueValues.slice(0, action.index),
            tagValueError,
            ...state.errors.tagValueValues.slice(action.index + 1),
          ],
          tagValues: [
            ...state.errors.tagValues.slice(0, action.index),
            error,
            ...state.errors.tagValues.slice(action.index + 1),
          ],
          // "Create rate" button must remain disabled if tag key not set -- see https://issues.redhat.com/browse/COST-3977
          tagKey: tagKeyValueErrors(state.taggingRates.tagKey.value),
        },
      };
    }
    default: {
      return state;
    }
  }
}

export type UseRateData = ReturnType<typeof useRateData>;

export function useRateData(metricsHash: MetricHash, rate: Rate = undefined, tiers: Rate[] = []) {
  const initial = genFormDataFromRate(rate, undefined, tiers);

  const [state, dispatch] = React.useReducer(rateFormReducer, initial);
  return {
    ...state,
    addTag: () => dispatch({ type: 'ADD_TAG' }),
    removeTag: (index: number) => dispatch({ type: 'REMOVE_TAG', index }),
    reset: (payload: RateFormData) => dispatch({ type: 'RESET_FORM', payload }),
    setCalculation: (value: string) => dispatch({ type: 'UPDATE_CALCULATION', value }),
    setDescription: (value: string) => dispatch({ type: 'UPDATE_DESCRIPTION', value }),
    setMeasurement: (value: string) =>
      dispatch({
        type: 'UPDATE_MEASUREMENT',
        value,
      }),
    setMetric: (value: string) => {
      dispatch({
        type: 'UPDATE_METRIC',
        value,
        defaultCalculation: getDefaultCalculation(metricsHash, value),
      });
    },
    setRegular: (value: string) => dispatch({ type: 'UPDATE_REGULAR', value }),
    setTagKey: (value: string) => dispatch({ type: 'UPDATE_TAG_KEY', value }),
    toggleTaggingRate: () => dispatch({ type: 'TOGGLE_RATE_KIND' }),
    updateDefaultTag: (index: number) => dispatch({ type: 'UPDATE_TAG_DEFAULT', index }),
    updateTag: (payload: Partial<(typeof initialRateFormData)['taggingRates']['tagValues'][0]>, index: number) =>
      dispatch({ type: 'UPDATE_TAG', index, payload }),
  };
}
