import { Popover } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { getQuery } from 'api/ocpQuery';
import { OcpReport, OcpReportType } from 'api/ocpReports';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { ocpReportsActions, ocpReportsSelectors } from 'store/ocpReports';
import { getTestProps, testIds } from '../../testIds';
import { popoverOverride, styles } from './detailsTag.styles';

interface DetailsTagOwnProps {
  id?: string;
  project: string | number;
  queryString?: string;
}

interface DetailsTagState {
  showAll: boolean;
}

interface DetailsTagStateProps {
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
    showAll: false,
  };
  public state: DetailsTagState = { ...this.defaultState };

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

  private handleMoreClicked = (event: React.FormEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    return false;
  };

  private getTagPopover(someTags: any[], allTags: any[]) {
    const { t } = this.props;

    if (someTags && allTags) {
      return (
        <Popover
          className={popoverOverride}
          headerContent={<div>{t('ocp_details.tags_label')}</div>}
          position="right"
          bodyContent={allTags.map((tag, tagIndex) => (
            <div key={tagIndex}>{tag}</div>
          ))}
          size="small"
        >
          <a
            {...getTestProps(testIds.details.tag_lnk)}
            href="#/"
            onClick={this.handleMoreClicked}
          >
            {t('ocp_details.more_tags', {
              value: allTags.length - someTags.length,
            })}
          </a>
        </Popover>
      );
    } else {
      return null;
    }
  }

  public render() {
    const { id, report } = this.props;
    const { showAll } = this.state;

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
        {Boolean(someTags.length < allTags.length) &&
          this.getTagPopover(someTags, allTags)}
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
