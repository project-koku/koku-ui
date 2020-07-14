import { TagIcon } from '@patternfly/react-icons';
import {getQuery, parseQuery, Query} from 'api/queries/query';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { Report } from 'api/reports/report';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { getTestProps, testIds } from 'testIds';
import { styles } from './tag.styles';
import { TagModal } from './tagModal';

interface TagLinkOwnProps {
  filterBy: string | number;
  groupBy: string;
  id?: string;
  reportPathsType: ReportPathsType;
}

interface TagLinkState {
  isOpen: boolean;
}

interface TagLinkStateProps {
  queryString?: string;
  report?: Report;
  reportFetchStatus?: FetchStatus;
}

interface TagLinkDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

type TagLinkProps = TagLinkOwnProps &
  TagLinkStateProps &
  TagLinkDispatchProps &
  InjectedTranslateProps;

const reportType = ReportType.tag;

class TagLinkBase extends React.Component<TagLinkProps> {
  protected defaultState: TagLinkState = {
    isOpen: false,
  };
  public state: TagLinkState = { ...this.defaultState };

  constructor(props: TagLinkProps) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  public componentDidMount() {
    const { fetchReport, queryString, reportPathsType } = this.props;
    fetchReport(reportPathsType, reportType, queryString);
  }

  public componentDidUpdate(prevProps: TagLinkProps) {
    const { fetchReport, queryString, reportPathsType } = this.props;
    if (prevProps.queryString !== queryString) {
      fetchReport(reportPathsType, reportType, queryString);
    }
  }

  public handleClose = (isOpen: boolean) => {
    this.setState({ isOpen });
  };

  public handleOpen = event => {
    this.setState({ isOpen: true });
    event.preventDefault();
    return false;
  };

  public render() {
    const { filterBy, groupBy, id, report, reportPathsType } = this.props;
    const { isOpen } = this.state;

    const tagKeyValues = [];

    if (report) {
      for (const tag of report.data) {
        for (const val of tag.values) {
          tagKeyValues.push(`${(tag as any).key}: ${val}`);
        }
      }
    }

    return (
      <div style={styles.tagsContainer} id={id}>
        {Boolean(tagKeyValues.length) && (
          <>
            <TagIcon />
            <a
              {...getTestProps(testIds.details.tag_lnk)}
              href="#/"
              onClick={this.handleOpen}
              style={styles.tagLink}
            >
              {tagKeyValues.length}
            </a>
          </>
        )}
        <TagModal
          filterBy={filterBy}
          groupBy={groupBy}
          isOpen={isOpen}
          onClose={this.handleClose}
          reportPathsType={reportPathsType}
        />
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  TagLinkOwnProps,
  TagLinkStateProps
>((state, { filterBy, groupBy, reportPathsType }) => {
  const queryFromRoute = parseQuery<Query>(location.search);
  const queryString = getQuery({
    filter: {
      [groupBy]: filterBy,
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: -1,
      ...(queryFromRoute.filter.account && {account: queryFromRoute.filter.account})
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
    filterBy,
    queryString,
    report,
    reportFetchStatus,
  };
});

const mapDispatchToProps: TagLinkDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const TagLink = translate()(
  connect(mapStateToProps, mapDispatchToProps)(TagLinkBase)
);

export { TagLink, TagLinkProps };
