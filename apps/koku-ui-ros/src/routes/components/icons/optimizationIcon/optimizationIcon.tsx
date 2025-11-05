import './optimizationIcon.scss';

import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

interface OptimizationIconProps extends WrappedComponentProps {
  className?: string;
}

const icon = require('./Red_Hat-IT_Optimization-Gray.svg');

const OptimizationIcon: React.FC<OptimizationIconProps> = ({ className = '', intl }) => {
  return (
    <img
      className={`optimization-icon ${className}`}
      src={icon}
      alt={intl.formatMessage(messages.optimizations)}
      aria-hidden="true"
    />
  );
};

export default injectIntl(OptimizationIcon);
