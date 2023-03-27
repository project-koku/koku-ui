import { Modal, ModalVariant } from '@patternfly/react-core';
import { getQuery, Query } from 'api/queries/query';
import { ReportPathsType } from 'api/reports/report';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { HistoricalChart } from './historicalChart';
import { modalOverride } from './historicalModal.styles';

interface HistoricalCloudModalOwnProps {
  chartComponent?: React.ReactElement<any>; // Override the default historical chart
  filterBy: string | number;
  groupBy: string;
  isOpen: boolean;
  onClose(isOpen: boolean);
  reportPathsType: ReportPathsType;
}

interface HistoricalCloudModalStateProps {
  currentQueryString: string;
  previousQueryString: string;
}

type HistoricalCloudModalProps = HistoricalCloudModalOwnProps &
  HistoricalCloudModalStateProps &
  InjectedTranslateProps;

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
    const { filterBy, isOpen } = this.props;
    return nextProps.filterBy !== filterBy || nextProps.isOpen !== isOpen;
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
    const { filterBy, groupBy, isOpen, t } = this.props;

    return (
      <Modal
        className={modalOverride}
        isOpen={isOpen}
        onClose={this.handleClose}
        title={t('details.historical.modal_title', {
          groupBy,
          name: filterBy,
        })}
        variant={ModalVariant.large}
      >
        {this.getChart()}
      </Modal>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  HistoricalCloudModalOwnProps,
  HistoricalCloudModalStateProps
>((state, { filterBy, groupBy }) => {
  const currentQuery: Query = {
    filter: {
      time_scope_units: 'month',
      time_scope_value: -1,
      resolution: 'daily',
      limit: 3,
    },
    group_by: {
      [groupBy]: filterBy,
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
      [groupBy]: filterBy,
    },
  };
  const previousQueryString = getQuery(previousQuery);
  return {
    currentQueryString,
    previousQueryString,
  };
});

const HistoricalModal = translate()(
  connect(mapStateToProps, {})(HistoricalCloudModalBase)
);

export { HistoricalModal };
