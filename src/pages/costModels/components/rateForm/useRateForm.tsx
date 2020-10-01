import { MetricHash } from 'api/metrics';
import { Rate } from 'api/rates';
import React from 'react';

import { textHelpers } from './constants';
import { initialtaggingRates } from './utils';
import {
  checkRateOnBlur,
  checkRateOnChange,
  genFormDataFromRate,
  getDefaultCalculation,
  initialRateFormData,
  RateFormData,
  RateFormTagValue,
} from './utils';

type Actions =
  | { type: 'ADD_TAG' }
  | { type: 'REMOVE_TAG'; index: number }
  | {
      type: 'UPDATE_TAG';
      index: number;
      payload: Partial<RateFormTagValue>;
    }
  | { type: 'UPDATE_DESCRIPTION'; value: string }
  | { type: 'UPDATE_METRIC'; value: string; defaultCalculation: string }
  | { type: 'UPDATE_MEASUREMENT'; value: string }
  | { type: 'UPDATE_CALCULATION'; value: string }
  | { type: 'UPDATE_REGULAR'; value: string }
  | { type: 'BLUR_REGULAR' }
  | { type: 'BLUR_TAG_RATE'; index: number }
  | { type: 'UPDATE_TAG_KEY'; value: string }
  | { type: 'UPDATE_TAG_DEFAULT'; index: number }
  | { type: 'TOGGLE_RATE_KIND' }
  | { type: 'RESET_FORM'; payload: RateFormData };

