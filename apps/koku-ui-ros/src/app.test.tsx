import { render, screen } from '@testing-library/react';
import React from 'react';

import App from './app';

const mockUpdateDocumentTitle = jest.fn();
const mockUseFeatureToggle = jest.fn();
const mockInvalidateSession = jest.fn();

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: () => ({
    updateDocumentTitle: mockUpdateDocumentTitle,
  }),
}));

jest.mock('@redhat-cloud-services/frontend-components-notifications/NotificationsProvider', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="notifications">{children}</div>,
}));

jest.mock('@redhat-cloud-services/frontend-components-notifications/state', () => ({
  createStore: () => ({}),
}));

jest.mock('@koku-ui/ui-lib/components/page/uiVersion', () => () => <div data-testid="ui-version" />);

jest.mock('./components/featureToggle', () => ({
  useFeatureToggle: () => mockUseFeatureToggle(),
}));

jest.mock('utils/sessionStorage', () => ({
  invalidateSession: () => mockInvalidateSession(),
}));

jest.mock('./routes', () => ({
  Routes: () => <div data-testid="routes" />,
}));

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  test('initializes chrome, feature toggles, and session', () => {
    render(<App />);

    expect(mockUpdateDocumentTitle).toHaveBeenCalledWith('cost-management-ros');
    expect(mockUseFeatureToggle).toHaveBeenCalled();
    expect(mockInvalidateSession).toHaveBeenCalled();
    expect(screen.getByTestId('routes')).toBeInTheDocument();
    expect(screen.getByTestId('ui-version')).toBeInTheDocument();
  });

  test('sets overflow auto on the console layout element', () => {
    const layout = document.createElement('div');
    layout.className = 'chr-scope__default-layout';
    document.body.appendChild(layout);

    render(<App />);

    expect(layout.style.overflow).toBe('auto');
  });
});
