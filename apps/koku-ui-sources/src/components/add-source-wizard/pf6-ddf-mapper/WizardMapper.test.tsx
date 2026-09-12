import WizardContext from '@data-driven-forms/react-form-renderer/wizard-context';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { IntlProvider } from 'react-intl';

import localeMessages from '../../../../locales/data.json';
import { WizardMapper } from './WizardMapper';

jest.mock('@data-driven-forms/common/wizard', () => ({
  __esModule: true,
  default: ({ Wizard: WizardComp }: { Wizard: React.ComponentType }) => <WizardComp />,
}));

const renderWizard = (context: Record<string, unknown>) =>
  render(
    <IntlProvider locale="en" messages={localeMessages.en}>
      <WizardContext.Provider value={context as any}>
        <WizardMapper />
      </WizardContext.Provider>
    </IntlProvider>
  );

describe('WizardMapper', () => {
  const formOptions = {
    valid: true,
    handleSubmit: jest.fn(),
    onCancel: jest.fn(),
    getState: jest.fn(),
    renderForm: jest.fn(() => <div data-testid="wizard-fields" />),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns null when there is no current step', () => {
    const { container } = renderWizard({
      formOptions,
      currentStep: undefined,
      navSchema: [],
      activeStepIndex: 0,
    });

    expect(container).toBeEmptyDOMElement();
  });

  it('renders steps, advances, and submits on the last step', async () => {
    const user = userEvent.setup();
    const handleNext = jest.fn();
    const handlePrev = jest.fn();
    const jumpToStep = jest.fn();
    const selectNext = jest.fn(() => 'step2');

    const { rerender } = render(
      <IntlProvider locale="en" messages={localeMessages.en}>
        <WizardContext.Provider
          value={
            {
              formOptions,
              currentStep: { name: 'step1', title: 'Step 1', fields: [{}], nextStep: 'step2' },
              handlePrev,
              handleNext,
              navSchema: [
                { name: 'step1', title: 'Step 1' },
                { name: 'step2', title: 'Step 2' },
              ],
              activeStepIndex: 0,
              selectNext,
              conditionalSubmitFlag: 'submit',
              jumpToStep,
            } as any
          }
        >
          <WizardMapper />
        </WizardContext.Provider>
      </IntlProvider>
    );

    expect(screen.getByRole('heading', { name: 'Step 1' })).toBeInTheDocument();
    expect(screen.getByTestId('wizard-fields')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(handleNext).toHaveBeenCalledWith('step2');

    await user.click(screen.getByRole('button', { name: 'Step 1' }));
    expect(jumpToStep).toHaveBeenCalledWith(0);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(formOptions.onCancel).toHaveBeenCalled();

    rerender(
      <IntlProvider locale="en" messages={localeMessages.en}>
        <WizardContext.Provider
          value={
            {
              formOptions,
              currentStep: { name: 'step2', title: 'Step 2', fields: [{}] },
              handlePrev,
              handleNext,
              navSchema: [
                { name: 'step1', title: 'Step 1' },
                { name: 'step2', title: 'Step 2' },
              ],
              activeStepIndex: 1,
              selectNext,
              conditionalSubmitFlag: 'submit',
              jumpToStep,
            } as any
          }
        >
          <WizardMapper />
        </WizardContext.Provider>
      </IntlProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(formOptions.handleSubmit).toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(handlePrev).toHaveBeenCalled();
  });

  it('submits when the next step is the conditional submit flag', async () => {
    const user = userEvent.setup();
    const handleNext = jest.fn();

    renderWizard({
      formOptions,
      currentStep: { name: 'review', title: 'Review', fields: [{}], nextStep: 'submit' },
      handlePrev: jest.fn(),
      handleNext,
      navSchema: [
        { name: 'review', title: 'Review' },
        { name: 'done', title: 'Done' },
      ],
      activeStepIndex: 0,
      selectNext: () => 'submit',
      conditionalSubmitFlag: 'submit',
      jumpToStep: jest.fn(),
    });

    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(formOptions.handleSubmit).toHaveBeenCalled();
    expect(handleNext).not.toHaveBeenCalled();
  });

  it('uses the step name when title is missing', () => {
    renderWizard({
      formOptions,
      currentStep: { name: 'credentials', fields: [{}] },
      handlePrev: jest.fn(),
      handleNext: jest.fn(),
      navSchema: ['credentials'],
      activeStepIndex: 0,
      selectNext: jest.fn(),
      jumpToStep: jest.fn(),
    });

    expect(screen.getAllByText('credentials').length).toBeGreaterThan(0);
  });
});
