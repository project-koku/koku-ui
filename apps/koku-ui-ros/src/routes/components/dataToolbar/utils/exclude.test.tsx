import { render, screen } from '@testing-library/react';
import React from 'react';

import { ExcludeType, getExcludeSelect, getExcludeSelectOptions } from './exclude';

jest.mock('routes/components/selectWrapper', () => ({
  SelectWrapper: ({ options, selection }: { options: { value: string; toString: () => string }[]; selection?: any }) => (
    <div>
      <span data-testid="selection">{selection?.value}</span>
      {options.map(option => (
        <span key={option.value}>{option.toString()}</span>
      ))}
    </div>
  ),
}));

describe('exclude toolbar utils', () => {
  test('getExcludeSelectOptions includes exclude and include', () => {
    const options = getExcludeSelectOptions();
    expect(options.map(option => option.value)).toEqual([ExcludeType.exclude, ExcludeType.include]);
  });

  test('getExcludeSelect renders the current selection', () => {
    render(
      getExcludeSelect({
        currentExclude: ExcludeType.include,
        onExcludeSelect: jest.fn(),
      }) as React.ReactElement
    );
    expect(screen.getByTestId('selection')).toHaveTextContent(ExcludeType.include);
  });
});
