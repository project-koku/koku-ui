import {
  Toolbar,
  ToolbarContent,
  ToolbarFilter,
  ToolbarGroup,
  ToolbarItem,
  ToolbarItemVariant,
  ToolbarToggleGroup,
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons/dist/esm/icons/filter-icon';
import React from 'react';

import { styles } from './priceListToolbar.styles';

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

export const PriceListToolbar: React.FC<PriceListToolbarProps> = ({
  primary,
  secondaries,
  pagination,
  button,
  onClear,
  selected,
}) => {
  return (
    <Toolbar style={styles.toolbar} clearAllFilters={onClear} id="price-list-toolbar">
      <ToolbarContent>
        <ToolbarToggleGroup breakpoint="xl" toggleIcon={<FilterIcon />}>
          <ToolbarGroup variant="filter-group">
            <ToolbarItem>{primary}</ToolbarItem>
            {secondaries.map(secondary => {
              return (
                <ToolbarItem key={secondary.name}>
                  <ToolbarFilter
                    deleteLabel={secondary.onRemove}
                    labels={secondary.filters}
                    categoryName={secondary.name}
                  >
                    {selected === secondary.name ? secondary.component : ''}
                  </ToolbarFilter>
                </ToolbarItem>
              );
            })}
          </ToolbarGroup>
        </ToolbarToggleGroup>
        <ToolbarItem>{button}</ToolbarItem>
        <ToolbarItem variant={ToolbarItemVariant.pagination}>{pagination}</ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
};
