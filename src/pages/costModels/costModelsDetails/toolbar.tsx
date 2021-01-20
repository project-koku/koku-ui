import { ToolbarContent, ToolbarGroup, ToolbarItem, ToolbarItemVariant } from '@patternfly/react-core';
import React from 'react';

import { CreateCostModelButton } from './createCostModelButton';
import { ClearableToolbar, DescriptionFilter, NameFilter, SourceTypeFilter } from './utils/filters';
import { CostModelsFilterSelector, CostModelsTopPagination } from './utils/toolbar';

const CostModelsToolbar = () => {
  return (
    <ClearableToolbar>
      <ToolbarContent>
        <ToolbarGroup variant="filter-group">
          <ToolbarItem>
            <CostModelsFilterSelector />
          </ToolbarItem>
          <ToolbarItem>
            <NameFilter />
            <DescriptionFilter />
            <SourceTypeFilter />
          </ToolbarItem>
          <ToolbarItem>
            <CreateCostModelButton />
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarItem variant={ToolbarItemVariant.pagination}>
          <CostModelsTopPagination />
        </ToolbarItem>
      </ToolbarContent>
    </ClearableToolbar>
  );
};

export default CostModelsToolbar;
