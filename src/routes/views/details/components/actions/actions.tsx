import { Dropdown, DropdownItem, KebabToggle } from '@patternfly/react-core';
import type { ProviderType } from 'api/providers';
import { tagPrefix } from 'api/queries/query';
import type { ReportPathsType } from 'api/reports/report';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { ExportModal } from 'routes/views/components/export';
import { createMapStateToProps } from 'store/common';
import { costModelsActions } from 'store/costModels';
import type { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

interface DetailsActionsOwnProps extends WrappedComponentProps, RouterComponentProps {
  groupBy: string;
  isDisabled?: boolean;
  item: ComputedReportItem;
  providerType?: ProviderType;
  reportPathsType: ReportPathsType;
  reportQueryString: string;
  showPriceListOption?: boolean;
}

interface DetailsActionsStateProps {
  // TBD...
}

interface DetailsActionsDispatchProps {
  redirectToCostModel: typeof costModelsActions.redirectToCostModelFromSourceUuid;
}

interface DetailsActionsState {
  isDropdownOpen: boolean;
  isExportModalOpen: boolean;
}

type DetailsActionsProps = DetailsActionsOwnProps & DetailsActionsStateProps & DetailsActionsDispatchProps;

class DetailsActionsBase extends React.Component<DetailsActionsProps> {
  protected defaultState: DetailsActionsState = {
    isDropdownOpen: false,
    isExportModalOpen: false,
  };
  public state: DetailsActionsState = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
    this.handleExportModalClose = this.handleExportModalClose.bind(this);
    this.handleExportModalOpen = this.handleExportModalOpen.bind(this);
    this.handleOnToggle = this.handleOnToggle.bind(this);
    this.handleOnSelect = this.handleOnSelect.bind(this);
  }

  private getExportModal = () => {
    const { groupBy, item, reportPathsType, reportQueryString } = this.props;
    const { isExportModalOpen } = this.state;

    return (
      <ExportModal
        count={1}
        groupBy={groupBy}
        isOpen={isExportModalOpen}
        items={[item]}
        onClose={this.handleExportModalClose}
        reportPathsType={reportPathsType}
        reportQueryString={reportQueryString}
      />
    );
  };

  public handleExportModalClose = (isOpen: boolean) => {
    this.setState({ isExportModalOpen: isOpen });
  };

  public handleExportModalOpen = () => {
    this.setState({ isExportModalOpen: true });
  };

  public handleOnSelect = () => {
    const { isDropdownOpen } = this.state;
    this.setState({
      isDropdownOpen: !isDropdownOpen,
    });
  };

  public handleOnToggle = (isDropdownOpen: boolean) => {
    this.setState({ isDropdownOpen });
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
    const items = [
      <DropdownItem component="button" isDisabled={isDisabled} key="export-action" onClick={this.handleExportModalOpen}>
        {intl.formatMessage(messages.detailsActionsExport)}
      </DropdownItem>,
    ];

    if (showPriceListOption) {
      items.unshift(
        <DropdownItem
          component="button"
          key="price-list-action"
          isDisabled={isDisabled || groupBy.includes(tagPrefix) || source_uuid.length === 0}
          onClick={() => redirectToCostModel(source_uuid[0], router)}
        >
          {intl.formatMessage(messages.detailsActionsPriceList)}
        </DropdownItem>
      );
    }

    return (
      <>
        <Dropdown
          onSelect={this.handleOnSelect}
          toggle={<KebabToggle onToggle={this.handleOnToggle} />}
          isOpen={this.state.isDropdownOpen}
          isPlain
          position="right"
          dropdownItems={items}
        />
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
