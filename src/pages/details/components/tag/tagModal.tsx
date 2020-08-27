import { Modal } from '@patternfly/react-core';
import { getQuery, parseQuery, Query } from 'api/queries/query';
import { Report, ReportPathsType, ReportType } from 'api/reports/report';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { TagView } from './tagView';

interface TagModalOwnProps {
  filterBy: string | number;
  groupBy: string;
  isOpen: boolean;
  onClose(isOpen: boolean);
  reportPathsType: ReportPathsType;
}

interface TagModalStateProps {
  queryString?: string;
  report?: Report;
  reportFetchStatus?: FetchStatus;
}

interface TagModalDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

type TagModalProps = TagModalOwnProps &
  TagModalStateProps &
  TagModalDispatchProps &
  InjectedTranslateProps;

const reportType = ReportType.tag;

class TagModalBase extends React.Component<TagModalProps> {
  constructor(props: TagModalProps) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  public componentDidMount() {
    const { fetchReport, queryString, reportPathsType } = this.props;
    fetchReport(reportPathsType, reportType, queryString);
  }

  public componentDidUpdate(prevProps: TagModalProps) {
    const { fetchReport, queryString, reportPathsType } = this.props;
    if (prevProps.queryString !== queryString) {
      fetchReport(reportPathsType, reportType, queryString);
    }
  }

  public shouldComponentUpdate(nextProps: TagModalProps) {
    const { filterBy, isOpen } = this.props;
    return nextProps.filterBy !== filterBy || nextProps.isOpen !== isOpen;
  }

  private getTagValueCount = () => {
    const { report } = this.props;
    let count = 0;

    if (report) {
      for (const tag of report.data) {
        if (tag.values) {
          count += tag.values.length;
        }
      }
    }
    return count;
  };

  private handleClose = () => {
    this.props.onClose(false);
  };

  public render() {
    const { filterBy, groupBy, isOpen, report, t } = this.props;

    return (
      <Modal
        isOpen={isOpen}
        onClose={this.handleClose}
        title={t('tag.title', {
          value: this.getTagValueCount(),
        })}
        width={'50%'}
      >
        <TagView filterBy={filterBy} groupBy={groupBy} report={report} />
      </Modal>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  TagModalOwnProps,
  TagModalStateProps
>((state, { filterBy, groupBy, reportPathsType }) => {
  const queryFromRoute = parseQuery<Query>(location.search);
  const queryString = getQuery({
    filter: {
      [groupBy]: filterBy,
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: -1,
      ...(queryFromRoute.filter.account && {
        account: queryFromRoute.filter.account,
      }),
    },
  });
  const report = reportSelectors.selectReport(
    state,
    reportPathsType,
    reportType,
    queryString
  );
  const reportFetchStatus = reportSelectors.selectReportFetchStatus(
    state,
    reportPathsType,
    reportType,
    queryString
  );
  return {
    queryString,
    report,
    reportFetchStatus,
  };
});

const mapDispatchToProps: TagModalDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const TagModal = translate()(
  connect(mapStateToProps, mapDispatchToProps)(TagModalBase)
);

export { TagModal };
