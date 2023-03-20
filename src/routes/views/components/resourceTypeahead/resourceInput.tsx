import type { ToolbarChipGroup } from '@patternfly/react-core';
import {
  Button,
  Divider,
  Menu,
  MenuContent,
  MenuItem,
  MenuList,
  Popper,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
} from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';
import type { Query } from 'api/queries/query';
import { getQuery } from 'api/queries/query';
import type { Resource } from 'api/resources/resource';
import type { ResourcePathsType, ResourceType } from 'api/resources/resource';
import messages from 'locales/messages';
import type { FormEvent } from 'react';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { resourceActions, resourceSelectors } from 'store/resources';
import { noop } from 'utils/noop';

interface ResourceInputOwnProps {
  ariaLabel?: string;
  isDisabled?: boolean;
  onClear?: () => void;
  onSearchChanged?: (evt: FormEvent, value: string) => void;
  onSelect?: (value: string) => void;
  placeholder?: string;
  resourcePathsType: ResourcePathsType;
  resourceType: ResourceType;
  search?: string;
}

interface ResourceInputStateProps {
  resource?: Resource;
  resourceFetchStatus?: FetchStatus;
  resourceQueryString?: string;
}

interface ResourceInputState {
  menuIsOpen?: boolean;
}

interface ResourceInputDispatchProps {
  fetchResource?: typeof resourceActions.fetchResource;
}

type ResourceInputProps = ResourceInputOwnProps &
  ResourceInputStateProps &
  ResourceInputDispatchProps &
  WrappedComponentProps;

class ResourceInputBase extends React.Component<ResourceInputProps, ResourceInputState> {
  private menuRef = React.createRef<HTMLDivElement>();
  private textInputGroupRef = React.createRef<HTMLDivElement>();
  private searchTimeout: any = noop;

  protected defaultState: ResourceInputState = {
    menuIsOpen: false,
  };
  public state: ResourceInputState = { ...this.defaultState };

  constructor(props: ResourceInputProps) {
    super(props);

    this.handleClearSearch = this.handleClearSearch.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleMenuKeyDown = this.handleMenuKeyDown.bind(this);
    this.handleMenuSelect = this.handleMenuSelect.bind(this);
    this.handleTextInputKeyDown = this.handleTextInputKeyDown.bind(this);
  }

  public componentDidUpdate(prevProps: ResourceInputProps) {
    const { fetchResource, resourceFetchStatus, resourcePathsType, resourceType, resourceQueryString, search } =
      this.props;

    if (search && prevProps.search !== search && resourceFetchStatus !== FetchStatus.inProgress) {
      clearTimeout(this.searchTimeout);

      // Delay was 750ms, but reduced -- https://issues.redhat.com/browse/COST-1742
      this.searchTimeout = setTimeout(() => {
        fetchResource(resourcePathsType, resourceType, resourceQueryString);
      }, 625);
    }
  }

  // apply focus to the text input
  private focusTextInput = () => {
    this.textInputGroupRef.current.querySelector('input').focus();
  };

  private getInputGroup = () => {
    const { ariaLabel, isDisabled, search = '', onSearchChanged, placeholder } = this.props;

    return (
      <div ref={this.textInputGroupRef}>
        <TextInputGroup isDisabled={isDisabled}>
          <TextInputGroupMain
            aria-label={ariaLabel}
            icon={<SearchIcon />}
            value={search}
            onChange={onSearchChanged}
            onFocus={this.openMenu}
            onKeyDown={this.handleTextInputKeyDown}
            placeholder={placeholder}
          />
          {search && search.length && (
            <TextInputGroupUtilities>
              <Button variant="plain" onClick={this.handleClearSearch} aria-label="Clear button and input">
                <TimesIcon />
              </Button>
            </TextInputGroupUtilities>
          )}
        </TextInputGroup>
      </div>
    );
  };

  private getMenu = () => {
    const { search } = this.props;

    return (
      <div ref={this.menuRef}>
        {search && search.length && (
          <Menu onSelect={this.handleMenuSelect} onKeyDown={this.handleMenuKeyDown}>
            <MenuContent>
              <MenuList>{this.getMenuItems()}</MenuList>
            </MenuContent>
          </Menu>
        )}
      </div>
    );
  };

