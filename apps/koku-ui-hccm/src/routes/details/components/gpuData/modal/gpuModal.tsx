import { Modal, ModalBody, ModalHeader } from '@patternfly/react-core';
import type { ReportPathsType, ReportType } from 'api/reports/report';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import { GpuContent } from './gpuContent';

interface GpuModalOwnProps {
  isOpen: boolean;
  onClose(isOpen: boolean);
  reportPathsType: ReportPathsType;
  reportType: ReportType;
  title?: string;
}

type GpuModalProps = GpuModalOwnProps & WrappedComponentProps;

class GpuModalBase extends React.Component<GpuModalProps, any> {
  constructor(props: GpuModalProps) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  public shouldComponentUpdate(nextProps: GpuModalProps) {
    const { isOpen } = this.props;
    return nextProps.isOpen !== isOpen;
  }

  private handleClose = () => {
    this.props.onClose(false);
  };

  public render() {
    const { isOpen, reportPathsType, reportType, title } = this.props;

    return (
      <Modal isOpen={isOpen} onClose={this.handleClose} width={'50%'}>
        <ModalHeader title={title} />
        <ModalBody>
          <GpuContent reportPathsType={reportPathsType} reportType={reportType} />
        </ModalBody>
      </Modal>
    );
  }
}

const GpuModal = injectIntl(GpuModalBase);

export { GpuModal };
