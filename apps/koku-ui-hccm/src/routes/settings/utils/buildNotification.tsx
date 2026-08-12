import { ExpandableSection } from '@patternfly/react-core';
import messages from 'locales/messages';
import type { ReactNode } from 'react';
import React from 'react';
import type { IntlShape } from 'react-intl';

export interface SettingsToastNotification {
  autoDismiss?: boolean;
  description?: ReactNode;
  detail?: string;
  dismissable?: boolean;
  title?: ReactNode;
  variant?: string;
}

/**
 * Renders i18n description as-is and, when `detail` is present, an expandable API error section.
 * Disables auto-dismiss so users can open the details (PatternFly toast guidance).
 */
export const buildNotification = (notification: SettingsToastNotification, intl: IntlShape) => {
  const { detail, ...rest } = notification;
  if (!detail) {
    return rest;
  }

  return {
    ...rest,
    autoDismiss: false,
    description: (
      <>
        {rest.description}
        <ExpandableSection
          toggleTextCollapsed={intl.formatMessage(messages.showDetails)}
          toggleTextExpanded={intl.formatMessage(messages.hideDetails)}
        >
          {detail}
        </ExpandableSection>
      </>
    ),
  };
};