  private getMenuItems = () => {
    const { intl } = this.props;

    const menuItems = this.getOptions().map(option => (
      <MenuItem key={option.key} itemId={option.key}>
        {option.key}
      </MenuItem>
    ));

    // add a heading to the menu
    const headingItem = (
      <MenuItem isDisabled key="heading">
        {menuItems.length ? intl.formatMessage(messages.suggestions) : intl.formatMessage(messages.noResultsFound)}
      </MenuItem>
    );

    if (menuItems.length) {
      menuItems.unshift(<Divider key="divider" />);
    }
    menuItems.unshift(headingItem);

    return menuItems;
  };

  private getOptions = (): ToolbarChipGroup[] => {
    const { resource, resourceFetchStatus, search } = this.props;
    let options = [];
    if (resource && resource.data && resource.data.length > 0 && resourceFetchStatus !== FetchStatus.inProgress) {
      options = resource.data.map(item => {
        const value = !isNaN(search as any) ? item.value : item.account_alias || item.cluster_alias || item.value;
        return {
          key: value,
          name: value,
        };
      });
    }
    return options;
  };

  // Close menu when a click occurs outside of the menu or text input group
  private handleMenuClick = event => {
    if (
      this.menuRef.current &&
      !this.menuRef.current.contains(event.target) &&
      !this.textInputGroupRef.current.contains(event.target)
    ) {
      this.setState({ menuIsOpen: false });
    }
  };

  // Enable keyboard only usage while focused on the menu
  private handleMenuKeyDown = event => {
    if (event.key === 'Escape' || event.key === 'Tab') {
      event.preventDefault();
      this.focusTextInput();
      this.setState({ menuIsOpen: false });
    }
  };

  // Add the text of the selected item
  private handleMenuSelect = event => {
    const { onSelect, search } = this.props;

    event.stopPropagation();

    const value = event.target.innerText || search;
    if (value.trim() === '') {
      return;
    }
    this.setState({ menuIsOpen: false }, () => {
      if (onSelect) {
        onSelect(value);
      }
    });
  };

  // Enable keyboard only usage while focused on the text input
  private handleTextInputKeyDown = event => {
    switch (event.key) {
      case 'Enter':
        this.handleMenuSelect(event);
        break;
      case 'Escape':
      case 'Tab':
        this.focusTextInput();
        this.setState({ menuIsOpen: false });
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        // Allow focus on the menu and navigate using the arrow keys
        if (this.menuRef.current) {
          const firstElement = this.menuRef.current.querySelector('li > button:not(:disabled)');
          firstElement && (firstElement as any).focus();
        }
        break;
      default:
        // Open menu upon any un-designated keys
        this.openMenu();
    }
  };

  private handleClearSearch = () => {
    const { onClear } = this.props;

    this.setState({ menuIsOpen: false }, () => {
      if (onClear) {
        onClear();
      }
    });
  };

  private openMenu = () => {
    const { menuIsOpen } = this.state;

    if (!menuIsOpen) {
      this.setState({ menuIsOpen: true });
    }
  };

  public render() {
    const { menuIsOpen } = this.state;

    return (
      <Popper
        trigger={this.getInputGroup()}
        popper={this.getMenu()}
        appendTo={() => this.textInputGroupRef.current}
        isVisible={menuIsOpen}
        onDocumentClick={this.handleMenuClick}
      />
    );
  }
}

const mapStateToProps = createMapStateToProps<ResourceInputOwnProps, ResourceInputStateProps>(
  (state, { resourcePathsType, resourceType, search }) => {
    const query: Query = {
      search,
    };

    const resourceQueryString = getQuery(query);
    const resource = resourceSelectors.selectResource(state, resourcePathsType, resourceType, resourceQueryString);
    const resourceFetchStatus = resourceSelectors.selectResourceFetchStatus(
      state,
      resourcePathsType,
      resourceType,
      resourceQueryString
    );

    return {
      resource,
      resourceFetchStatus,
      resourceQueryString,
    };
  }
);

const mapDispatchToProps: ResourceInputDispatchProps = {
  fetchResource: resourceActions.fetchResource,
};

const ResourceInput = injectIntl(connect(mapStateToProps, mapDispatchToProps)(ResourceInputBase));

export { ResourceInput };
