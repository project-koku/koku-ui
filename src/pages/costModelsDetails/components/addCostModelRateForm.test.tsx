import { mount } from 'enzyme';
import React from 'react';
import {
  AddCostModelRateFormBase,
  isRateValid,
  unusedRates,
} from './addCostModelRateForm';

test('isRateValid', () => {
  ['2', '2.3', '200.34322123', '0.000123', '3.'].forEach(rate => {
    expect(isRateValid(rate)).toBeTruthy();
  });
  ['-2', 'ab', '3.a', '-', '0'].forEach(rate => {
    expect(isRateValid(rate)).toBeFalsy();
  });
});

test('unusedRates', () => {
  const metricsHash = {
    a: {
      a: {
        metric: 'a_a_x',
        label_metric: 'a',
        label_measurement: 'a',
        label_measurement_unit: 'x',
      },
      b: {
        metric: 'a_b_x',
        label_metric: 'a',
        label_measurement: 'b',
        label_measurement_unit: 'x',
      },
    },
    b: {
      a: {
        metric: 'b_a_y',
        label_metric: 'b',
        label_measurement: 'a',
        label_measurement_unit: 'y',
      },
      c: {
        metric: 'b_c_y',
        label_metric: 'b',
        label_measurement: 'c',
        label_measurement_unit: 'y',
      },
    },
    c: {
      z: {
        metric: 'c_z_u',
        label_metric: 'c',
        label_measurement: 'z',
        label_measurement_unit: 'u',
      },
    },
  };
  expect(
    unusedRates(metricsHash, [
      { metric: 'a', measurement: 'a' },
      { metric: 'a', measurement: 'b' },
      { metric: 'b', measurement: 'c' },
    ])
  ).toEqual({
    b: { a: true },
    c: { z: true },
  });

  expect(unusedRates(metricsHash, [])).toEqual({
    a: { a: true, b: true },
    b: { a: true, c: true },
    c: { z: true },
  });
});

describe('add cost model rate form', () => {
  test('initial form', () => {
    const view = mount(
      <AddCostModelRateFormBase
        t={(v: string) => v}
        metric=""
        setMetric={jest.fn()}
        measurement=""
        setMeasurement={jest.fn()}
        rate=""
        setRate={jest.fn()}
        metricOptions={[
          { label: 'm1', value: 'm1' },
          { label: 'm2', value: 'm2' },
        ]}
        measurementOptions={[
          { label: 'a1', value: 'a1' },
          { label: 'a2', value: 'a2' },
        ]}
        validRate
      />
    );
    expect(view.find('select')).toHaveLength(1);
    expect(view.find('option')).toHaveLength(3);
    expect(view.find('input')).toHaveLength(0);
  });
  test('metric selected', () => {
    const view = mount(
      <AddCostModelRateFormBase
        t={(v: string) => v}
        metric="m2"
        setMetric={jest.fn()}
        measurement=""
        setMeasurement={jest.fn()}
        rate=""
        setRate={jest.fn()}
        metricOptions={[
          { label: 'm1', value: 'm1' },
          { label: 'm2', value: 'm2' },
        ]}
        measurementOptions={[
          { label: 'a1', value: 'a1' },
          { label: 'a2', value: 'a2' },
        ]}
        validRate
      />
    );
    expect(view.find('select')).toHaveLength(2);
    expect(view.find('option')).toHaveLength(6);
    expect(view.find('input')).toHaveLength(0);
  });
  test('measurement selected', () => {
    const view = mount(
      <AddCostModelRateFormBase
        t={(v: string) => v}
        metric="m2"
        setMetric={jest.fn()}
        measurement="a1"
        setMeasurement={jest.fn()}
        rate=""
        setRate={jest.fn()}
        metricOptions={[
          { label: 'm1', value: 'm1' },
          { label: 'm2', value: 'm2' },
        ]}
        measurementOptions={[
          { label: 'a1', value: 'a1' },
          { label: 'a2', value: 'a2' },
        ]}
        validRate
      />
    );
    expect(view.find('select')).toHaveLength(2);
    expect(view.find('option')).toHaveLength(6);
    expect(view.find('input')).toHaveLength(1);
  });
});
