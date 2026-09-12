import { act, renderHook } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { usePrevious, useQueryFromRoute, useQueryState, useStateCallback } from './hooks';

describe('utils/hooks', () => {
  test('usePrevious returns the prior value', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 'one' },
    });

    expect(result.current).toBeUndefined();
    rerender({ value: 'two' });
    expect(result.current).toBe('one');
    rerender({ value: 'three' });
    expect(result.current).toBe('two');
  });

  test('useStateCallback updates state and invokes the callback', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useStateCallback('initial'));

    expect(result.current[0]).toBe('initial');

    act(() => {
      result.current[1]('next', callback);
    });

    expect(result.current[0]).toBe('next');
    expect(callback).toHaveBeenCalledWith('next');
  });

  test('useStateCallback can update without a callback', () => {
    const { result } = renderHook(() => useStateCallback(1));

    act(() => {
      result.current[1](2);
    });

    expect(result.current[0]).toBe(2);
  });

  test('useQueryFromRoute parses the location search string', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter initialEntries={['/explorer?group_by[project]=payments']}>{children}</MemoryRouter>
    );

    const { result } = renderHook(() => useQueryFromRoute(), { wrapper });
    expect(result.current).toEqual(expect.objectContaining({ group_by: expect.anything() }));
  });

  test('useQueryState reads router location state', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/details',
            state: { details: { filter_by: { project: 'cost' } } },
          },
        ]}
      >
        {children}
      </MemoryRouter>
    );

    const { result } = renderHook(() => useQueryState('details'), { wrapper });
    expect(result.current).toEqual({ filter_by: { project: 'cost' } });
  });
});
