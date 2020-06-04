import {
  PageHeaderTools,
  PageHeaderToolsGroup,
  PageHeaderToolsItem,
  ToolbarContent,
  ToolbarFilter,
  ToolbarItemVariant,
} from '@patternfly/react-core';
import React from 'react';

interface PriceListToolbarProps {
  primary: React.ReactNode;
  selected: string;
  secondaries: {
    component: React.ReactNode;
    name: string;
    onRemove: (category: string, chip: string) => void;
    filters: string[];
  }[];
  onClear: () => void;
  pagination: React.ReactNode;
  button: React.ReactNode;
}

export const PriceListToolbar: React.SFC<PriceListToolbarProps> = ({
  primary,
  secondaries,
  pagination,
  button,
  onClear,
  selected,
}) => {
  return (
    <PageHeaderTools
      clearAllFilters={onClear}
      id="price-list-toolbar"
      style={{ marginBottom: '10px', marginTop: '10px' }}
    >
      <ToolbarContent>
        <PageHeaderToolsGroup variant="filter-group">
          <PageHeaderToolsItem>{primary}</PageHeaderToolsItem>
          {secondaries.map(secondary => {
            return (
              <PageHeaderToolsItem key={secondary.name}>
                <ToolbarFilter
                  deleteChip={secondary.onRemove}
                  chips={secondary.filters}
                  categoryName={secondary.name}
                >
                  {selected === secondary.name ? secondary.component : ''}
                </ToolbarFilter>
              </PageHeaderToolsItem>
            );
          })}
        </PageHeaderToolsGroup>
        <PageHeaderToolsItem>{button}</PageHeaderToolsItem>
        <PageHeaderToolsItem variant={ToolbarItemVariant.pagination}>
          {pagination}
        </PageHeaderToolsItem>
      </ToolbarContent>
      <hr className="pf-c-divider" />
    </PageHeaderTools>
  );
};
