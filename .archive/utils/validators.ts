export type Validator = (value: string) => boolean;

export const sourceTypeValidator = (value: string) => value !== '';

export const sourceNameValidator = (value: string) => new RegExp('^.').test(value);

export const ocpClusterIdValidator = (value: string) => new RegExp('^.').test(value);

export const awsS3BucketNameValidator = (value: string) => new RegExp('^[A-Za-z0-9]+[A-Za-z0-9_-]*$').test(value);

export const arnValidator = (value: string) => {
  const arnPrefix = 'arn:aws:';
  if (value.length < arnPrefix.length) {
    return false;
  }
  if (value.length === arnPrefix.length) {
    return value === arnPrefix;
  }
  return value.indexOf(arnPrefix) === 0;
};