function rateFormReducer(state = initialRateFormData, action: Actions) {
  switch (action.type) {
    case 'UPDATE_DESCRIPTION':
      return {
        ...state,
        description: action.value,
      };
    case 'UPDATE_METRIC': {
      const errors = state.errors;
      const newMeasurement = state.measurement;
      if (newMeasurement.isDirty) {
        newMeasurement.value = '';
        errors.measurement = textHelpers.required;
      }
      let step = state.step;
      if (step === 'initial') {
        step = 'set_metric';
      }

      return {
        ...state,
        metric: action.value,
        measurement: newMeasurement,
        errors,
        step,
        calculation: action.defaultCalculation,
      };
    }
    case 'UPDATE_MEASUREMENT': {
      if (state.step === 'initial') {
        return state;
      }
      let step = state.step;
      if (step === 'set_metric') {
        step = 'set_rate';
      }
      return {
        ...state,
        measurement: { value: action.value, isDirty: true },
        errors: { ...state.errors, measurement: null },
        step,
      };
    }
    case 'UPDATE_CALCULATION': {
      if (state.step !== 'set_rate') {
        return state;
      }
      return {
        ...state,
        calculation: action.value,
      };
    }
    case 'TOGGLE_RATE_KIND': {
      if (state.step !== 'set_rate' && state.rateKind !== 'regular') {
        return state;
      }
      return {
        ...state,
        rateKind: state.rateKind === 'regular' ? 'tagging' : 'regular',
      };
    }
    case 'BLUR_REGULAR': {
      if (state.step !== 'set_rate' || state.rateKind !== 'regular') {
        return state;
      }
      return {
        ...state,
        errors: {
          ...state.errors,
          tieredRates: checkRateOnBlur(state.tieredRates[0].value),
        },
      };
    }
    case 'UPDATE_REGULAR': {
      return {
        ...state,
        tieredRates: [{ value: action.value, isDirty: true }],
        errors: {
          ...state.errors,
          tieredRates: checkRateOnChange(action.value),
        },
      };
    }
    case 'UPDATE_TAG_KEY': {
      if (state.step !== 'set_rate' && state.rateKind !== 'tagging') {
        return state;
      }
      return {
        ...state,
        taggingRates: {
          ...state.taggingRates,
          tagKey: { value: action.value, isDirty: true },
        },
        errors: {
          ...state.errors,
          tagKey: action.value.length ? null : textHelpers.required,
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
    case 'BLUR_TAG_RATE': {
      if (state.step !== 'set_rate' || state.rateKind !== 'tagging') {
        return state;
      }
      const tag = state.taggingRates.tagValues[action.index];
      if (!tag) {
        return state;
      }
      const rate = tag.value;
      return {
        ...state,
        errors: {
          ...state.errors,
          tagValues: [
            ...state.errors.tagValues.slice(0, action.index),
            checkRateOnBlur(rate),
            ...state.errors.tagValues.slice(action.index + 1),
          ],
        },
      };
    }
    case 'UPDATE_TAG': {
      if (state.step !== 'set_rate' && state.rateKind !== 'tagging') {
        return state;
      }
      let error = state.errors.tagValues[action.index];
      let tagValueError = state.errors.tagValueValues[action.index];
      let isDirty = state.taggingRates.tagValues[action.index].isDirty;
      let isTagValueDirty = state.taggingRates.tagValues[action.index].isTagValueDirty;
      if (action.payload.value !== undefined) {
        const { value: rate } = action.payload;
        error = checkRateOnChange(rate);
        isDirty = true;
      }
      if (action.payload.tagValue !== undefined) {
        tagValueError = !action.payload.tagValue.length ? textHelpers.required : null;
        isTagValueDirty = true;
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
              isDirty,
              isTagValueDirty,
            },
            ...state.taggingRates.tagValues.slice(action.index + 1),
          ],
        },
        errors: {
          ...state.errors,
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
        },
      };
    }
    case 'REMOVE_TAG': {
      if (state.step !== 'set_rate' && state.rateKind !== 'tagging') {
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
    case 'ADD_TAG': {
      if (state.step !== 'set_rate') {
        return state;
      }
      return {
        ...state,
        errors: {
          ...state.errors,
          tagValues: [...state.errors.tagValues, textHelpers.required],
        },
        taggingRates: {
          ...state.taggingRates,
          tagValues: [...state.taggingRates.tagValues, { ...initialtaggingRates.tagValues[0] }],
        },
      };
    }
    case 'RESET_FORM': {
      return action.payload;
    }
    default: {
      return state;
    }
  }
}

export type UseRateData = ReturnType<typeof useRateData>;

export function useRateData(metricsHash: MetricHash, rate: Rate = undefined) {
  const initial = genFormDataFromRate(rate);
  const [state, dispatch] = React.useReducer(rateFormReducer, initial);
  return {
    ...state,
    onRegularBlur: () => dispatch({ type: 'BLUR_REGULAR' }),
    onTagBlur: (index: number) => dispatch({ type: 'BLUR_TAG_RATE', index }),
    reset: (payload: RateFormData) => dispatch({ type: 'RESET_FORM', payload }),
    setDescription: (value: string) => dispatch({ type: 'UPDATE_DESCRIPTION', value }),
    setMetric: (value: string) =>
      dispatch({
        type: 'UPDATE_METRIC',
        value,
        defaultCalculation: getDefaultCalculation(metricsHash, value),
      }),
    setMeasurement: (value: string) =>
      dispatch({
        type: 'UPDATE_MEASUREMENT',
        value,
      }),
    setCalculation: (value: string) => dispatch({ type: 'UPDATE_CALCULATION', value }),
    setRegular: (value: string) => dispatch({ type: 'UPDATE_REGULAR', value }),
    toggleTaggingRate: () => dispatch({ type: 'TOGGLE_RATE_KIND' }),
    setTagKey: (value: string) => dispatch({ type: 'UPDATE_TAG_KEY', value }),
    removeTag: (index: number) => dispatch({ type: 'REMOVE_TAG', index }),
    addTag: () => dispatch({ type: 'ADD_TAG' }),
    updateTag: (payload: Partial<typeof initialRateFormData['taggingRates']['tagValues'][0]>, index: number) =>
      dispatch({ type: 'UPDATE_TAG', index, payload }),
    updateDefaultTag: (index: number) => dispatch({ type: 'UPDATE_TAG_DEFAULT', index }),
  };
}
