import React from 'react';
import { render, screen } from '@testing-library/react';

// Top-level mock placeholder. Individual tests will override with jest.isolateModules + jest.doMock
jest.mock('utils/sessionStorage', () => ({ __esModule: true, getAccountCurrency: () => 'USD' }));

describe('cost model wizard context', () => {
  test('uses getAccountCurrency for currencyUnits', () => {
    jest.isolateModules(() => {
      jest.doMock('utils/sessionStorage', () => ({ __esModule: true, getAccountCurrency: () => 'EUR' }));
      const mod = require('./context');
      expect(mod.defaultCostModelContext.currencyUnits).toBe('EUR');
    });
  });

  test('consumer receives default values without provider', () => {
    jest.isolateModules(() => {
      jest.doMock('utils/sessionStorage', () => ({ __esModule: true, getAccountCurrency: () => 'JPY' }));
      const mod = require('./context');
      const { CostModelContext, defaultCostModelContext } = mod;

      const Probe: React.FC = () => (
        <CostModelContext.Consumer>
          {ctx => (
            <div
              data-currency={ctx.currencyUnits}
              data-step={ctx.step}
              data-page={ctx.page}
              data-perpage={ctx.perPage}
              data-plpage={ctx.priceListPagination.page}
              data-plperpage={ctx.priceListPagination.perPage}
            />
          )}
        </CostModelContext.Consumer>
      );

      const { container } = render(<Probe />);
      const el = container.firstElementChild as HTMLElement;
      expect(el.getAttribute('data-currency')).toBe('JPY');
      expect(el.getAttribute('data-step')).toBe(String(defaultCostModelContext.step));
      expect(el.getAttribute('data-page')).toBe(String(defaultCostModelContext.page));
      expect(el.getAttribute('data-perpage')).toBe(String(defaultCostModelContext.perPage));
      expect(el.getAttribute('data-plpage')).toBe(String(defaultCostModelContext.priceListPagination.page));
      expect(el.getAttribute('data-plperpage')).toBe(String(defaultCostModelContext.priceListPagination.perPage));

      const fnProps = [
        'clearQuery',
        'fetchSources',
        'goToAddPL',
        'handleMarkupDiscountChange',
        'handleDistributionChange',
        'handleDistributeNetworkChange',
        'handleDistributePlatformUnallocatedChange',
        'handleDistributeStorageChange',
        'handleDistributeWorkerUnallocatedChange',
        'handleSignChange',
        'onClose',
        'onCurrencyChange',
        'onDescChange',
        'onFilterChange',
        'onPageChange',
        'onPerPageChange',
        'onTypeChange',
        'onNameChange',
        'onSourceSelect',
        'setSources',
        'submitTiers',
        'priceListPagination.onPerPageSet',
        'priceListPagination.onPageSet',
      ] as const;

      // Verify all default callbacks exist and are callable
      fnProps.forEach(key => {
        const parts = key.split('.');
        const fn = parts.length === 2 ? (defaultCostModelContext as any)[parts[0]][parts[1]] : (defaultCostModelContext as any)[key];
        expect(typeof fn).toBe('function');
        expect(() => fn(undefined as any)).not.toThrow();
      });

      // Selected default scalar/object values
      expect(defaultCostModelContext.checked).toEqual({});
      expect(defaultCostModelContext.dataFetched).toBe(false);
      expect(defaultCostModelContext.distributeNetwork).toBe(true);
      expect(defaultCostModelContext.distributePlatformUnallocated).toBe(true);
      expect(defaultCostModelContext.distributeStorage).toBe(true);
      expect(defaultCostModelContext.distributeWorkerUnallocated).toBe(true);
      expect(defaultCostModelContext.sources).toEqual([]);
      expect(defaultCostModelContext.tiers).toEqual([]);
    });
  });
}); 