import messages from '@koku-ui/i18n/locales/messages';
import {
  Button,
  ButtonVariant,
  Content,
  ContentVariants,
  DataList,
  DataListCell,
  DataListCheck,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
} from '@patternfly/react-core';
import React from 'react';
import type { MessageDescriptor, WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { createMapStateToProps } from '../../../../store/common';

export interface ColumnManagementModalOption {
  description?: MessageDescriptor;
  hidden?: boolean;
  label: MessageDescriptor;
  value: string;
}

export const initHiddenColumns = (options: ColumnManagementModalOption[]): Set<string> => {
  const hiddenColumns: Set<string> = new Set();

  options.map(option => {
    if (option.hidden) {
      hiddenColumns.add(option.value);
    }
  });
  return hiddenColumns;
};

export interface ColumnManagementModalOwnProps extends WrappedComponentProps {
  isOpen: boolean;
  options: ColumnManagementModalOption[];
  onClose(isOpen: boolean);
  onSave(hidden: Set<string>);
}

interface ColumnManagementModalStateProps {
  // TBD...
}

interface ColumnManagementModalDispatchProps {
  // TBD...
}

interface ColumnManagementModalState {
  hiddenColumns: Set<string>;
}

type ColumnManagementModalProps = ColumnManagementModalOwnProps &
  ColumnManagementModalDispatchProps &
  ColumnManagementModalStateProps &
  WrappedComponentProps;

export class ColumnManagementModalBase extends React.Component<ColumnManagementModalProps, ColumnManagementModalState> {
  protected defaultState: ColumnManagementModalState = {
    hiddenColumns: initHiddenColumns(this.props.options),
  };
  public state: ColumnManagementModalState = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
  }

  public componentDidUpdate(prevProps: ColumnManagementModalProps) {
    const { options } = this.props;

    if (prevProps.options !== options) {
      const hiddenColumns = initHiddenColumns(options);
      this.setState({ hiddenColumns });
    }
  }

  private getHidden = (value: string) => {
    const { hiddenColumns } = this.state;

    const result = new Set(hiddenColumns);
    if (!result.delete(value)) {
      result.add(value);
    }
    return result;
  };

  private isHidden = (value: string) => {
    const { hiddenColumns } = this.state;

    return hiddenColumns.has(value);
  };

  private handleChange = event => {
    const hiddenColumns = this.getHidden(event.target.id);
    this.setState({ hiddenColumns });
  };

  private handleClose = () => {
    // Reset defult state upon close
    this.setState({ ...this.defaultState }, () => {
      this.props.onClose(false);
    });
  };

  private handleSave = () => {
    const { hiddenColumns } = this.state;

    this.props.onSave(hiddenColumns);
    this.handleClose();
  };

  private selectAll = () => {
    this.setState({ hiddenColumns: new Set() });
  };

  public render() {
    const { options, intl } = this.props;

    return (
      <Modal isOpen={this.props.isOpen} onClose={this.handleClose} variant={ModalVariant.medium}>
        <ModalHeader
          description={
            <Content>
              <Content component={ContentVariants.p}>{intl.formatMessage(messages.manageColumnsDesc)}</Content>
              <Button isInline onClick={this.selectAll} variant="link">
                {intl.formatMessage(messages.selectAll)}
              </Button>
            </Content>
          }
          title={intl.formatMessage(messages.manageColumnsTitle)}
        />
        <ModalBody>
          <DataList
            aria-label={intl.formatMessage(messages.manageColumnsAriaLabel)}
            id="table-column-management"
            isCompact
          >
            {options.map(option => (
              <DataListItem aria-labelledby={option.value} key={option.value}>
                <DataListItemRow>
                  <DataListCheck
                    aria-labelledby={`${option.value}Label`}
                    isChecked={!this.isHidden(option.value)}
                    name={option.value}
                    id={option.value}
                    onChange={this.handleChange}
                  />
                  <DataListItemCells
                    dataListCells={[
                      <DataListCell id={`${option.value}Label`} key="table-column-management-item1">
                        <span>{intl.formatMessage(option.label)}</span>
                      </DataListCell>,
                      <DataListCell key="table-column-management-item2">
                        {option.description && <span>{intl.formatMessage(option.description)}</span>}
                      </DataListCell>,
                    ]}
                  />
                </DataListItemRow>
              </DataListItem>
            ))}
          </DataList>
        </ModalBody>
        <ModalFooter>
          <Button key="save" onClick={this.handleSave} variant={ButtonVariant.link}>
            {intl.formatMessage(messages.save)}
          </Button>
          <Button key="cancel" onClick={this.handleClose} variant={ButtonVariant.link}>
            {intl.formatMessage(messages.cancel)}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = createMapStateToProps<ColumnManagementModalOwnProps, unknown>(() => {
  return {};
});

const mapDispatchToProps: ColumnManagementModalDispatchProps = {
  // TBD...
};

const ColumnManagementModalConnect = connect(mapStateToProps, mapDispatchToProps)(ColumnManagementModalBase);
const ColumnManagementModal = injectIntl(ColumnManagementModalConnect);

export default ColumnManagementModal;
