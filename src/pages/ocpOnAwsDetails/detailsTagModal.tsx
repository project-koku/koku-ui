import { Modal } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { getQuery } from 'api/awsQuery';
import { AwsReport, AwsReportType } from 'api/awsReports';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { awsReportsActions, awsReportsSelectors } from 'store/awsReports';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { ComputedOcpOnAwsReportItem } from 'utils/getComputedOcpOnAwsReportItems';
import { modalOverride, styles } from './detailsTagModal.styles';

interface DetailsTagModalOwnProps {
  account: string | number;
  groupBy: string;
  isOpen: boolean;
  item: ComputedOcpOnAwsReportItem;
  onClose(isOpen: boolean);
}

interface DetailsTagModalStateProps {
  queryString?: string;
  report?: AwsReport;
  reportFetchStatus?: FetchStatus;
}

interface DetailsTagModalDispatchProps {
  fetchReport?: typeof awsReportsActions.fetchReport;
}

type DetailsTagModalProps = DetailsTagModalOwnProps &
  DetailsTagModalStateProps &
  DetailsTagModalDispatchProps &
  InjectedTranslateProps;

const reportType = AwsReportType.tag;

class DetailsTagModalBase extends React.Component<DetailsTagModalProps> {
  constructor(props: DetailsTagModalProps) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  public componentDidMount() {
    const { fetchReport, queryString } = this.props;
    fetchReport(reportType, queryString);
  }

  public componentDidUpdate(prevProps: DetailsTagModalProps) {
    const { fetchReport, queryString } = this.props;
    if (prevProps.queryString !== queryString) {
      fetchReport(reportType, queryString);
    }
  }

  private handleClose = () => {
    this.props.onClose(false);
  };

  private getTags = () => {
    const { report } = this.props;
    const tags = [];

    if (report) {
      for (const tag of report.data) {
        for (const val of tag.values) {
          tags.push(`${(tag as any).key}: ${val}`);
        }
      }
    }
    return tags;
  };

  public render() {
    const { groupBy, isOpen, item, t } = this.props;
    const tags = this.getTags();

    return (
      <Modal
        className={`${modalOverride} ${css(styles.modal)}`}
        isLarge
        isOpen={isOpen}
        onClose={this.handleClose}
        title={t('ocp_on_aws_details.tags_modal_title', {
          groupBy,
          name: item.label,
        })}
      >
        {tags.map((tag, index) => (
          <div key={`tag-${index}`}>{tag}</div>
        ))}
      </Modal>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  DetailsTagModalOwnProps,
  DetailsTagModalStateProps
>((state, { account }) => {
  const queryString = getQuery({
    filter: {
      account,
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: -1,
    },
  });
  const report = awsReportsSelectors.selectReport(
    state,
    reportType,
    queryString
  );
  const reportFetchStatus = awsReportsSelectors.selectReportFetchStatus(
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

const mapDispatchToProps: DetailsTagModalDispatchProps = {
  fetchReport: awsReportsActions.fetchReport,
};

const DetailsTagModal = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DetailsTagModalBase)
);

export { DetailsTagModal, DetailsTagModalProps };
