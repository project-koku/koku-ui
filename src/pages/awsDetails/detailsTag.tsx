import { css } from '@patternfly/react-styles';
import { getQuery } from 'api/awsQuery';
import { AwsReport, AwsReportType } from 'api/awsReports';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { awsReportsActions, awsReportsSelectors } from 'store/awsReports';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { getTestProps, testIds } from 'testIds';
import { ComputedAwsReportItem } from 'utils/getComputedAwsReportItems';
import { styles } from './detailsTag.styles';
import { DetailsTagModal } from './detailsTagModal';

interface DetailsTagOwnProps {
  account: string | number;
  groupBy: string;
  id?: string;
  item: ComputedAwsReportItem;
}

interface DetailsTagState {
  isDetailsModalOpen: boolean;
  showAll: boolean;
}

interface DetailsTagStateProps {
  queryString?: string;
  report?: AwsReport;
  reportFetchStatus?: FetchStatus;
}

interface DetailsTagDispatchProps {
  fetchReport?: typeof awsReportsActions.fetchReport;
}

type DetailsTagProps = DetailsTagOwnProps &
  DetailsTagStateProps &
  DetailsTagDispatchProps &
  InjectedTranslateProps;

class DetailsTagBase extends React.Component<DetailsTagProps> {
  protected defaultState: DetailsTagState = {
    isDetailsModalOpen: false,
    showAll: false,
  };
  public state: DetailsTagState = { ...this.defaultState };

  constructor(props: DetailsTagProps) {
    super(props);
    this.handleDetailsModalClose = this.handleDetailsModalClose.bind(this);
    this.handleDetailsModalOpen = this.handleDetailsModalOpen.bind(this);
  }

  public componentDidMount() {
    const { queryString, report } = this.props;
    if (!report) {
      this.props.fetchReport(AwsReportType.tag, queryString);
    }
  }

  public componentDidUpdate(prevProps: DetailsTagProps) {
    if (prevProps.queryString !== this.props.queryString) {
      this.props.fetchReport(AwsReportType.tag, this.props.queryString);
    }
  }

  public handleDetailsModalClose = (isOpen: boolean) => {
    this.setState({ isDetailsModalOpen: isOpen });
  };

  public handleDetailsModalOpen = event => {
    this.setState({ isDetailsModalOpen: true });
    event.preventDefault();
    return false;
  };

  public render() {
    const { account, groupBy, id, item, report, t } = this.props;
    const { isDetailsModalOpen, showAll } = this.state;

    let charCount = 0;
    const maxChars = 50;
    const someTags = [];
    const allTags = [];

    if (report) {
      for (const tag of report.data) {
        for (const val of tag.values) {
          const prefix = someTags.length > 0 ? ', ' : '';
          const tagString = `${prefix}${(tag as any).key}: ${val}`;
          charCount += tagString.length;
          allTags.push(`${(tag as any).key}: ${val}`);
          if (charCount <= maxChars || showAll) {
            someTags.push(tagString);
          }
        }
      }
    }

    return (
      <div className={css(styles.tagsContainer)} id={id}>
        {Boolean(someTags) &&
          someTags.map((tag, tagIndex) => <span key={tagIndex}>{tag}</span>)}
        {Boolean(someTags.length < allTags.length) && (
          <a
            {...getTestProps(testIds.details.tag_lnk)}
            href="#/"
            onClick={this.handleDetailsModalOpen}
          >
            {t('aws_details.more_tags', {
              value: allTags.length - someTags.length,
            })}
          </a>
        )}
        <DetailsTagModal
          account={account}
          groupBy={groupBy}
          isOpen={isDetailsModalOpen}
          item={item}
          onClose={this.handleDetailsModalClose}
        />
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  DetailsTagOwnProps,
  DetailsTagStateProps
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
    AwsReportType.tag,
    queryString
  );
  const reportFetchStatus = awsReportsSelectors.selectReportFetchStatus(
    state,
    AwsReportType.tag,
    queryString
  );
  return {
    account,
    queryString,
    report,
    reportFetchStatus,
  };
});

const mapDispatchToProps: DetailsTagDispatchProps = {
  fetchReport: awsReportsActions.fetchReport,
};

const DetailsTag = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DetailsTagBase)
);

export { DetailsTag, DetailsTagBase, DetailsTagProps };
