import { Modal } from '@patternfly/react-core';
import { getQuery, Query } from 'api/queries/query';
import { ReportPathsType } from 'api/reports/report';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import { HistoricalChart } from './historicalChart';
import { modalOverride } from './historicalModal.styles';

interface HistoricalCloudModalOwnProps {
  chartComponent?: React.ReactElement<any>; // Override the default historical chart
  groupBy: string;
  isOpen: boolean;
  item: ComputedReportItem;
  onClose(isOpen: boolean);
  reportPathsType: ReportPathsType;
}

interface HistoricalCloudModalStateProps {
  currentQueryString: string;
  previousQueryString: string;
}

type HistoricalCloudModalProps = HistoricalCloudModalOwnProps &
  HistoricalCloudModalStateProps &
  WrappedComponentProps;

class HistoricalCloudModalBase extends React.Component<
  HistoricalCloudModalProps
> {
  constructor(props: HistoricalCloudModalProps) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  public componentDidMount() {
    this.setState({});
  }

  public shouldComponentUpdate(nextProps: HistoricalCloudModalProps) {
    const { isOpen, item } = this.props;
    return nextProps.item !== item || nextProps.isOpen !== isOpen;
  }

  private getChart = () => {
    const {
      chartComponent = <HistoricalChart />,
      currentQueryString,
      previousQueryString,
      reportPathsType,
    } = this.props;

    return React.cloneElement(chartComponent, {
      currentQueryString,
      previousQueryString,
      reportPathsType,
      ...chartComponent.props,
    });
  };

  private handleClose = () => {
    this.props.onClose(false);
  };

  public render() {
    const { groupBy, isOpen, item, intl } = this.props;

    return (
      <Modal
        className={modalOverride}
        isLarge
        isOpen={isOpen}
        onClose={this.handleClose}
        title={intl.formatMessage(
          { id: 'details.historical.modal_title' },
          {
            groupBy,
            name: item.label,
          }
        )}
      >
        {this.getChart()}
      </Modal>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  HistoricalCloudModalOwnProps,
  HistoricalCloudModalStateProps
>((state, { groupBy, item }) => {
  const currentQuery: Query = {
    filter: {
      time_scope_units: 'month',
      time_scope_value: -1,
      resolution: 'daily',
      limit: 3,
    },
    group_by: {
      [groupBy]: item.label || item.id,
    },
  };
  const currentQueryString = getQuery(currentQuery);
  const previousQuery: Query = {
    filter: {
      time_scope_units: 'month',
      time_scope_value: -2,
      resolution: 'daily',
      limit: 3,
    },
    group_by: {
      [groupBy]: item.label || item.id,
    },
  };
  const previousQueryString = getQuery(previousQuery);
  return {
    currentQueryString,
    previousQueryString,
  };
});

const HistoricalModal = injectIntl(
  connect(mapStateToProps, {})(HistoricalCloudModalBase)
);

export { HistoricalModal };
