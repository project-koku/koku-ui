import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';

// import { styles } from './export.styles';

interface ExportContentOwnProps {
  // TBD...
}

interface ExportContentStateProps {
  // TBD...
}

interface ExportContentDispatchProps {
  // TBD...
}

type ExportContentProps = ExportContentOwnProps &
  ExportContentStateProps &
  ExportContentDispatchProps &
  WrappedComponentProps;

class ExportContentBase extends React.Component<ExportContentProps> {
  public render() {
    return <span>Hello</span>;
  }
}

const mapStateToProps = createMapStateToProps<ExportContentOwnProps, ExportContentStateProps>(() => {
  return {
    // TBD...
  };
});

const mapDispatchToProps: ExportContentDispatchProps = {
  // TBD...
};

const ExportContent = injectIntl(connect(mapStateToProps, mapDispatchToProps)(ExportContentBase));

export { ExportContent };
