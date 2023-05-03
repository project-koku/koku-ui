import type { FormProps as FormPF4Props } from '@patternfly/react-core';
import { Form as FormPF4 } from '@patternfly/react-core';
import React from 'react';

type FormProps = Omit<FormPF4Props, 'onSubmit'>;

export const Form: React.ComponentType<FormProps> = ({ children, ...props }) => {
  return (
    <FormPF4 onSubmit={(event: React.FormEvent<HTMLFormElement>) => event.preventDefault()} {...props}>
      {children}
    </FormPF4>
  );
};
