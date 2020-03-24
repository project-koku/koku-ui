import { getQuery } from 'api/queries/query';
import { Report } from 'api/reports/report';
import { ReportPathsType, ReportType } from 'api/reports/report';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { getTestProps, testIds } from 'testIds';
import { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import { styles } from './tag.styles';
import { TagModal } from './tagModal';

interface TagOwnProps {
  account: string | number;
  groupBy: string;
  id?: string;
  item: ComputedReportItem;
  reportPathsType: ReportPathsType;
}

interface TagState {
  isOpen: boolean;
  showAll: boolean;
}

interface TagStateProps {
  queryString?: string;
  report?: Report;
  reportFetchStatus?: FetchStatus;
}

interface TagDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

type TagProps = TagOwnProps &
  TagStateProps &
  TagDispatchProps &
  InjectedTranslateProps;

const reportType = ReportType.tag;

class TagBase extends React.Component<TagProps> {
  protected defaultState: TagState = {
    isOpen: false,
    showAll: false,
  };
  public state: TagState = { ...this.defaultState };

  constructor(props: TagProps) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  public componentDidMount() {
    const { fetchReport, queryString, reportPathsType } = this.props;
    fetchReport(reportPathsType, reportType, queryString);
  }

  public componentDidUpdate(prevProps: TagProps) {
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
    const {
      account,
      groupBy,
      id,
      item,
      report,
      reportPathsType,
      t,
    } = this.props;
    const { isOpen, showAll } = this.state;

    let charCount = 0;
    const maxChars = 50;
    const someTags = [];
    const allTags = [];

    if (report) {
      for (const tag of report.data) {
        for (const val of tag.values) {
          const prefix = someTags.length > 0 ? ', ' : '';
          const tagString = `${prefix}${(tag as any).key}: ${val}`;
          if (showAll) {
            someTags.push(tagString);
          } else if (charCount <= maxChars) {
            if (charCount + tagString.length > maxChars) {
              someTags.push(
                tagString
                  .slice(0, maxChars - charCount)
                  .trim()
                  .concat('...')
              );
            } else {
              someTags.push(tagString);
            }
          }
          charCount += tagString.length;
          allTags.push(`${(tag as any).key}: ${val}`);
        }
      }
    }

    return (
      <div style={styles.tagsContainer} id={id}>
        {Boolean(someTags) &&
          someTags.map((tag, tagIndex) => <span key={tagIndex}>{tag}</span>)}
        {Boolean(someTags.length < allTags.length) && (
          <a
            {...getTestProps(testIds.details.tag_lnk)}
            href="#/"
            onClick={this.handleOpen}
          >
            {t('aws_details.more_tags', {
              value: allTags.length - someTags.length,
            })}
          </a>
        )}
        <TagModal
          account={account}
          groupBy={groupBy}
          isOpen={isOpen}
          item={item}
          onClose={this.handleClose}
          reportPathsType={reportPathsType}
        />
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<TagOwnProps, TagStateProps>(
  (state, { account }) => {
    const queryString = getQuery({
      filter: {
        account,
        resolution: 'monthly',
        time_scope_units: 'month',
        time_scope_value: -1,
      },
    });
    const report = reportSelectors.selectReport(state, reportType, queryString);
    const reportFetchStatus = reportSelectors.selectReportFetchStatus(
      state,
      reportType,
      queryString
    );
    return {
      account,
      queryString,
      report,
      reportFetchStatus,
    };
  }
);

const mapDispatchToProps: TagDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const Tag = translate()(connect(mapStateToProps, mapDispatchToProps)(TagBase));

export { Tag, TagProps };
