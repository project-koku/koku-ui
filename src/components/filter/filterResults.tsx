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
  onRemove: (filter: { name: string; value: string }) => void;
  count: number;
  query: { [k: string]: string };
}

class FilterResultsBase extends React.Component<Props> {
  public render() {
    const { t, onRemoveAll, onRemove, count, query } = this.props;
    const filters = Object.keys(query)
      .filter(k => ['Name', 'Type'].includes(k))
      .filter(k => query[k])
      .map(name => query[name].split(',').map(value => ({ name, value })))
      .reduce((acc, curr) => {
        return [...acc, ...curr];
      }, []);
    return (
      <>
        <PageHeaderToolsGroup>
          <PageHeaderToolsItem>
            <h5>{t('filter.results_count', { count })}</h5>
          </PageHeaderToolsItem>
        </PageHeaderToolsGroup>
        {filters.length > 0 && (
          <>
            <PageHeaderToolsGroup>
              <PageHeaderToolsItem>
                {t('filter.active_filters')}
              </PageHeaderToolsItem>
            </PageHeaderToolsGroup>
            <PageHeaderToolsGroup>
              <PageHeaderToolsItem>
                {filters.map((f, ix) => (
                  <Chip
                    style={{ paddingRight: '20px' }}
                    key={`${f.name}-${f.value}-${ix}`}
                    onClick={() => {
                      onRemove(f);
                    }}
                  >
                    {t(`filter.${f.name}`)}: {f.value}
                  </Chip>
                ))}
              </PageHeaderToolsItem>
            </PageHeaderToolsGroup>
            <PageHeaderToolsGroup>
              <PageHeaderToolsItem>
                <Button onClick={onRemoveAll} variant="plain">
                  {t('filter.results_clear')}
                </Button>
              </PageHeaderToolsItem>
            </PageHeaderToolsGroup>
          </>
        )}
      </>
    );
  }
}

export default translate()(FilterResultsBase);
