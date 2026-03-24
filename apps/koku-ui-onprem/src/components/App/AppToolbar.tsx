import './AppToolbar.css';

import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  Spinner,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import avatar from 'assets/avatarimg.svg';
import * as React from 'react';

const UserDropdown = () => {
  const [username, setUsername] = React.useState<string>();

  React.useEffect(() => {
    (async () => {
      try {
        const resp = await fetch('/api/me');
        const meData = (await resp.json()) as { username?: string; email?: string };
        setUsername(meData.username || meData.email);
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
  <Toolbar isFullHeight isStatic className="koku-app_toolbar">
    <ToolbarContent>
      <ToolbarItem>
        <UserDropdown />
      </ToolbarItem>
    </ToolbarContent>
  </Toolbar>
);

export default AppToolbar;
