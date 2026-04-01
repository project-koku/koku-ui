import { createAxiosInstance } from '@koku-ui/ui-lib/api';
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  Spinner,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import avatar from 'assets/avatarimg.svg';
import * as React from 'react';

interface UserData {
  username?: string;
  email?: string;
}

const UserDropdown = () => {
  const [username, setUsername] = React.useState<string>();

  React.useEffect(() => {
    (async () => {
      try {
        const resp = await createAxiosInstance().get<UserData>('/api/me');
        setUsername(resp.data?.username || resp.data?.email);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch username', e);
        setUsername('User');
      }
    })();
  }, []);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  return (
    <Dropdown
      isOpen={isDropdownOpen}
      onSelect={() => setIsDropdownOpen(!isDropdownOpen)}
      onOpenChange={setIsDropdownOpen}
      toggle={toggleRef => (
        <MenuToggle
          ref={toggleRef}
          icon={<Avatar src={avatar} alt="avatar" size="md" />}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          id="userMenu"
          isFullHeight
          isExpanded={isDropdownOpen}
          variant="plainText"
        >
          {username ?? <Spinner />}
        </MenuToggle>
      )}
    >
      <DropdownList>
        <DropdownItem onClick={() => (window.location.href = '/logout')}>Logout</DropdownItem>
      </DropdownList>
    </Dropdown>
  );
};

const AppToolbar = () => (
  <Toolbar isFullHeight isStatic>
    <ToolbarContent>
      <ToolbarGroup
        variant="action-group-plain"
        align={{ default: 'alignEnd' }}
        gap={{ default: 'gapNone', md: 'gapMd' }}
      >
        <ToolbarItem>
          <UserDropdown />
        </ToolbarItem>
      </ToolbarGroup>
    </ToolbarContent>
  </Toolbar>
);

export default AppToolbar;
