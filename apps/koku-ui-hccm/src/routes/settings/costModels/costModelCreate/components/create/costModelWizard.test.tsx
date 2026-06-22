import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { FetchStatus } from 'store/common';
import { defaultState, stateKey } from 'store/costModels/costModelReducer';
import { configureStore } from 'store/store';
import { routerFuture } from 'testUtils';

import { CostModelWizard } from './costModelWizard';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('utils/sessionStorage', () => ({
  getAccountCurrency: () => 'USD',
}));

jest.mock('routes/settings/costModels/utils', () => ({
  useCostModelNotifications: jest.fn(),
}));

jest.mock('@patternfly/react-core', () => {
  const actual = jest.requireActual('@patternfly/react-core');
  return {
    ...actual,
    useWizardContext: () => ({
      activeStep: { id: 'step-1', index: 1 },
      close: jest.fn(),
      goToNextStep: jest.fn(),
      goToPrevStep: jest.fn(),
      goToStepById: jest.fn(),
      goToStepByIndex: jest.fn(),
      steps: [{ id: 'step-2b', index: 2 }],
    }),
    Wizard: ({ children, header }: { children: React.ReactNode; header?: React.ReactNode }) => (
      <div data-testid="cost-model-wizard">
        {header}
        {children}
      </div>
    ),
    WizardHeader: ({ title, onClose }: { title?: React.ReactNode; onClose?: () => void }) => (
      <div data-testid="wizard-header">
        {title}
        <button type="button" onClick={onClose}>
          close-wizard
        </button>
      </div>
    ),
    WizardStep: ({ children, steps }: { children?: React.ReactNode; steps?: React.ReactNode[] }) => (
      <div data-testid="wizard-step">
        {children}
        {steps}
      </div>
    ),
    WizardFooter: () => <div data-testid="wizard-footer" />,
  };
});

jest.mock('routes/settings/costModels/costModelCreate/components/steps/general', () => ({
  GeneralInfo: () => <div data-testid="general-info-step" />,
}));

jest.mock('routes/settings/costModels/costModelCreate/components/steps/markup', () => ({
  Markup: () => <div data-testid="markup-step" />,
}));

jest.mock('routes/settings/costModels/costModelCreate/components/steps/distribution', () => ({
  Distribution: () => <div data-testid="distribution-step" />,
}));

jest.mock('routes/settings/costModels/costModelCreate/components/steps/integrations', () => ({
  Integration: () => <div data-testid="integration-step" />,
}));

jest.mock('routes/settings/costModels/costModelCreate/components/steps/priceList', () => ({
  AddPriceList: () => <div data-testid="add-price-list-step" />,
  OrderPriceList: () => <div data-testid="order-price-list-step" />,
}));

jest.mock('routes/settings/costModels/costModelCreate/components/steps/review', () => ({
  ReviewDetails: () => <div data-testid="review-details-step" />,
  ReviewSuccess: ({ name }: { name?: string }) => <div data-testid="review-success">{name}</div>,
}));

jest.mock('./exitModal', () => ({
  ExitModal: ({ isOpen, onConfirm, onCancel }: any) =>
    isOpen ? (
      <div data-testid="exit-modal">
        <button type="button" onClick={onConfirm}>
          exit-confirm
        </button>
        <button type="button" onClick={onCancel}>
          exit-cancel
        </button>
      </div>
    ) : null,
}));

const renderWizard = (preloadedState?: Record<string, unknown>) => {
  const store = configureStore(preloadedState ?? ({} as any));

  return render(
    <Provider store={store}>
      <MemoryRouter future={routerFuture}>
        <IntlProvider locale="en">
          <CostModelWizard canWrite />
        </IntlProvider>
      </MemoryRouter>
    </Provider>
  );
};

describe('CostModelWizard', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders wizard with header and step content', () => {
    renderWizard();

    expect(screen.getByTestId('cost-model-wizard')).toBeInTheDocument();
    expect(screen.getByTestId('wizard-header')).toHaveTextContent(/create a cost model/i);
    expect(screen.getByTestId('general-info-step')).toBeInTheDocument();
    expect(screen.getByTestId('markup-step')).toBeInTheDocument();
    expect(screen.getByTestId('distribution-step')).toBeInTheDocument();
    expect(screen.getByTestId('integration-step')).toBeInTheDocument();
    expect(screen.getByTestId('add-price-list-step')).toBeInTheDocument();
    expect(screen.getByTestId('review-details-step')).toBeInTheDocument();
  });

  test('shows ReviewSuccess when add status is complete', async () => {
    renderWizard({
      [stateKey]: {
        ...defaultState,
        add: {
          ...defaultState.add,
          error: null,
          status: FetchStatus.complete,
        },
      },
    } as any);

    await waitFor(() => {
      expect(screen.getByTestId('review-success')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('cost-model-wizard')).not.toBeInTheDocument();
  });

  test('close wizard opens exit modal and confirm navigates away', () => {
    renderWizard();
    fireEvent.click(screen.getByRole('button', { name: /close-wizard/i }));
    expect(screen.getByTestId('exit-modal')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /exit-confirm/i }));
    expect(mockNavigate).toHaveBeenCalled();
  });
});
