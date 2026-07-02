import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  type MenuToggleElement,
  Spinner,
} from '@patternfly/react-core';
import React from 'react';

import avatar from '#/assets/avatarimg.svg';
import { fetchCurrentUser } from '#/data/api';

function useCurrentUser(): string | undefined {
  const [username, setUsername] = React.useState<string>();
  React.useEffect(() => {
    fetchCurrentUser()
      .then(u => setUsername(u.username || u.email || 'User'))
      .catch(() => setUsername('User'));
  }, []);
  return username;
}

const handleLogout = () => {
  window.location.href = '/logout';
};

export const UserMenu: React.FC = () => {
  const username = useCurrentUser();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const closeDropdown = React.useCallback(() => setIsDropdownOpen(false), []);
  const toggleDropdown = React.useCallback(() => setIsDropdownOpen(o => !o), []);
  const renderToggle = React.useCallback(
    (toggleRef: React.Ref<MenuToggleElement>) => (
      <MenuToggle
        ref={toggleRef}
        icon={<Avatar src={avatar} alt="avatar" size="md" />}
        onClick={toggleDropdown}
        id="userMenu"
        isFullHeight
        isExpanded={isDropdownOpen}
        variant="plainText"
      >
        {username ?? <Spinner />}
      </MenuToggle>
    ),
    [isDropdownOpen, toggleDropdown, username]
  );

  return (
    <Dropdown isOpen={isDropdownOpen} onSelect={closeDropdown} onOpenChange={setIsDropdownOpen} toggle={renderToggle}>
      <DropdownList>
        <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
      </DropdownList>
    </Dropdown>
  );
};
