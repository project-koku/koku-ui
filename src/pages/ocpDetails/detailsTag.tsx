import {
  Button,
  ButtonType,
  ButtonVariant,
  FormGroup,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { getQuery } from 'api/ocpQuery';
import { OcpReport, OcpReportType } from 'api/ocpReports';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { ocpReportsActions, ocpReportsSelectors } from 'store/ocpReports';
import { getTestProps, testIds } from '../../testIds';
import { styles } from './ocpDetails.styles';

interface DetailsTagOwnProps {
  label?: string;
  onTagClicked(key: string, value: string);
  project: string | number;
  queryString?: string;
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
  public componentDidMount() {
    const { queryString, report } = this.props;
    if (!report) {
      this.props.fetchReport(OcpReportType.charge, queryString);
    }
    if (!report) {
      this.props.fetchReport(OcpReportType.tag, queryString);
    }
  }

  public componentDidUpdate(prevProps: DetailsTagProps) {
    if (prevProps.queryString !== this.props.queryString) {
      this.props.fetchReport(OcpReportType.tag, this.props.queryString);
    }
  }

  public handleTagClicked = (key: string, value: string) => {
    const { onTagClicked } = this.props;
    onTagClicked(key, value);
  };

  private getTags(): any[] {
    const { report } = this.props;
    return report ? report.data : undefined;
  }

  public render() {
    const { label } = this.props;
    const tags = this.getTags();

    return (
      <FormGroup label={label} fieldId="tags">
        {Boolean(tags) &&
          tags.map((tag, tagIndex) =>
            tag.values.map((val, valIndex) => (
              <div className={css(styles.tagButton)} key={valIndex}>
                <Button
                  {...getTestProps(testIds.details.tag_btn)}
                  onClick={() => this.handleTagClicked(tag.key, val)}
                  type={ButtonType.button}
                  variant={ButtonVariant.secondary}
                >
                  {`${tag.key}: ${val}`}
                </Button>
              </div>
            ))
          )}
      </FormGroup>
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
