import {
  asyncValidateName,
  createDebouncedValidator,
  DUPLICATE_SOURCE_NAME_ID,
  NAME_VALIDATION_ERROR_ID,
  type FormatMessage,
} from './asyncValidateName';
import { findSourceByName } from '../api/entities';

jest.mock('api/entities');

const mockedFind = findSourceByName as jest.MockedFunction<typeof findSourceByName>;

/** Mirrors English defaults from `locales/data.json` for unit tests (no IntlProvider). */
const formatMessageEn: FormatMessage = id => {
  if (id === DUPLICATE_SOURCE_NAME_ID) {
    return 'That name is taken. Try a different name.';
  }
  if (id === NAME_VALIDATION_ERROR_ID) {
    return 'Name validation failed. Please try again.';
  }
  throw new Error(`Unexpected message id in test: ${id}`);
};

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

    const result = await asyncValidateName('taken', formatMessageEn);
    expect(result).toBe('That name is taken. Try a different name.');
    expect(mockedFind).toHaveBeenCalledWith('taken');
  });

  it('returns undefined when no source with the name exists', async () => {
    mockedFind.mockResolvedValue({
      meta: { count: 0 },
      links: { first: '', next: null, previous: null, last: '' },
      data: [],
    });

    const result = await asyncValidateName('unique-name', formatMessageEn);
    expect(result).toBeUndefined();
  });

  it('returns error message on network error', async () => {
    mockedFind.mockRejectedValue(new Error('Network Error'));

    const result = await asyncValidateName('anything', formatMessageEn);
    expect(result).toBe('Name validation failed. Please try again.');
  });

  it('uses formatMessage with duplicate id when name is taken', async () => {
    mockedFind.mockResolvedValue({
      meta: { count: 1 },
      links: { first: '', next: null, previous: null, last: '' },
      data: [],
    });

    const formatMessage = jest.fn((id: string) => (id === DUPLICATE_SOURCE_NAME_ID ? 'CUSTOM_DUPLICATE' : id));

    const result = await asyncValidateName('x', formatMessage);
    expect(result).toBe('CUSTOM_DUPLICATE');
    expect(formatMessage).toHaveBeenCalledWith(DUPLICATE_SOURCE_NAME_ID);
  });

  it('uses formatMessage with validation error id on network error', async () => {
    mockedFind.mockRejectedValue(new Error('Network Error'));

    const formatMessage = jest.fn((id: string) => (id === NAME_VALIDATION_ERROR_ID ? 'CUSTOM_ERROR' : id));

    const result = await asyncValidateName('x', formatMessage);
    expect(result).toBe('CUSTOM_ERROR');
    expect(formatMessage).toHaveBeenCalledWith(NAME_VALIDATION_ERROR_ID);
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
