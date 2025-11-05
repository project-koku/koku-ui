import { render } from '@testing-library/react';
import React from 'react';
import DashboardBase from './dashboardBase';

const DummyWidget: React.FC<any> = ({ widgetId }) => <div data-testid={`w-${widgetId}`} />;

describe('overview/components/DashboardBase', () => {
  const selectWidgets = {
    1: { details: { showHorizontal: true } },
    2: { details: { showHorizontal: false } },
  } as any;

  test('renders horizontal layout for showHorizontal widgets', () => {
    const { getByTestId } = render(
      <DashboardBase DashboardWidget={DummyWidget} selectWidgets={selectWidgets} widgets={[1]} />
    );
    expect(getByTestId('w-1')).toBeInTheDocument();
  });

  test('renders vertical layout for non-horizontal widgets', () => {
    const { getByTestId } = render(
      <DashboardBase DashboardWidget={DummyWidget} selectWidgets={selectWidgets} widgets={[2]} />
    );
    expect(getByTestId('w-2')).toBeInTheDocument();
  });
}); 