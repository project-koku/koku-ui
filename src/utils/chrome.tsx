import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import React, { useLayoutEffect, useRef, useState } from 'react';

export interface ChromeComponentProps {
  chrome: {
    isOrgAdmin?: boolean;
  };
}

export const withChrome = Component => {
  const isOrgAdmin = async auth => {
    const data: any = await auth.getUser();
    try {
      return !!data?.identity.user?.is_org_admin;
    } catch {
      return false;
    }
  };
  const ComponentWithChromeProp: React.FC<any> = props => {
    const { auth } = useChrome();

    const [initialized, setInitialized] = useState(false);
    const [orgAdmin, setOrgAdmin] = useState(false);

    const isMounted = useRef(false);
    useLayoutEffect(() => {
      isMounted.current = true;
      return () => {
        isMounted.current = false;
      };
    }, []);

    useLayoutEffect(() => {
      isOrgAdmin(auth).then(val => {
        if (isMounted.current) {
          setOrgAdmin(val);
          setInitialized(true);
        }
      });
    });

    return initialized ? <Component {...props} chrome={{ isOrgAdmin: orgAdmin }} /> : null;
  };

  return ComponentWithChromeProp;
};
