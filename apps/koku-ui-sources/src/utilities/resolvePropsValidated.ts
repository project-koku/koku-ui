const resolvePropsValidated = (_props: any, { meta }: any) => {
  if (meta.validating) {
    return { helperText: 'Validating...' };
  }
  if (meta.valid) {
    return { validated: 'success' };
  }
  return {};
};

export default resolvePropsValidated;
