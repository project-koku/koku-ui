import type { FormProps as FormPFProps } from '@patternfly/react-core';
import { Form as FormPF } from '@patternfly/react-core';
import React from 'react';

type FormProps = Omit<FormPFProps, 'onSubmit'>;

export const Form: React.ComponentType<FormProps> = ({ children, ...props }) => {
  return (
    <FormPF onSubmit={(event: React.FormEvent<HTMLFormElement>) => event.preventDefault()} {...props}>
      {children}
    </FormPF>
  );
};
