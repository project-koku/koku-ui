import {
  Button,
  Chip,
  PageHeaderToolsGroup,
  PageHeaderToolsItem,
} from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';

interface Props extends InjectedTranslateProps {
  onRemoveAll: () => void;
  onRemove: (name: string, value: string) => void;
  count: number;
  filterQuery: any;
}

class FilterResultsBase extends React.Component<Props> {
  public shouldComponentUpdate(nextProps) {
    if (nextProps.filterQuery.name !== this.props.filterQuery.name) {
      return true;
    }
    if (nextProps.filterQuery.type !== this.props.filterQuery.type) {
      return true;
    }
    if (nextProps.count !== this.props.count) {
      return true;
    }
    return false;
  }
  public render() {
    const { t, onRemoveAll, onRemove, count, filterQuery } = this.props;
    const filters = Object.keys(filterQuery)
      .filter(k => ['name', 'type'].includes(k))
      .filter(k => filterQuery[k])
      .map(name => filterQuery[name].split(',').map(value => ({ name, value })))
      .reduce((acc, curr) => {
        return [...acc, ...curr];
      }, []);
    return (
      <React.Fragment>
        <PageHeaderToolsGroup>
          <PageHeaderToolsItem>
            <h5>{t('source_details.filter.results.count', { count })}</h5>
          </PageHeaderToolsItem>
        </PageHeaderToolsGroup>
        {filters.length > 0 && (
          <React.Fragment>
            <PageHeaderToolsGroup>
              <PageHeaderToolsItem>
                {t('source_details.filter.results.active')}
              </PageHeaderToolsItem>
            </PageHeaderToolsGroup>
            <PageHeaderToolsGroup>
              <PageHeaderToolsItem>
                {filters.map((f, ix) => (
                  <Chip
                    style={{ paddingRight: '20px' }}
                    key={`${f.name}-${f.value}-${ix}`}
                    onClick={() => {
                      onRemove(f.name, f.value);
                    }}
                  >
                    {t(`source_details.filter.results.${f.name}`)}: {f.value}
                  </Chip>
                ))}
              </PageHeaderToolsItem>
            </PageHeaderToolsGroup>
            <PageHeaderToolsGroup>
              <PageHeaderToolsItem>
                <Button onClick={onRemoveAll} variant="plain">
                  {t('source_details.filter.results.clear')}
                </Button>
              </PageHeaderToolsItem>
            </PageHeaderToolsGroup>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default translate()(FilterResultsBase);
