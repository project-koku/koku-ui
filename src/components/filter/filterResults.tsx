import {
  Button,
  Chip,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

interface Props extends WrappedComponentProps {
  onRemoveAll: () => void;
  onRemove: (filter: { name: string; value: string }) => void;
  count: number;
  query: { [k: string]: string };
}

class FilterResultsBase extends React.Component<Props> {
  public render() {
    const { intl, onRemoveAll, onRemove, count, query } = this.props;
    const filters = Object.keys(query)
      .filter(k => ['Name', 'Type'].includes(k))
      .filter(k => query[k])
      .map(name => query[name].split(',').map(value => ({ name, value })))
      .reduce((acc, curr) => {
        return [...acc, ...curr];
      }, []);
    return (
      <>
        <ToolbarGroup>
          <ToolbarItem>
            <h5>
              {intl.formatMessage({ id: 'filter.results_count' }, { count })}
            </h5>
          </ToolbarItem>
        </ToolbarGroup>
        {filters.length > 0 && (
          <>
            <ToolbarGroup>
              <ToolbarItem>
                {intl.formatMessage({ id: 'filter.active_filters' })}
              </ToolbarItem>
            </ToolbarGroup>
            <ToolbarGroup>
              <ToolbarItem>
                {filters.map((f, ix) => (
                  <Chip
                    style={{ paddingRight: '20px' }}
                    key={`${f.name}-${f.value}-${ix}`}
                    onClick={() => {
                      onRemove(f);
                    }}
                  >
                    {intl.formatMessage({ id: `filter.${f.name}` })}: {f.value}
                  </Chip>
                ))}
              </ToolbarItem>
            </ToolbarGroup>
            <ToolbarGroup>
              <ToolbarItem>
                <Button onClick={onRemoveAll} variant="plain">
                  {intl.formatMessage({ id: 'filter.results_clear' })}
                </Button>
              </ToolbarItem>
            </ToolbarGroup>
          </>
        )}
      </>
    );
  }
}

export default injectIntl(FilterResultsBase);
