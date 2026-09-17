import { rateFormReducer } from './useRateForm';
import { initialRateFormData } from './utils';

describe('do not update state scenarios', () => {
  test('in the initial step discard UPDATE_MEASUREMENT', () => {
    const state = rateFormReducer(undefined, { type: 'UPDATE_MEASUREMENT', value: 'Usage' });
    expect(state.measurement).toEqual(initialRateFormData.measurement);
  });
  test('in the initial step discard UPDATE_CALCULATION', () => {
    const state = rateFormReducer(undefined, { type: 'UPDATE_CALCULATION', value: 'Infrastructure' });
    expect(state.calculation).toEqual(initialRateFormData.calculation);
  });
  test('unless step is set_rate discard TOGGLE_RATE_KIND', () => {
    let state = rateFormReducer(undefined, { type: 'TOGGLE_RATE_KIND' });
    expect(state.rateKind).toEqual(initialRateFormData.rateKind);
    state = rateFormReducer({ ...initialRateFormData, step: 'set_metric' }, { type: 'TOGGLE_RATE_KIND' });
    expect(state.rateKind).toEqual(initialRateFormData.rateKind);
  });
  test('unless step is set_rate and rate kind is regular discard BLUR_REGULAR', () => {
    let state = rateFormReducer(undefined, { type: 'BLUR_REGULAR' });
    expect(state.errors.tieredRates).toEqual(initialRateFormData.errors.tieredRates);
    state = rateFormReducer(
      { ...initialRateFormData, rateKind: 'regular', step: 'set_rate' },
      { type: 'TOGGLE_RATE_KIND' }
    );
    expect(state.errors.tieredRates).toEqual(initialRateFormData.errors.tieredRates);
  });
  test('unless step is set_rate and rate kind is tagging discard UPDATE_TAG_KEY', () => {
    let state = rateFormReducer(undefined, { type: 'UPDATE_TAG_KEY', value: 'value!' });
    expect(state.taggingRates.tagKey).toEqual(initialRateFormData.taggingRates.tagKey);
    state = rateFormReducer(
      { ...initialRateFormData, rateKind: 'regular', step: 'set_rate' },
      { type: 'UPDATE_TAG_KEY', value: 'value!' }
    );
    expect(state.taggingRates.tagKey).toEqual(initialRateFormData.taggingRates.tagKey);
  });
  test('unless step is set_rate and rate kind is tagging discard UPDATE_TAG_DEFAULT', () => {
    let state = rateFormReducer(undefined, { type: 'UPDATE_TAG_DEFAULT', index: 0 });
    expect(state.taggingRates.defaultTag).toEqual(initialRateFormData.taggingRates.defaultTag);
    state = rateFormReducer(
      { ...initialRateFormData, rateKind: 'regular', step: 'set_rate' },
      { type: 'UPDATE_TAG_DEFAULT', index: 0 }
    );
    expect(state.taggingRates.tagKey).toEqual(initialRateFormData.taggingRates.tagKey);
  });
  test('unless step is set_rate and rate kind is tagging discard BLUR_TAG_RATE', () => {
    let state = rateFormReducer(undefined, { type: 'BLUR_TAG_RATE', index: 0 });
    expect(state.errors).toEqual(initialRateFormData.errors);
    state = rateFormReducer(
      { ...initialRateFormData, rateKind: 'regular', step: 'set_rate' },
      { type: 'BLUR_TAG_RATE', index: 0 }
    );
    expect(state.errors).toEqual(initialRateFormData.errors);
  });
  test('unless step is set_rate and rate kind is tagging discard UPDATE_TAG', () => {
    let state = rateFormReducer(undefined, { type: 'UPDATE_TAG', index: 0, payload: { value: '20' } });
    expect(state.taggingRates).toEqual(initialRateFormData.taggingRates);
    state = rateFormReducer(
      { ...initialRateFormData, rateKind: 'regular', step: 'set_rate' },
      { type: 'UPDATE_TAG', index: 0, payload: { value: '20' } }
    );
    expect(state.taggingRates).toEqual(initialRateFormData.taggingRates);
  });
  test('unless step is set_rate and rate kind is tagging discard REMOVE_TAG', () => {
    let state = rateFormReducer(undefined, { type: 'REMOVE_TAG', index: 1 });
    expect(state).toEqual(initialRateFormData);
    const initial = { ...initialRateFormData, rateKind: 'regular', step: 'set_rate' };
    state = rateFormReducer(initial, { type: 'REMOVE_TAG', index: 1 });
    expect(state).toEqual(initial);
  });
  test('unless step is set_rate and rate kind is tagging discard ADD_TAG', () => {
    let state = rateFormReducer(undefined, { type: 'ADD_TAG' });
    expect(state).toEqual(initialRateFormData);
    const initial = { ...initialRateFormData, rateKind: 'regular', step: 'set_rate' };
    state = rateFormReducer(initial, { type: 'ADD_TAG' });
    expect(state).toEqual(initial);
  });
  test('discard any action that is not a valid type', () => {
    const state = rateFormReducer(undefined, { type: 'BLAAAAA' });
    expect(state).toEqual(initialRateFormData);
  });
});
