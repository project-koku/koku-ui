import { getQuery } from 'api/queries/azureQuery';
import { AzureReport } from 'api/reports/azureReports';
import { ReportType } from 'api/reports/report';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import {
  azureReportsActions,
  azureReportsSelectors,
} from 'store/reports/azureReports';
import { getTestProps, testIds } from 'testIds';
import { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import { styles } from './detailsTag.styles';
import { DetailsTagModal } from './detailsTagModal';

interface DetailsTagOwnProps {
  account: string | number;
  groupBy: string;
  id?: string;
  item: ComputedReportItem;
}

interface DetailsTagState {
  isOpen: boolean;
  showAll: boolean;
}

interface DetailsTagStateProps {
  queryString?: string;
  report?: AzureReport;
  reportFetchStatus?: FetchStatus;
}

interface DetailsTagDispatchProps {
  fetchReport?: typeof azureReportsActions.fetchReport;
}

type DetailsTagProps = DetailsTagOwnProps &
  DetailsTagStateProps &
  DetailsTagDispatchProps &
  InjectedTranslateProps;

const reportType = ReportType.tag;

class DetailsTagBase extends React.Component<DetailsTagProps> {
  protected defaultState: DetailsTagState = {
    isOpen: false,
    showAll: false,
  };
  public state: DetailsTagState = { ...this.defaultState };

  constructor(props: DetailsTagProps) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  public componentDidMount() {
    const { fetchReport, queryString } = this.props;
    fetchReport(reportType, queryString);
  }

  public componentDidUpdate(prevProps: DetailsTagProps) {
    const { fetchReport, queryString } = this.props;
    if (prevProps.queryString !== queryString) {
      fetchReport(reportType, queryString);
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
    const { account, groupBy, id, item, report, t } = this.props;
    const { isOpen, showAll } = this.state;

    let charCount = 0;
    const maxChars = 50;
    const someTags = [];
    const allTags = [];

    const addTag = (tag, val) => {
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
    };

    if (report) {
      for (const tag of report.data) {
        if (!Array.isArray(tag.values)) {
          addTag(tag, tag.values);
        } else {
          for (const val of tag.values) {
            addTag(tag, val);
          }
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
            {t('azure_details.more_tags', {
              value: allTags.length - someTags.length,
            })}
          </a>
        )}
        <DetailsTagModal
          account={account}
          groupBy={groupBy}
          isOpen={isOpen}
          item={item}
          onClose={this.handleClose}
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
    subscription_guid: account,
    queryString,
    report,
    reportFetchStatus,
  };
});

const mapDispatchToProps: DetailsTagDispatchProps = {
  fetchReport: azureReportsActions.fetchReport,
};

const DetailsTag = translate()(
  connect(mapStateToProps, mapDispatchToProps)(DetailsTagBase)
);

export { DetailsTag, DetailsTagProps };
