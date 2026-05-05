import './workloadSummary.scss';

import { Flex, FlexItem, Title, TitleSizes } from '@patternfly/react-core';
import type { OcpReport } from 'api/reports/ocpReports';
import { useIsWastedCostToggleEnabled } from 'components/featureToggle';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { formatCurrency, formatPercentage } from 'utils/format';

interface WorkloadSummaryOwnProps {
  report: OcpReport;
}

type WorkloadSummaryProps = WorkloadSummaryOwnProps;

const WorkloadSummary: React.FC<WorkloadSummaryProps> = ({ report }: WorkloadSummaryProps) => {
  const intl = useIntl();
  const isWastedCostToggleEnabled = useIsWastedCostToggleEnabled();

  return (
    <Flex className="summaryContainer">
      <Flex gap={{ default: 'gap4xl' }}>
        <FlexItem alignSelf={{ default: 'alignSelfFlexStart' }} className="workloadEfficiency">
          {intl.formatMessage(messages.percent, {
            value: formatPercentage(report?.meta?.total?.total_score?.usage_efficiency_percent || 0),
          })}
        </FlexItem>
        {isWastedCostToggleEnabled && (
          <FlexItem alignSelf={{ default: 'alignSelfFlexStart' }}>
            <Title headingLevel="h3" size={TitleSizes.lg}>
              {intl.formatMessage(messages.wastedCost)}
            </Title>
            <div>
              {formatCurrency(
                report?.meta?.total?.total_score?.wasted_cost?.value || 0,
                report?.meta?.total?.total_score?.wasted_cost?.units || 'USD'
              )}
            </div>
          </FlexItem>
        )}
      </Flex>
    </Flex>
  );
};

export { WorkloadSummary };
