import type { ReportPathsType, ReportType } from '@koku-ui/api/reports/report';
import messages from '@koku-ui/i18n/locales/messages';
import type { AxiosError } from 'axios';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { createMapStateToProps, FetchStatus } from '../../../../store/common';
import { costModelsActions, costModelsSelectors } from '../../../../store/costModels';
import { uiActions } from '../../../../store/ui';
import type { Notification, NotificationComponentProps } from '../../../../utils/notification';
import { withNotification } from '../../../../utils/notification';
import { tagPrefix } from '../../../../utils/props';
import type { RouterComponentProps } from '../../../../utils/router';
import { withRouter } from '../../../../utils/router';
import type { DropdownWrapperItem } from '../../../components/dropdownWrapper';
import { DropdownWrapper } from '../../../components/dropdownWrapper';
import { ExportModal } from '../../../components/export';
import type { ComputedReportItem } from '../../../utils/computedReport/getComputedReportItems';

interface DetailsActionsOwnProps extends NotificationComponentProps, RouterComponentProps, WrappedComponentProps {
  groupBy?: string;
  isDisabled?: boolean;
  isTimeScoped?: boolean;
  item: ComputedReportItem;
  reportPathsType: ReportPathsType;
  reportQueryString: string;
  reportType: ReportType;
  showAggregateType?: boolean;
  showPriceListOption?: boolean;
  showRedirectNotification?: boolean; // Only one Action component should add notifications
  timeScopeValue?: number;
}

interface DetailsActionsStateProps {
  redirectError: AxiosError;
  redirectNotification?: Notification;
  redirectStatus: FetchStatus;
}

interface DetailsActionsDispatchProps {
  redirectToCostModel: typeof costModelsActions.redirectToCostModelFromSourceUuid;
  resetState: typeof uiActions.resetState;
}

interface DetailsActionsState {
  currentNotification?: Notification;
  isExportModalOpen?: boolean;
}

type DetailsActionsProps = DetailsActionsOwnProps & DetailsActionsStateProps & DetailsActionsDispatchProps;

class DetailsActionsBase extends React.Component<DetailsActionsProps, DetailsActionsState> {
  protected defaultState: DetailsActionsState = {
    isExportModalOpen: false,
  };
  public state: DetailsActionsState = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
    this.handleExportModalClose = this.handleExportModalClose.bind(this);
    this.handleExportModalOpen = this.handleExportModalOpen.bind(this);
  }

  public componentDidUpdate(prevProps: DetailsActionsProps) {
    const { notification, redirectError, redirectNotification, redirectStatus, showRedirectNotification } = this.props;

    if (
      showRedirectNotification &&
      redirectNotification &&
      redirectNotification !== null &&
      redirectError &&
      redirectError !== null &&
      redirectError !== prevProps.redirectError &&
      redirectStatus !== prevProps.redirectStatus &&
      redirectStatus === FetchStatus.complete
    ) {
      notification.addNotification(redirectNotification);
    }
  }

  private getExportModal = () => {
    const {
      groupBy,
      isTimeScoped,
      item,
      timeScopeValue,
      reportPathsType,
      reportQueryString,
      reportType,
      showAggregateType,
    } = this.props;
    const { isExportModalOpen } = this.state;

    return (
      <ExportModal
        count={1}
        groupBy={groupBy}
        isOpen={isExportModalOpen}
        isTimeScoped={isTimeScoped}
        items={[item]}
        onClose={this.handleExportModalClose}
        reportPathsType={reportPathsType}
        reportQueryString={reportQueryString}
        reportType={reportType}
        showAggregateType={showAggregateType}
        timeScopeValue={timeScopeValue}
      />
    );
  };

  public handleExportModalClose = (isOpen: boolean) => {
    this.setState({ isExportModalOpen: isOpen });
  };

  public handleExportModalOpen = () => {
    this.setState({ isExportModalOpen: true });
  };

  public render() {
    const {
      groupBy,
      isDisabled,
      showPriceListOption,
      intl,
      item: { source_uuid },
      redirectToCostModel,
      router,
    } = this.props;

    // tslint:disable:jsx-wrap-multiline
    const items: DropdownWrapperItem[] = [
      {
        isDisabled,
        onClick: this.handleExportModalOpen,
        toString: () => intl.formatMessage(messages.detailsActionsExport),
      },
    ];

    if (showPriceListOption) {
      items.unshift({
        isDisabled: isDisabled || groupBy?.includes(tagPrefix) || source_uuid.length === 0,
        onClick: () => redirectToCostModel(source_uuid[0], router),
        toString: () => intl.formatMessage(messages.detailsActionsPriceList),
      });
    }

    return (
      <>
        <DropdownWrapper isKebab items={items} position="right" />
        {this.getExportModal()}
      </>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<DetailsActionsOwnProps, DetailsActionsStateProps>((state, props) => {
  return {
    redirectError: costModelsSelectors.redirectError(state),
    redirectNotification: costModelsSelectors.redirectNotification(state),
    redirectStatus: costModelsSelectors.redirectStatus(state),
  };
});

const mapDispatchToProps: DetailsActionsDispatchProps = {
  redirectToCostModel: costModelsActions.redirectToCostModelFromSourceUuid,
  resetState: uiActions.resetState,
};

const DetailsActionsConnect = connect(mapStateToProps, mapDispatchToProps)(DetailsActionsBase);
const Actions = injectIntl(withNotification(withRouter(DetailsActionsConnect)));

export default Actions;
