import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

jest.mock('react-redux', () => ({
  __esModule: true,
  useDispatch: () => jest.fn(),
  useSelector: (selector: any) =>
    selector({
      // Minimal shape so settings selectors return undefined without throwing
    }),
}));

const mockSelectSettings = jest.fn();

jest.mock('store/settings', () => ({
  __esModule: true,
  settingsActions: {
    fetchSettings: jest.fn(),
  },
  settingsSelectors: {
    selectSettings: (...args: any[]) => mockSelectSettings(...args),
    selectSettingsError: () => undefined,
    selectSettingsFetchStatus: () => 'complete',
  },
}));

jest.mock('routes/components/selectWrapper', () => ({
  __esModule: true,
  SelectWrapper: ({ id, isDisabled, options, onSelect, selection }: any) => (
    <button
      id={id}
      disabled={isDisabled}
      data-options={JSON.stringify(options)}
      onClick={() => onSelect({}, selection || options[0])}
    />
  ),
}));

const setCurrency = jest.fn();
jest.mock('utils/sessionStorage', () => ({
  __esModule: true,
  setCurrency: (...args: any[]) => setCurrency(...args),
}));

import Currency from './currency';

const renderCurrency = (props: React.ComponentProps<typeof Currency> = {}) =>
  render(
    <IntlProvider locale="en" messages={{}}>
      <Currency {...props} />
    </IntlProvider>
  );

const defaultSettings = {
  data: [
    { code: 'USD', description: 'US Dollar' },
    { code: 'EUR', description: 'Euro' },
  ],
};

describe('Currency', () => {
  beforeEach(() => {
    setCurrency.mockClear();
    mockSelectSettings.mockReturnValue(defaultSettings);
  });

  test('builds options and renders select', () => {
    const { container } = renderCurrency({ showLabel: true });
    const btn = container.querySelector('#currency-select') as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.disabled).toBe(false);
    const options = JSON.parse(btn.getAttribute('data-options') || '[]');
    expect(options.length).toBeGreaterThan(0);
  });

  test('onSelect updates sessionStorage and calls callback', () => {
    const onSelect = jest.fn();
    const { container } = renderCurrency({ currency: 'USD', onSelect });
    fireEvent.click(container.querySelector('#currency-select')!);
    expect(setCurrency).toHaveBeenCalled();
    expect(onSelect).toHaveBeenCalled();
  });

  test('does not write to sessionStorage when isSessionStorage is false', () => {
    const { container } = renderCurrency({ isSessionStorage: false });
    fireEvent.click(container.querySelector('#currency-select')!);
    expect(setCurrency).not.toHaveBeenCalled();
  });

  test.each([undefined, { data: [] }])(
    'provides a default USD option and disables the menu when settings data is empty (%j)',
    settings => {
      mockSelectSettings.mockReturnValue(settings);
      const { container } = renderCurrency();
      const btn = container.querySelector('#currency-select') as HTMLButtonElement;
      expect(btn.disabled).toBe(true);
      const options = JSON.parse(btn.getAttribute('data-options') || '[]');
      expect(options).toHaveLength(1);
      expect(options[0].value).toBe('USD');
    }
  );
});
