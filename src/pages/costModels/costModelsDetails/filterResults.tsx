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
    const { intl, onRemoveAll, onRemove, count, filterQuery } = this.props;
    const filters = Object.keys(filterQuery)
      .filter(k => ['name', 'type'].includes(k))
      .filter(k => filterQuery[k])
      .map(name => filterQuery[name].split(',').map(value => ({ name, value })))
      .reduce((acc, curr) => {
        return [...acc, ...curr];
      }, []);
    return (
      <React.Fragment>
        <ToolbarGroup>
          <ToolbarItem>
            <h5>
              {intl.formatMessage(
                { id: 'source_details.filter.results.count' },
                { count }
              )}
            </h5>
          </ToolbarItem>
        </ToolbarGroup>
        {filters.length > 0 && (
          <React.Fragment>
            <ToolbarGroup>
              <ToolbarItem>
                {intl.formatMessage({
                  id: 'source_details.filter.results.active',
                })}
              </ToolbarItem>
            </ToolbarGroup>
            <ToolbarGroup>
              <ToolbarItem>
                {filters.map((f, ix) => (
                  <Chip
                    style={{ paddingRight: '20px' }}
                    key={`${f.name}-${f.value}-${ix}`}
                    onClick={() => {
                      onRemove(f.name, f.value);
                    }}
                  >
                    {intl.formatMessage({
                      id: `source_details.filter.results.${f.name}`,
                    })}
                    : {f.value}
                  </Chip>
                ))}
              </ToolbarItem>
            </ToolbarGroup>
            <ToolbarGroup>
              <ToolbarItem>
                <Button onClick={onRemoveAll} variant="plain">
                  {intl.formatMessage({
                    id: 'source_details.filter.results.clear',
                  })}
                </Button>
              </ToolbarItem>
            </ToolbarGroup>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default injectIntl(FilterResultsBase);
