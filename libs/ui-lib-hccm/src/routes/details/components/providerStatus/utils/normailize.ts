export const normalize = (value: string) => {
  return value ? value.toLowerCase().replace('-', '_') : undefined;
};
