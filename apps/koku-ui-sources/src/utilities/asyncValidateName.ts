import { findSourceByName } from 'api/entities';

type AsyncValidator = (value: string) => Promise<string | undefined>;

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

export const asyncValidateName: AsyncValidator = async (value: string) => {
  try {
    const response = await findSourceByName(value);
    if (response.meta.count > 0) {
      return 'That name is taken. Try a different name.';
    }
    return undefined;
  } catch {
    return 'Name validation failed. Please try again.';
  }
};

export const nameValidator = createDebouncedValidator(asyncValidateName, 250);
