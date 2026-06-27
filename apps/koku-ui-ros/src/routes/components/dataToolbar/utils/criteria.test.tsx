import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { CriteriaType, getCriteriaSelect, getCriteriaSelectOptions } from './criteria';

describe('getCriteriaSelectOptions', () => {
  test('returns include and exclude options by default', () => {
    const options = getCriteriaSelectOptions(false);

    expect(options).toHaveLength(2);
    expect(options.map(option => option.value)).toEqual([CriteriaType.exclude, CriteriaType.include]);
  });

  test('includes exact option when showExact is true', () => {
    const options = getCriteriaSelectOptions(true);

    expect(options).toHaveLength(3);
    expect(options[0].value).toBe(CriteriaType.exact);
  });
});

describe('getCriteriaSelect', () => {
  test('renders criteria select and handles selection', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onCriteriaSelect = jest.fn();

    render(
      getCriteriaSelect({
        currentCriteria: CriteriaType.include,
        onCriteriaSelect,
        showExact: true,
      })
    );

    await user.click(screen.getByRole('button'));
    const options = screen.getAllByRole('option');
    await user.click(options.find(option => option.textContent?.includes('exclude')) as HTMLElement);

    expect(onCriteriaSelect).toHaveBeenCalled();
  });
});
