import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { Distribution } from './distribution';

jest.mock('components/featureToggle', () => ({
  useIsGpuToggleEnabled: () => false,
}));

describe('Distribution step', () => {
  const defaultProps = {
    distributeGpu: true,
    distributeNetwork: true,
    distributePlatformUnallocated: true,
    distributeStorage: true,
    distributeWorkerUnallocated: true,
    distributionType: 'cpu',
    onDistributeGpuChange: jest.fn(),
    onDistributeNetworkChange: jest.fn(),
    onDistributePlatformUnallocatedChange: jest.fn(),
    onDistributeStorageChange: jest.fn(),
    onDistributeWorkerUnallocatedChange: jest.fn(),
    onDistributionTypeChange: jest.fn(),
  };

  test('renders distribution type and cost allocation options', () => {
    render(
      <IntlProvider locale="en">
        <Distribution {...defaultProps} />
      </IntlProvider>
    );

    expect(screen.getByRole('heading', { name: /cost distribution/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /distribution type/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /cpu/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /platform overhead/i })).toBeChecked();
    expect(screen.queryByRole('checkbox', { name: /distribute gpu/i })).not.toBeInTheDocument();
  });

  test('change handlers fire callbacks', () => {
    const onDistributionTypeChange = jest.fn();
    const onDistributePlatformUnallocatedChange = jest.fn();
    render(
      <IntlProvider locale="en">
        <Distribution
          {...defaultProps}
          onDistributionTypeChange={onDistributionTypeChange}
          onDistributePlatformUnallocatedChange={onDistributePlatformUnallocatedChange}
        />
      </IntlProvider>
    );
    fireEvent.click(screen.getByRole('radio', { name: /memory/i }));
    expect(onDistributionTypeChange).toHaveBeenCalledWith('memory');
    fireEvent.click(screen.getByRole('checkbox', { name: /platform overhead/i }));
    expect(onDistributePlatformUnallocatedChange).toHaveBeenCalledWith(false);
  });
});
