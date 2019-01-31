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
  groupBy: string;
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
      currentQueryString,
      groupBy,
      isOpen,
      previousQueryString,
      title,
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
          currentQueryString={currentQueryString}
          groupBy={groupBy}
          previousQueryString={previousQueryString}
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
