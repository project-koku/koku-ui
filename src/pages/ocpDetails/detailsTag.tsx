import { css } from '@patternfly/react-styles';
import { getQuery } from 'api/ocpQuery';
import { OcpReport, OcpReportType } from 'api/ocpReports';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { ocpReportsActions, ocpReportsSelectors } from 'store/ocpReports';
import { ComputedOcpReportItem } from 'utils/getComputedOcpReportItems';
import { getTestProps, testIds } from '../../testIds';
import { styles } from './detailsTag.styles';
import { DetailsTagModal } from './detailsTagModal';

interface DetailsTagOwnProps {
  groupBy: string;
  id?: string;
  item: ComputedOcpReportItem;
  project: string | number;
}

interface DetailsTagState {
  isDetailsModalOpen: boolean;
  showAll: boolean;
}

interface DetailsTagStateProps {
  queryString?: string;
  report?: OcpReport;
  reportFetchStatus?: FetchStatus;
}

interface DetailsTagDispatchProps {
  fetchReport?: typeof ocpReportsActions.fetchReport;
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
      this.props.fetchReport(OcpReportType.tag, queryString);
    }
  }

  public componentDidUpdate(prevProps: DetailsTagProps) {
    if (prevProps.queryString !== this.props.queryString) {
      this.props.fetchReport(OcpReportType.tag, this.props.queryString);
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
    const { groupBy, id, item, project, report, t } = this.props;
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
            {t('ocp_details.more_tags', {
              value: allTags.length - someTags.length,
            })}
          </a>
        )}
        <DetailsTagModal
          groupBy={groupBy}
          isOpen={isDetailsModalOpen}
          item={item}
          onClose={this.handleDetailsModalClose}
          project={project}
        />
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  DetailsTagOwnProps,
  DetailsTagStateProps
>((state, { project }) => {
  const queryString = getQuery({
    filter: {
      project,
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: -1,
    },
  });
  const report = ocpReportsSelectors.selectReport(
    state,
    OcpReportType.tag,
    queryString
  );
  const reportFetchStatus = ocpReportsSelectors.selectReportFetchStatus(
    state,
    OcpReportType.tag,
    queryString
  );
  return {
    project,
    queryString,
    report,
    reportFetchStatus,
  };
});

const mapDispatchToProps: DetailsTagDispatchProps = {
  fetchReport: ocpReportsActions.fetchReport,
};

const DetailsTag = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DetailsTagBase)
);

export { DetailsTag, DetailsTagBase, DetailsTagProps };
