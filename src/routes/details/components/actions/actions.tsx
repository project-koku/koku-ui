import type { ReportPathsType, ReportType } from 'api/reports/report';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import type { DropdownWrapperItem } from 'routes/components/dropdownWrapper';
import { DropdownWrapper } from 'routes/components/dropdownWrapper';
import { ExportModal } from 'routes/components/export';
import type { ComputedReportItem } from 'routes/utils/computedReport/getComputedReportItems';
import { createMapStateToProps } from 'store/common';
import { costModelsActions } from 'store/costModels';
import { tagPrefix } from 'utils/props';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

interface DetailsActionsOwnProps extends WrappedComponentProps, RouterComponentProps {
  groupBy?: string;
  isDisabled?: boolean;
  isTimeScoped?: boolean;
  item: ComputedReportItem;
  reportPathsType: ReportPathsType;
  reportQueryString: string;
  reportType: ReportType;
  showAggregateType?: boolean;
  showPriceListOption?: boolean;
  timeScopeValue?: number;
}

interface DetailsActionsStateProps {
  // TBD...
}

interface DetailsActionsDispatchProps {
  redirectToCostModel: typeof costModelsActions.redirectToCostModelFromSourceUuid;
}

interface DetailsActionsState {
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
  return {};
});

const mapDispatchToProps: DetailsActionsDispatchProps = {
  redirectToCostModel: costModelsActions.redirectToCostModelFromSourceUuid,
};

const DetailsActionsConnect = connect(mapStateToProps, mapDispatchToProps)(DetailsActionsBase);
const Actions = injectIntl(withRouter(DetailsActionsConnect));

export default Actions;
