import { getQuery } from 'api/azureQuery';
import { AzureReport, AzureReportType } from 'api/azureReports';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import {
  azureReportsActions,
  azureReportsSelectors,
} from 'store/reports/azureReports';
import { ComputedAzureReportItem } from 'utils/computedReport/getComputedAzureReportItems';

interface DetailsTagViewOwnProps {
  account: string | number;
  groupBy: string;
  item: ComputedAzureReportItem;
}

interface DetailsTagViewStateProps {
  queryString?: string;
  report?: AzureReport;
  reportFetchStatus?: FetchStatus;
}

interface DetailsTagViewDispatchProps {
  fetchReport?: typeof azureReportsActions.fetchReport;
}

type DetailsTagViewProps = DetailsTagViewOwnProps &
  DetailsTagViewStateProps &
  DetailsTagViewDispatchProps &
  InjectedTranslateProps;

const reportType = AzureReportType.tag;

class DetailsTagViewBase extends React.Component<DetailsTagViewProps> {
  public componentDidMount() {
    const { fetchReport, queryString } = this.props;
    fetchReport(reportType, queryString);
  }

  public componentDidUpdate(prevProps: DetailsTagViewProps) {
    const { fetchReport, queryString } = this.props;
    if (prevProps.queryString !== queryString) {
      fetchReport(reportType, queryString);
    }
  }

  private getTags = () => {
    const { report } = this.props;
    const tags = [];

    if (report) {
      for (const tag of report.data) {
        if (Array.isArray(tag.values)) {
          for (const val of tag.values) {
            tags.push(`${(tag as any).key}: ${val}`);
          }
        } else {
          tags.push(`${(tag as any).key}: ${tag.values}`);
        }
      }
    }
    return tags;
  };

  public render() {
    const tags = this.getTags();

    return tags.map((tag, index) => <div key={`tag-${index}`}>{tag}</div>);
  }
}

const mapStateToProps = createMapStateToProps<
  DetailsTagViewOwnProps,
  DetailsTagViewStateProps
>((state, { account }) => {
  const queryString = getQuery({
    filter: {
      subscription_guid: account,
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: -1,
    },
  });
  const report = azureReportsSelectors.selectReport(
    state,
    reportType,
    queryString
  );
  const reportFetchStatus = azureReportsSelectors.selectReportFetchStatus(
    state,
    reportType,
    queryString
  );
  return {
    queryString,
    report,
    reportFetchStatus,
  };
});

const mapDispatchToProps: DetailsTagViewDispatchProps = {
  fetchReport: azureReportsActions.fetchReport,
};

const DetailsTagView = translate()(
  connect(mapStateToProps, mapDispatchToProps)(DetailsTagViewBase)
);

export { DetailsTagView, DetailsTagViewProps };
