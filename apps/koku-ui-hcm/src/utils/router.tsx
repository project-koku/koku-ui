import React from 'react';
import type { Location, NavigateFunction } from 'react-router-dom';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export interface RouteComponentProps {
  location: Location;
  navigate: NavigateFunction;
  params: any;
}

export interface RouterComponentProps {
  router: RouteComponentProps;
}

// See https://reactrouter.com/en/v6.3.0/faq#what-happened-to-withrouter-i-need-it
// And http://front-end-docs-insights.apps.ocp4.prod.psi.redhat.com/blog/router-v6
export const withRouter = Component => {
  function ComponentWithRouterProp(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    return <Component {...props} router={{ location, navigate, params }} />;
  }

  return ComponentWithRouterProp;
};
