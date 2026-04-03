import './efficiencySummary.scss';

import { Flex, FlexItem, Title, TitleSizes } from '@patternfly/react-core';
import type { OcpReport } from 'api/reports/ocpReports';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { formatCurrency, formatPercentage } from 'utils/format';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

interface EfficiencySummaryOwnProps extends RouterComponentProps, WrappedComponentProps {
  report: OcpReport;
}

interface EfficiencySummaryState {
  columns?: any[];
  rows?: any[];
}

type EfficiencySummaryProps = EfficiencySummaryOwnProps;

class EfficiencySummaryBase extends React.Component<EfficiencySummaryProps, EfficiencySummaryState> {
  public render() {
    const { intl, report } = this.props;

    return (
      <Flex className="summaryContainer">
        <Flex gap={{ default: 'gap4xl' }}>
          <FlexItem alignSelf={{ default: 'alignSelfFlexStart' }} className="workloadEfficiency">
            {intl.formatMessage(messages.percent, {
              value: formatPercentage(report?.meta?.total?.total_score?.usage_efficiency_percent || 0),
            })}
          </FlexItem>
          <FlexItem alignSelf={{ default: 'alignSelfFlexStart' }}>
            <Title headingLevel="h3" size={TitleSizes.lg}>
              {intl.formatMessage(messages.wastedCost)}
            </Title>
            <div>
              {intl.formatMessage(messages.percent, {
                value: formatCurrency(
                  report?.meta?.total?.total_score?.wasted_cost?.value || 0,
                  report?.meta?.total?.total_score?.wasted_cost?.units || 'USD'
                ),
              })}
            </div>
          </FlexItem>
        </Flex>
      </Flex>
    );
  }
}

const EfficiencySummary = injectIntl(withRouter(EfficiencySummaryBase));

export { EfficiencySummary };
