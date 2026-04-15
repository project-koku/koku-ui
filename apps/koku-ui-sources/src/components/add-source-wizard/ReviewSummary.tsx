import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from '@patternfly/react-core';
import { messages } from 'i18n/messages';
import React from 'react';
import { useIntl } from 'react-intl';

export const ReviewSummary: React.FC = () => {
  const intl = useIntl();
  const formOptions = useFormApi();
  const values = formOptions.getState().values;

  const sourceType = values.source_type || 'Unknown';
  const sourceName = values.source_name || '—';
  const credentials = values.credentials || {};

  return (
    <DescriptionList isHorizontal>
      <DescriptionListGroup>
        <DescriptionListTerm>{intl.formatMessage(messages.reviewIntegrationName)}</DescriptionListTerm>
        <DescriptionListDescription>{sourceName}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>{intl.formatMessage(messages.reviewIntegrationType)}</DescriptionListTerm>
        <DescriptionListDescription>{sourceType}</DescriptionListDescription>
      </DescriptionListGroup>
      {Object.entries(credentials).map(([key, value]) => (
        <DescriptionListGroup key={key}>
          <DescriptionListTerm>{key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</DescriptionListTerm>
          <DescriptionListDescription>{String(value) || '—'}</DescriptionListDescription>
        </DescriptionListGroup>
      ))}
    </DescriptionList>
  );
};

ReviewSummary.displayName = 'ReviewSummary';
