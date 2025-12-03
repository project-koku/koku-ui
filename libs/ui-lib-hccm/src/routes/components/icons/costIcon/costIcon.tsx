import './costIcon.scss';

import messages from '@koku-ui/i18n/locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

interface CostIconProps extends WrappedComponentProps {
  className?: string;
}

const icon = require('./Cost-icon.svg');

const CostIcon: React.FC<CostIconProps> = ({ className, intl }) => {
  return (
    <img
      className={`cost-icon ${className}`}
      src={icon}
      alt={intl.formatMessage(messages.costManagement)}
      aria-hidden="true"
    />
  );
};

export default injectIntl(CostIcon);
