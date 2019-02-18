import { Button, ButtonType, ButtonVariant } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { AwsQuery, getQuery } from 'api/awsQuery';
import { AwsReport, AwsReportType } from 'api/awsReports';
import {
  AwsReportSummaryItem,
  AwsReportSummaryItems,
} from 'components/awsReportSummary';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { awsReportsActions, awsReportsSelectors } from 'store/awsReports';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { formatValue } from 'utils/formatValue';
import {
  ComputedAwsReportItem,
  getComputedAwsReportItems,
} from 'utils/getComputedAwsReportItems';
import { getTestProps, testIds } from '../../testIds';
import { styles } from './detailsChart.styles';
import { DetailsChartModal } from './detailsChartModal';

interface DetailsChartOwnProps {
  groupBy: string;
  item: ComputedAwsReportItem;
  localGroupBy: string;
}

interface DetailsChartStateProps {
  queryString?: string;
  report?: AwsReport;
  reportFetchStatus?: FetchStatus;
}

interface DetailsChartDispatchProps {
  fetchReport?: typeof awsReportsActions.fetchReport;
}

interface DetailsChartState {
  isDetailsChartModalOpen: boolean;
}

type DetailsChartProps = DetailsChartOwnProps &
  DetailsChartStateProps &
  DetailsChartDispatchProps &
  InjectedTranslateProps;

class DetailsChartBase extends React.Component<DetailsChartProps> {
  public state: DetailsChartState = {
    isDetailsChartModalOpen: false,
  };

  public componentDidMount() {
    const { report, queryString } = this.props;
    if (!report) {
      this.props.fetchReport(AwsReportType.cost, queryString);
    }
  }

  public componentDidUpdate(prevProps: DetailsChartProps) {
    if (prevProps.queryString !== this.props.queryString) {
      this.props.fetchReport(AwsReportType.cost, this.props.queryString);
    }
  }

  private handleDetailsChartModalClose = (isOpen: boolean) => {
    this.setState({ isDetailsChartModalOpen: isOpen });
  };

  private handleDetailsChartModalOpen = event => {
    this.setState({ isDetailsChartModalOpen: true });
    event.preventDefault();
  };

  private getItems() {
    const { report, localGroupBy } = this.props;

    const computedItems = getComputedAwsReportItems({
      report,
      idKey: localGroupBy as any,
    });

    return computedItems;
  }

  public render() {
    const { item, groupBy, localGroupBy, report, t } = this.props;
    const { isDetailsChartModalOpen } = this.state;

    const computedItems = this.getItems();

    const otherIndex = computedItems.findIndex(i => {
      const id = i.id;
      if (id && id !== null) {
        return id.toString().includes('Other');
      }
    });

    return (
      <>
        <AwsReportSummaryItems idKey={localGroupBy as any} report={report}>
          {({ items }) =>
            items.map(_item => (
              <AwsReportSummaryItem
                key={_item.id}
                formatOptions={{}}
                formatValue={formatValue}
                label={_item.label ? _item.label.toString() : ''}
                totalValue={report.total.value}
                units={_item.units}
                value={_item.total}
              />
            ))
          }
        </AwsReportSummaryItems>
        {Boolean(otherIndex !== -1) && (
          <div className={css(styles.showMoreContainer)}>
            <Button
              {...getTestProps(testIds.details.show_more_btn)}
              onClick={this.handleDetailsChartModalOpen}
              type={ButtonType.button}
              variant={ButtonVariant.link}
            >
              {t('aws_details.show_more')}
            </Button>
            <DetailsChartModal
              groupBy={groupBy}
              isOpen={isDetailsChartModalOpen}
              item={item}
              onClose={this.handleDetailsChartModalClose}
              localGroupBy={localGroupBy}
            />
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  DetailsChartOwnProps,
  DetailsChartStateProps
>((state, { groupBy, item, localGroupBy }) => {
  const query: AwsQuery = {
    filter: {
      time_scope_units: 'month',
      time_scope_value: -1,
      resolution: 'monthly',
      limit: 3,
    },
    group_by: { [groupBy]: item.label, [localGroupBy]: '*' },
  };
  const queryString = getQuery(query);
  const report = awsReportsSelectors.selectReport(
    state,
    AwsReportType.cost,
    queryString
  );
  const reportFetchStatus = awsReportsSelectors.selectReportFetchStatus(
    state,
    AwsReportType.cost,
    queryString
  );
  return {
    queryString,
    report,
    reportFetchStatus,
  };
});

const mapDispatchToProps: DetailsChartDispatchProps = {
  fetchReport: awsReportsActions.fetchReport,
};

const DetailsChart = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DetailsChartBase)
);

export { DetailsChart, DetailsChartBase, DetailsChartProps };
