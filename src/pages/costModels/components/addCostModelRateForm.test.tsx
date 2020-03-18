import { unusedRates } from './addCostModelRateForm';

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
