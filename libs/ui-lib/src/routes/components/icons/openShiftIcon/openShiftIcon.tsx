import './openShiftIcon.scss';

import messages from '@koku-ui/i18n/locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

interface OpenShiftIconProps extends WrappedComponentProps {
  className?: string;
}

const icon = require('./OpenShift-icon.svg');

const OpenShiftIcon: React.FC<OpenShiftIconProps> = ({ className, intl }) => {
  return (
    <img
      className={`openshift-icon ${className}`}
      src={icon}
      alt={intl.formatMessage(messages.ocp)}
      aria-hidden="true"
    />
  );
};

export default injectIntl(OpenShiftIcon);
