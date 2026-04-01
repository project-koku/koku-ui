import messages from 'locales/messages';
import type React from 'react';
import { useIntl } from 'react-intl';

interface EfficiencyOwnProps {
  // TBD...
}

type EfficiencyProps = EfficiencyOwnProps;

const Efficiency: React.FC<EfficiencyProps> = () => {
  const intl = useIntl();

  return intl.formatMessage(messages.efficiency);
};

export { Efficiency };
