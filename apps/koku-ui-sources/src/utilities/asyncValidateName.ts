import { findSourceByName } from 'api/entities';

/** Message id when the name is already taken (API returns matches). */
export const DUPLICATE_SOURCE_NAME_ID = 'sources.duplicateSourceName';

/** Message id for the name validation failure error (catch block). */
export const NAME_VALIDATION_ERROR_ID = 'sources.nameValidationError';

type AsyncValidator = (value: string) => Promise<string | undefined>;
export type FormatMessage = (id: string) => string;

export function createDebouncedValidator(validateFn: AsyncValidator, delay = 250) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let resolvePrev: ((value: string | undefined) => void) | undefined;

  return (value: string): Promise<string | undefined> =>
    new Promise(resolve => {
      if (resolvePrev) {
        resolvePrev(undefined);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      resolvePrev = resolve;
      timeoutId = setTimeout(() => {
        resolvePrev = undefined;
        validateFn(value).then(resolve, () => resolve(undefined));
      }, delay);
    });
}

export async function asyncValidateName(value: string, formatMessage: FormatMessage): Promise<string | undefined> {
  try {
    const response = await findSourceByName(value);
    if (response.meta.count > 0) {
      return formatMessage(DUPLICATE_SOURCE_NAME_ID);
    }
    return undefined;
  } catch {
    return formatMessage(NAME_VALIDATION_ERROR_ID);
  }
}

/** Returns a debounced name validator. Pass formatMessage from useIntl(). */
export function createNameValidator(formatMessage: FormatMessage) {
  return createDebouncedValidator((value: string) => asyncValidateName(value, formatMessage), 250);
}
