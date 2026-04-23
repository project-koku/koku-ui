import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import React from 'react';

export const Description: React.FC<any> = props => {
  const { Content, ...rest } = useFieldApi(props);
  return Content ? <Content {...rest} /> : null;
};

Description.displayName = 'Description';
