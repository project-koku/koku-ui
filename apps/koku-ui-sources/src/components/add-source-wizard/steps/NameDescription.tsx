import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { Content } from '@patternfly/react-core';
import { getSourceTypeById } from 'api/sourceTypes';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';

const NameDescription: React.FC = () => {
  const intl = useIntl();
  const { getState } = useFormApi();
  const sourceType = getState().values.source_type;
  const typeName = getSourceTypeById(sourceType)?.product_name;

  const text = typeName
    ? intl.formatMessage(messages.nameDescriptionWithType, { typeName })
    : intl.formatMessage(messages.nameDescriptionDefault);

  return (
    <Content>
      <Content component="p">{text}</Content>
    </Content>
  );
};

export default NameDescription;
