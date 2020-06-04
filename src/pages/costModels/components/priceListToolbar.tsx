import {
  Toolbar,
  ToolbarContent,
  ToolbarFilter,
  ToolbarGroup,
  ToolbarItem,
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
    <Toolbar
      clearAllFilters={onClear}
      id="price-list-toolbar"
      style={{ marginBottom: '10px', marginTop: '10px' }}
    >
      <ToolbarContent>
        <ToolbarGroup variant="filter-group">
          <ToolbarItem>{primary}</ToolbarItem>
          {secondaries.map(secondary => {
            return (
              <ToolbarItem key={secondary.name}>
                <ToolbarFilter
                  deleteChip={secondary.onRemove}
                  chips={secondary.filters}
                  categoryName={secondary.name}
                >
                  {selected === secondary.name ? secondary.component : ''}
                </ToolbarFilter>
              </ToolbarItem>
            );
          })}
        </ToolbarGroup>
        <ToolbarItem>{button}</ToolbarItem>
        <ToolbarItem variant={ToolbarItemVariant.pagination}>
          {pagination}
        </ToolbarItem>
      </ToolbarContent>
      <hr className="pf-c-divider" />
    </Toolbar>
  );
};
