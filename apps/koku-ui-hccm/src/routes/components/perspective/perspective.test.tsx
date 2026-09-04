import { render, screen } from '@testing-library/react';
import React from 'react';

import Perspective from './perspective';

let mockIsOnPremEnabled = false;

jest.mock('components/featureToggle', () => ({
  get isOnPremEnabled() {
    return mockIsOnPremEnabled;
  },
}));

jest.mock('./perspectiveSelect', () => ({
  PerspectiveSelect: ({ options }: { options: { value: string }[] }) => (
    <div data-testid="perspective-options">{options.map(option => option.value).join(',')}</div>
  ),
}));

describe('Perspective', () => {
  const cloudProps = {
    hasAws: true,
    hasAwsOcp: true,
    hasAzure: true,
    hasAzureOcp: true,
    hasGcp: true,
    hasGcpOcp: true,
    hasOcp: true,
    hasOcpCloud: true,
  };

  beforeEach(() => {
    mockIsOnPremEnabled = false;
  });

  test('includes cloud perspectives when on-prem is disabled', () => {
    render(<Perspective {...cloudProps} />);
    expect(screen.getByTestId('perspective-options')).toHaveTextContent(
      'ocp,ocp_cloud,aws,aws_ocp,gcp,gcp_ocp,azure,azure_ocp'
    );
  });

  test('omits cloud perspectives when on-prem is enabled', () => {
    mockIsOnPremEnabled = true;
    render(<Perspective {...cloudProps} />);
    expect(screen.getByTestId('perspective-options')).toHaveTextContent('ocp');
    expect(screen.getByTestId('perspective-options')).not.toHaveTextContent('aws');
    expect(screen.getByTestId('perspective-options')).not.toHaveTextContent('ocp_cloud');
  });
});
