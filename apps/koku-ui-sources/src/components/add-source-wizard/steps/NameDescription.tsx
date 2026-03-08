import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { Content } from '@patternfly/react-core';
import { getSourceTypeById } from 'api/sourceTypes';
import React from 'react';

const NameDescription: React.FC = () => {
  const { getState } = useFormApi();
  const sourceType = getState().values.source_type;
  const typeName = getSourceTypeById(sourceType)?.product_name ?? 'your';

  return (
    <Content>
      <Content component="p">Enter a name for your {typeName} source.</Content>
    </Content>
  );
};

export default NameDescription;
