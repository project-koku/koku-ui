import { act, renderHook } from '@testing-library/react';

import { usePrevious, useStateCallback } from './hooks';

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
});
