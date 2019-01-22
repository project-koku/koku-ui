export type Validator = (value: string) => boolean;

export const sourceTypeValidator = (value: string) => value !== '';

export const sourceNameValidator = (value: string) =>
  new RegExp('^.').test(value);

export const ocpClusterIdValidator = (value: string) =>
  new RegExp('^.').test(value);
