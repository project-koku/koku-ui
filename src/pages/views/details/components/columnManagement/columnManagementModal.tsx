import {
  Button,
  ButtonVariant,
  DataList,
  DataListCell,
  DataListCheck,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Modal,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';

export interface ColumnManagementModalOption {
  hidden?: boolean;
  label: string;
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

export interface ColumnManagementModalOwnProps extends WithTranslation {
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
  WithTranslation;

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

  private handleChange = (checked, event) => {
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
    const { options, t } = this.props;

    return (
      <Modal
        description={
          <TextContent>
            <Text component={TextVariants.p}>Selected categories will be displayed in the table.</Text>
            <Button isInline onClick={this.selectAll} variant="link">
              {t('details.column_management.select_all')}
            </Button>
          </TextContent>
        }
        // style={styles.modal}
        isOpen={this.props.isOpen}
        onClose={this.handleClose}
        title={t('details.column_management.title')}
        variant="small"
        actions={[
          <Button key="save" onClick={this.handleSave} variant={ButtonVariant.link}>
            {t('details.column_management.save')}
          </Button>,
          <Button key="cancel" onClick={this.handleClose} variant={ButtonVariant.link}>
            {t('details.column_management.cancel')}
          </Button>,
        ]}
      >
        <DataList aria-label={t('details.column_management.aria_label')} id="table-column-management" isCompact>
          {options.map(option => (
            <DataListItem aria-labelledby={option.value} key={option.value}>
              <DataListItemRow>
                <DataListCheck
                  aria-labelledby={option.value}
                  checked={!this.isHidden(option.value)}
                  name={option.value}
                  id={option.value}
                  onChange={this.handleChange}
                />
                <DataListItemCells
                  dataListCells={[
                    <DataListCell id="table-column-management-item1" key="table-column-management-item1">
                      <label htmlFor="check1">{t(option.label)}</label>
                    </DataListCell>,
                  ]}
                />
              </DataListItemRow>
            </DataListItem>
          ))}
        </DataList>
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
const ColumnManagementModal = withTranslation()(ColumnManagementModalConnect);

export { ColumnManagementModal, ColumnManagementModalProps };
