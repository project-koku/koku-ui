import { AccountSettingsType } from '@koku-ui/api/accountSettings';
import messages from '@koku-ui/i18n/locales/messages';
import { Card, CardBody, Title, TitleSizes, Tooltip } from '@patternfly/react-core';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';

import type { RootState } from '../../../store';
import { accountSettingsActions } from '../../../store/accountSettings';
import { getAccountCostType, getAccountCurrency } from '../../../utils/sessionStorage';
import { CostType } from '../../components/costType';
import { Currency } from '../../components/currency';
import { useAccountSettingsUpdate } from '../utils/hooks';
import { styles } from './calculations.styles';

interface CalculationsPropsOwnProps {
  canWrite?: boolean;
}

export interface CalculationsStateProps {
  // TBD...
}

type CalculationsProps = CalculationsPropsOwnProps;

const Calculations: React.FC<CalculationsProps> = ({ canWrite }) => {
  const [costType, setCostType] = useState(getAccountCostType());
  const [currency, setCurrency] = useState(getAccountCurrency());

  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  useMapToProps(setCostType, setCurrency);

  const getCostType = () => {
    return (
      <div style={styles.costTypeContainer}>
        <Title headingLevel="h2" style={styles.title} size={TitleSizes.md}>
          {intl.formatMessage(messages.costTypeSettingsLabel)}
        </Title>
        {intl.formatMessage(messages.costTypeSettingsDesc)}
        <div style={styles.costType}>
          {getTooltip(
            <CostType
              costType={costType}
              isDisabled={!canWrite}
              isSessionStorage={false}
              onSelect={handleOnCostTypeSelected}
              showLabel={false}
            />
          )}
        </div>
      </div>
    );
  };

  const getCurrency = () => {
    return (
      <>
        <Title headingLevel="h2" style={styles.title} size={TitleSizes.md}>
          {intl.formatMessage(messages.currency)}
        </Title>
        {intl.formatMessage(messages.currencyDesc)}
        <div style={styles.currency}>
          {getTooltip(
            <Currency
              currency={currency}
              isDisabled={!canWrite}
              isSessionStorage={false}
              onSelect={handleOnCurrencySelected}
              showLabel={false}
            />
          )}
        </div>
      </>
    );
  };

  const getTooltip = comp => {
    return !canWrite ? <Tooltip content={intl.formatMessage(messages.readOnlyPermissions)}>{comp}</Tooltip> : comp;
  };

  const handleOnCostTypeSelected = value => {
    dispatch(
      accountSettingsActions.updateAccountSettings(AccountSettingsType.costType, {
        cost_type: value,
      })
    );
  };

  const handleOnCurrencySelected = value => {
    dispatch(
      accountSettingsActions.updateAccountSettings(AccountSettingsType.currency, {
        currency: value,
      })
    );
  };

  return (
    <Card>
      <CardBody>
        {getCurrency()}
        {getCostType()}
      </CardBody>
    </Card>
  );
};

const useMapToProps = (setCostType, setCurrency): CalculationsStateProps => {
  useAccountSettingsUpdate({
    getSessionValue: getAccountCostType,
    type: AccountSettingsType.costType,
    setState: setCostType,
  });

  useAccountSettingsUpdate({
    getSessionValue: getAccountCurrency,
    type: AccountSettingsType.currency,
    setState: setCurrency,
  });

  return {
    // TBD...
  };
};

export default Calculations;
