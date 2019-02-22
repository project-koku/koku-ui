import {
  Button,
  ButtonType,
  ButtonVariant,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { uiActions } from 'store/ui';
import { getTestProps, testIds } from '../../../testIds';
import { EmptyState } from '../emptyState/emptyState';

type NoProvidersStateOwnProps = InjectedTranslateProps;

interface NoProvidersStateDispatchProps {
  openProvidersModal: typeof uiActions.openProvidersModal;
}

type NoProvidersStateProps = NoProvidersStateOwnProps &
  NoProvidersStateDispatchProps;

class NoProvidersStateBase extends React.Component<NoProvidersStateProps> {
  private getAddSourceButton = () => {
    const { openProvidersModal, t } = this.props;

    return (
      <Button
        {...getTestProps(testIds.providers.add_btn)}
        onClick={openProvidersModal}
        type={ButtonType.submit}
        variant={ButtonVariant.secondary}
      >
        {t('providers.add_source')}
      </Button>
    );
  };

  public render() {
    const { t } = this.props;

    return (
      <Grid gutter="lg">
        <GridItem>
          <EmptyState
            isDollarSignIcon
            primaryAction={this.getAddSourceButton()}
            title={t('providers.empty_state_title')}
            subTitle={t('providers.empty_state_desc')}
          />
        </GridItem>
      </Grid>
    );
  }
}

const mapStateToProps = createMapStateToProps<NoProvidersStateOwnProps, {}>(
  (state, {}) => {
    return {};
  }
);

const NoProvidersState = translate()(
  connect(
    mapStateToProps,
    {
      openProvidersModal: uiActions.openProvidersModal,
    }
  )(NoProvidersStateBase)
);

export { NoProvidersState };
