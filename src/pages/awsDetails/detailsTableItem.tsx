import {
  Button,
  ButtonType,
  ButtonVariant,
  Form,
  FormGroup,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { AwsQuery } from 'api/awsQuery';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { getTestProps, testIds } from 'testIds';
import {
  ComputedAwsReportItem,
  GetComputedAwsReportItemsParams,
} from 'utils/getComputedAwsReportItems';
import { DetailsChart } from './detailsChart';
import { styles } from './detailsTableItem.styles';
import { DetailsTag } from './detailsTag';
import { HistoricalModal } from './historicalModal';

interface DetailsTableItemOwnProps {
  groupBy: string;
  item: ComputedAwsReportItem;
}

interface DetailsTableItemState {
  isHistoricalModalOpen: boolean;
  localGroupBy?: string;
}

type DetailsTableItemProps = DetailsTableItemOwnProps & InjectedTranslateProps;

const groupByOptions: {
  label: string;
  value: GetComputedAwsReportItemsParams['idKey'];
}[] = [
  { label: 'account', value: 'account' },
  { label: 'service', value: 'service' },
  { label: 'region', value: 'region' },
];

class DetailsTableItemBase extends React.Component<DetailsTableItemProps> {
  public state: DetailsTableItemState = {
    isHistoricalModalOpen: false,
    localGroupBy: this.getDefaultGroupBy(),
  };

  constructor(props: DetailsTableItemProps) {
    super(props);
    this.handleHistoricalModalClose = this.handleHistoricalModalClose.bind(
      this
    );
    this.handleHistoricalModalOpen = this.handleHistoricalModalOpen.bind(this);
  }

  private getDefaultGroupBy() {
    const { groupBy } = this.props;
    let localGroupBy = '';

    switch (groupBy) {
      case 'account':
        localGroupBy = 'service';
        break;
      case 'service':
        localGroupBy = 'account';
        break;
      case 'region':
        localGroupBy = 'account';
        break;
    }
    return localGroupBy;
  }

  public handleHistoricalModalClose = (isOpen: boolean) => {
    this.setState({ isHistoricalModalOpen: isOpen });
  };

  public handleHistoricalModalOpen = () => {
    this.setState({ isHistoricalModalOpen: true });
  };

  public handleSelectChange = (event: React.FormEvent<HTMLSelectElement>) => {
    const groupByKey: keyof AwsQuery['group_by'] = event.currentTarget
      .value as any;
    this.setState({ localGroupBy: groupByKey });
  };

  public render() {
    const { item, groupBy, t } = this.props;
    const { isHistoricalModalOpen, localGroupBy } = this.state;

    return (
      <>
        <Grid>
          <GridItem md={12} lg={3}>
            <div className={css(styles.accountsContainer)}>
              {Boolean(groupBy === 'account') && (
                <Form>
                  <FormGroup label={t('aws_details.tags_label')} fieldId="tags">
                    <DetailsTag
                      account={item.label || item.id}
                      groupBy={groupBy}
                      id="tags"
                      item={item}
                    />
                  </FormGroup>
                </Form>
              )}
              {Boolean(groupBy === 'region' || groupBy === 'service') && (
                <div className={css(styles.summaryContainer)} />
              )}
            </div>
          </GridItem>
          <GridItem md={12} lg={6}>
            <div className={css(styles.measureChartContainer)}>
              <div className={css(styles.innerGroupBySelector)}>
                <label className={css(styles.innerGroupBySelectorLabel)}>
                  {t('group_by.cost')}:
                </label>
                <select
                  id={item.label ? item.label.toString() : ''}
                  onChange={this.handleSelectChange}
                >
                  {groupByOptions.map(option => {
                    if (option.value !== groupBy) {
                      return (
                        <option key={option.value} value={option.value}>
                          {t(`group_by.values.${option.label}`)}
                        </option>
                      );
                    }
                  })}
                </select>
              </div>
              <DetailsChart
                groupBy={groupBy}
                item={item}
                localGroupBy={localGroupBy}
              />
            </div>
          </GridItem>
          <GridItem md={12} lg={3}>
            <div className={css(styles.historicalLinkContainer)}>
              <Button
                {...getTestProps(testIds.details.historical_data_btn)}
                onClick={this.handleHistoricalModalOpen}
                type={ButtonType.button}
                variant={ButtonVariant.secondary}
              >
                {t('aws_details.historical.view_data')}
              </Button>
            </div>
          </GridItem>
        </Grid>
        <HistoricalModal
          groupBy={groupBy}
          isOpen={isHistoricalModalOpen}
          item={item}
          onClose={this.handleHistoricalModalClose}
        />
      </>
    );
  }
}

const DetailsTableItem = translate()(connect()(DetailsTableItemBase));

export { DetailsTableItem, DetailsTableItemBase, DetailsTableItemProps };
