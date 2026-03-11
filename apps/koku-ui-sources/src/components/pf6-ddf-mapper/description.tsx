import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import React from 'react';

const Description: React.FC<any> = props => {
  const { Content, ...rest } = useFieldApi(props);
  return Content ? <Content {...rest} /> : null;
};

export default Description;
