import { Toolbar, ToolbarContent, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';
import React from 'react';

import { UserMenu } from './UserMenu';

export const AppToolbar: React.FC = () => (
  <Toolbar isFullHeight isStatic>
    <ToolbarContent>
      <ToolbarGroup
        variant="action-group-plain"
        align={{ default: 'alignEnd' }}
        gap={{ default: 'gapNone', md: 'gapMd' }}
      >
        <ToolbarItem>
          <UserMenu />
        </ToolbarItem>
      </ToolbarGroup>
    </ToolbarContent>
  </Toolbar>
);
