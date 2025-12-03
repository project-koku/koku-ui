// Hook
import type { Query } from '@koku-ui/api/queries/query';
import { parseQuery } from '@koku-ui/api/queries/query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { getQueryState } from '../routes/utils/queryState';

export const usePrevious = value => {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  // eslint-disable-next-line
  return ref.current;
};

export const useStateCallback = <T>(initialState: T): [T, (state: T, cb?: (_state: T) => void) => void] => {
  const [state, setState] = useState(initialState);
  const cbRef = useRef<((_state: T) => void) | undefined>(undefined); // init mutable ref container for callbacks

  const setStateCallback = useCallback((_state: T, cb?: (__state: T) => void) => {
    cbRef.current = cb; // store current, passed callback in ref
    setState(_state);
  }, []); // keep object reference stable, exactly like `useState`

  useEffect(() => {
    // cb.current is `undefined` on initial render,
    // so we only invoke callback on state *updates*
    if (cbRef?.current) {
      cbRef.current(state);
      cbRef.current = undefined; // reset callback after execution
    }
  }, [state]);

  return [state, setStateCallback];
};

export const useQueryFromRoute = () => {
  const location = useLocation();
  return parseQuery<Query>(location.search);
};

export const useQueryState = (key = 'details') => {
  const location = useLocation();
  return getQueryState(location, key);
};
