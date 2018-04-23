import React from 'react';
import { Helmet } from 'react-helmet';
import { classNames } from 'styles/stylesheet';
import { noop } from 'utils/noop';
import { classes } from './page.styles';

interface Props {
  masthead: React.ReactNode;
  verticalNav: React.ReactNode;
}

export interface PageContext {
  isVerticalNavOpen: boolean;
  onToggleVertcalNavOpen(): void;
}

const defaultValue: PageContext = {
  isVerticalNavOpen: true,
  onToggleVertcalNavOpen: noop,
};

const { Consumer, Provider } = React.createContext(defaultValue);

class Page extends React.Component<Props, PageContext> {
  public static Consumer = Consumer;

  private onToggleVerticalNavOpen = () => {
    this.setState(state => ({
      isVerticalNavOpen: !state.isVerticalNavOpen,
    }));
  };

  public state: PageContext = {
    isVerticalNavOpen: true,
    onToggleVertcalNavOpen: this.onToggleVerticalNavOpen,
  };

  public render() {
    const { children, masthead, verticalNav } = this.props;
    return (
      <Provider value={this.state}>
        <>
          <Helmet>
            <html
              className={classNames(
                classes.layout,
                classes.layoutFixed,
                classes.transitions
              )}
            />
          </Helmet>
          {masthead}
          <aside>{verticalNav}</aside>
          <main
            className={classNames(
              classes.main,
              classes.fluid,
              !this.state.isVerticalNavOpen && classes.navCollapsed
            )}
          >
            {children}
          </main>
        </>
      </Provider>
    );
  }
}

export { Page, Props };
