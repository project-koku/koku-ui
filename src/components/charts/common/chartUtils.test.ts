jest.mock('i18next');
import i18next from 'i18next';
import { getTooltipContent } from './chartUtils';

describe('gettTooltipContent', () => {
  test('format hrs and gb', () => {
    [
      { unit: 'hrs', translate: 'unit_tooltips.hrs' },
      { unit: 'gb', translate: 'unit_tooltips.gb' },
      { unit: 'gb-mo', translate: 'unit_tooltips.gb' },
    ].forEach(tc => {
      const labelFormatFunc = getTooltipContent(jest.fn(v => v));
      labelFormatFunc(10, tc.unit);
      expect(i18next.t).toBeCalledWith(tc.translate, { value: '10' });
    });
  });
  test('format unknown units', () => {
    const labelFormatFunc = getTooltipContent(jest.fn(v => v));
    expect(i18next.t).not.toBeCalled();
    expect(labelFormatFunc(10)).toBe('10');
  });
});
