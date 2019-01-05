import { Form, FormGroup } from '@patternfly/react-core';
import { OcpReport, OcpReportType } from 'api/ocpReports';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { ocpReportsActions, ocpReportsSelectors } from 'store/ocpReports';
import { getComputedOcpReportItems } from 'utils/getComputedOcpReportItems';

interface DetailsTagOwnProps {
  clusterLabel?: string;
  idKey: any;
  queryString: string;
  tagsLabel?: string;
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
  }

  public componentDidUpdate(prevProps: DetailsTagProps) {
    if (prevProps.queryString !== this.props.queryString) {
      this.props.fetchReport(OcpReportType.charge, this.props.queryString);
    }
  }

  private getItems() {
    const { report, idKey } = this.props;

    const computedItems = getComputedOcpReportItems({
      report,
      idKey,
    } as any);

    const otherIndex = computedItems.findIndex(i => i.id === 'Other');

    if (otherIndex !== -1) {
      return [
        ...computedItems.slice(0, otherIndex),
        ...computedItems.slice(otherIndex + 1),
        computedItems[otherIndex],
      ];
    }

    return computedItems;
  }

  public render() {
    const { clusterLabel, tagsLabel } = this.props;
    const items = this.getItems();
    const clusterName = items && items.length ? items[0].label : '';

    return (
      <Form isHorizontal>
        <FormGroup label={clusterLabel} fieldId="cluster-name">
          <span>{clusterName}</span>
        </FormGroup>
        <FormGroup label={tagsLabel} fieldId="tags-name">
          <span>n/a</span>
        </FormGroup>
      </Form>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  DetailsTagOwnProps,
  DetailsTagStateProps
>((state, { queryString }) => {
  const report = ocpReportsSelectors.selectReport(
    state,
    OcpReportType.charge,
    queryString
  );
  const reportFetchStatus = ocpReportsSelectors.selectReportFetchStatus(
    state,
    OcpReportType.charge,
    queryString
  );
  return {
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
