import {
  getChartNames,
  getDomain,
  getLegendData,
  getResizeObserver,
  getTooltipLabel,
  initHiddenSeries,
  isDataAvailable,
  isDataHidden,
  isSeriesHidden,
} from './chartUtils';

jest.mock('@patternfly/react-charts/victory', () => ({
  __esModule: true,
  getInteractiveLegendItemStyles: jest.fn((hidden: boolean) => ({ hidden })),
}));

jest.mock('components/i18n', () => ({
  __esModule: true,
  intl: {
    formatMessage: (_msg: unknown, vars?: { value0?: string; value1?: string }) =>
      vars?.value0 ? `${vars.value0}-${vars.value1}` : 'no-data',
    formatNumber: (value: number) => `${value}`,
  },
}));

const mkSeries = (values: Array<{ y?: number; y0?: number; units?: string; childName?: string }>, childName?: string) => ({
  childName,
  data: values.map(value => ({ ...value, childName })),
  legendItem: { name: 'n', tooltip: 't' },
});

describe('chartUtils', () => {
  test('getChartNames returns child names', () => {
    expect(getChartNames([mkSeries([], 'a'), mkSeries([], 'b')])).toEqual(['a', 'b']);
    expect(getChartNames(undefined as any)).toEqual([]);
  });

  test('getDomain computes y domain and hidden-series fallback', () => {
    expect(getDomain([mkSeries([{ y: 1 }, { y: 3 }])], new Set()).y?.[1]).toBeGreaterThan(0);
    expect(getDomain([mkSeries([{ y: 1 }])], new Set([0])).x).toEqual([0, 1]);
    expect(getDomain(undefined as any, new Set()).y).toEqual([0, 1]);
  });

  test('getLegendData maps hidden styles and tooltip names', () => {
    const data = getLegendData([mkSeries([{ y: 1 }], 'a'), mkSeries([{ y: 2 }], 'b')], new Set([1]), true);
    expect(data[0]).toEqual(expect.objectContaining({ childName: 'a', hidden: false, name: 't' }));
    expect(data[1]).toEqual(expect.objectContaining({ childName: 'b', hidden: true, name: 't' }));
    expect(getLegendData(undefined as any, new Set())).toBeUndefined();
  });

  test('getTooltipLabel', () => {
    const formatter = (value: number) => `${value}`;
    expect(getTooltipLabel({ y: 10, y0: 5, units: 'USD' }, formatter as any, {})).toBe('5-10');
    expect(getTooltipLabel({ y: 10, units: 'USD' }, formatter as any, {})).toBe('10');
    expect(getTooltipLabel({ y: null, units: 'USD' }, formatter as any, {})).toBe('no-data');
  });

  test('initHiddenSeries toggles indexes', () => {
    const hidden = initHiddenSeries([], new Set(), 1);
    expect(hidden.has(1)).toBe(true);
    expect(initHiddenSeries([], hidden, 1).has(1)).toBe(false);
  });

  test('isDataAvailable and isSeriesHidden', () => {
    expect(isSeriesHidden(new Set([0]), 0)).toBe(true);
    expect(isDataAvailable([mkSeries([{ y: 1 }])], new Set())).toBe(true);
    expect(isDataAvailable([mkSeries([])], new Set())).toBe(false);
    expect(isDataAvailable(undefined as any, new Set())).toBe(false);
  });

  test('isDataHidden matches child names', () => {
    const series = [mkSeries([{ y: 1, childName: 'cpu' }], 'cpu')];
    expect(isDataHidden(series as any, new Set([0]), [{ childName: 'cpu' }])).toBe(true);
    expect(isDataHidden(series as any, new Set(), [{ childName: 'cpu' }])).toBe(false);
    expect(isDataHidden(series as any, new Set([0]), [])).toBe(false);
  });

  test('getResizeObserver uses ResizeObserver when available', () => {
    const handleResize = jest.fn();
    const unobserve = jest.fn();
    class MockObserver {
      observe = jest.fn();
      unobserve = unobserve;
    }
    (window as any).ResizeObserver = MockObserver;
    const cleanup = getResizeObserver(document.createElement('div'), handleResize);
    cleanup();
    expect(unobserve).toHaveBeenCalled();
  });

  test('getResizeObserver falls back to window resize', () => {
    delete (window as any).ResizeObserver;
    const handleResize = jest.fn();
    const add = jest.spyOn(window, 'addEventListener');
    const remove = jest.spyOn(window, 'removeEventListener');
    (window as any).insights = { chrome: { on: jest.fn(() => jest.fn()) } };
    const cleanup = getResizeObserver(document.createElement('div'), handleResize);
    expect(add).toHaveBeenCalledWith('resize', handleResize);
    cleanup();
    expect(remove).toHaveBeenCalledWith('resize', handleResize);
  });
});
