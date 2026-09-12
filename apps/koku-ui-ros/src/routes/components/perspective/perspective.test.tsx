import { render, screen } from '@testing-library/react';
import React from 'react';

import Perspective from './perspective';

jest.mock('./perspectiveSelect', () => ({
  PerspectiveSelect: ({ options }: { options: { value: string }[] }) => (
    <div data-testid="perspective-options">{options.map(option => option.value).join(',')}</div>
  ),
}));

const allProps = {
  hasAws: true,
  hasAwsOcp: true,
  hasAzure: true,
  hasAzureOcp: true,
  hasGcp: true,
  hasGcpOcp: true,
  hasIbm: true,
  hasIbmOcp: true,
  hasOci: true,
  hasOcp: true,
  hasOcpCloud: true,
  hasRhel: true,
  isIbmFlagEnabled: true,
};

describe('Perspective', () => {
  test('includes all perspectives for cost explorer', () => {
    render(<Perspective {...allProps} />);
    expect(screen.getByTestId('perspective-options')).toHaveTextContent('ocp');
    expect(screen.getByTestId('perspective-options')).toHaveTextContent('aws');
    expect(screen.getByTestId('perspective-options')).toHaveTextContent('rhel');
  });

  test('includes infrastructure options on the infrastructure tab', () => {
    render(<Perspective {...allProps} isInfrastructureTab />);
    expect(screen.getByTestId('perspective-options')).toHaveTextContent('ocp_cloud');
    expect(screen.getByTestId('perspective-options')).toHaveTextContent('aws');
    expect(screen.getByTestId('perspective-options')).not.toHaveTextContent('rhel');
  });

  test('includes rhel on the rhel tab', () => {
    render(<Perspective {...allProps} isInfrastructureTab={false} isRhelTab />);
    expect(screen.getByTestId('perspective-options')).toHaveTextContent('rhel');
    expect(screen.getByTestId('perspective-options')).not.toHaveTextContent('aws');
  });

  test('includes ocp when neither infrastructure nor rhel tabs are selected', () => {
    render(<Perspective {...allProps} isInfrastructureTab={false} isRhelTab={false} />);
    expect(screen.getByTestId('perspective-options')).toHaveTextContent('ocp');
  });
});
