import { Modal } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { ocpDashboardSelectors } from 'store/ocpDashboard';
import { HistoricalChart } from './historicalChart';
import { modalOverride, styles } from './historicalModal.styles';

interface HistoricalModalOwnProps {
  chargeTitle?: string;
  cpuTitle?: string;
  currentQueryString: string;
  memoryTitle?: string;
  isOpen: boolean;
  onClose(isOpen: boolean);
  previousQueryString: string;
  title?: string;
}

interface HistoricalModalStateProps {
  widgets: number[];
}

type HistoricalModalProps = HistoricalModalOwnProps &
  HistoricalModalStateProps &
  InjectedTranslateProps;

class HistoricalModalBase extends React.Component<HistoricalModalProps> {
  private handleClose = () => {
    this.props.onClose(false);
  };

  public render() {
    const {
      chargeTitle,
      cpuTitle,
      currentQueryString,
      memoryTitle,
      isOpen,
      previousQueryString,
      title,
      t,
    } = this.props;

    return (
      <Modal
        className={`${modalOverride} ${css(styles.modal)}`}
        isLarge
        isOpen={isOpen}
        onClose={this.handleClose}
        title={title}
      >
        <HistoricalChart
          chargeTitle={chargeTitle}
          cpuTitle={cpuTitle}
          currentQueryString={currentQueryString}
          memoryTitle={memoryTitle}
          previousQueryString={previousQueryString}
          xAxisChargeLabel={t('ocp_details.historical.day_of_month_label')}
          xAxisCpuLabel={t('ocp_details.historical.day_of_month_label')}
          xAxisMemoryLabel={t('ocp_details.historical.day_of_month_label')}
          yAxisChargeLabel={t('ocp_details.historical.charge_label')}
          yAxisCpuLabel={t('ocp_details.historical.cpu_label')}
          yAxisMemoryLabel={t('ocp_details.historical.memory_label')}
        />
      </Modal>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  HistoricalModalOwnProps,
  HistoricalModalStateProps
>(state => {
  return {
    widgets: ocpDashboardSelectors.selectCurrentWidgets(state),
  };
});

const HistoricalModal = translate()(
  connect(
    mapStateToProps,
    {}
  )(HistoricalModalBase)
);

export { HistoricalModal };
