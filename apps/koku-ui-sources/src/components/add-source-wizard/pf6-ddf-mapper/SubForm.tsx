import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import React from 'react';

export const SubForm: React.FC<any> = ({ fields, title, description, ...rest }) => {
  const { renderForm } = useFormApi();

  return (
    <div {...rest}>
      {title && <h3>{title}</h3>}
      {description && <p>{description}</p>}
      {renderForm(fields)}
    </div>
  );
};

SubForm.displayName = 'SubForm';
