import { Dropdown, DropdownItem, KebabToggle } from '@patternfly/react-core';
import { ProviderType } from 'api/providers';
import { Query } from 'api/queries/query';
import { tagPrefix } from 'api/queries/query';
import { ReportPathsType } from 'api/reports/report';
import messages from 'locales/messages';
import { ExportModal } from 'pages/views/components/export/exportModal';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { createMapStateToProps } from 'store/common';
import { costModelsActions } from 'store/costModels';
import { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';

interface DetailsActionsOwnProps extends WrappedComponentProps, RouteComponentProps<void> {
  groupBy: string;
  isDisabled?: boolean;
  item: ComputedReportItem;
  providerType?: ProviderType;
  query: Query;
  reportPathsType: ReportPathsType;
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
    const { groupBy, item, query, reportPathsType } = this.props;
    const { isExportModalOpen } = this.state;

    return (
      <ExportModal
        count={1}
        groupBy={groupBy}
        isOpen={isExportModalOpen}
        items={[item]}
        onClose={this.handleExportModalClose}
        query={query}
        reportPathsType={reportPathsType}
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
      redirectToCostModel,
      history,
      item: { source_uuid },
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
          onClick={() => redirectToCostModel(source_uuid[0], history)}
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

export { Actions, DetailsActionsProps };
