import { createDebouncedValidator, asyncValidateName } from './asyncValidateName';
import { findSourceByName } from 'api/entities';

jest.mock('api/entities');

const mockedFind = findSourceByName as jest.MockedFunction<typeof findSourceByName>;

describe('asyncValidateName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns error when a source with the name exists', async () => {
    mockedFind.mockResolvedValue({
      meta: { count: 1 },
      links: { first: '', next: null, previous: null, last: '' },
      data: [{ id: 1, uuid: 'u1', name: 'taken' } as any],
    });

    const result = await asyncValidateName('taken');
    expect(result).toBe('That name is taken. Try a different name.');
    expect(mockedFind).toHaveBeenCalledWith('taken');
  });

  it('returns undefined when no source with the name exists', async () => {
    mockedFind.mockResolvedValue({
      meta: { count: 0 },
      links: { first: '', next: null, previous: null, last: '' },
      data: [],
    });

    const result = await asyncValidateName('unique-name');
    expect(result).toBeUndefined();
  });

  it('returns error message on network error', async () => {
    mockedFind.mockRejectedValue(new Error('Network Error'));

    const result = await asyncValidateName('anything');
    expect(result).toBe('Name validation failed. Please try again.');
  });
});

describe('createDebouncedValidator', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('debounces calls and resolves with the latest result', async () => {
    const mockFn = jest.fn().mockResolvedValue('name-taken');

    const debounced = createDebouncedValidator(mockFn, 250);

    const promise1 = debounced('first');
    const promise2 = debounced('second');

    jest.advanceTimersByTime(250);

    const result1 = await promise1;
    const result2 = await promise2;

    expect(result1).toBeUndefined();
    expect(result2).toBe('name-taken');
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('second');
  });

  it('calls the function after the delay', async () => {
    const mockFn = jest.fn().mockResolvedValue('error');
    const debounced = createDebouncedValidator(mockFn, 100);

    const promise = debounced('test');

    expect(mockFn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(100);

    const result = await promise;
    expect(result).toBe('error');
    expect(mockFn).toHaveBeenCalledWith('test');
  });
});
