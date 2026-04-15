import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { Content } from '@patternfly/react-core';
import { getSourceTypeById } from 'apis/source-types';
import { messages } from 'i18n/messages';
import React from 'react';
import { useIntl } from 'react-intl';

export const NameDescription: React.FC = () => {
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

NameDescription.displayName = 'NameDescription';
