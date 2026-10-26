import { Button, Spinner } from '@patternfly/react-core';
import RedoIcon from '@patternfly/react-icons/dist/esm/icons/redo-icon';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useSource } from 'sources-ui/src/hooks/useSource';
import { loadEntities } from 'sources-ui/src/redux/sources/actions';

import { getSourcesApi } from './entities';

/** Reload the Cost source instead of posting to the Insights availability check. */
const AvailabilityChecker = () => {
  const source = useSource();
  const dispatch = useDispatch();
  const intl = useIntl();
  const [loading, setLoading] = useState(false);

  return (
    <Button
      icon={loading ? <Spinner size="md" /> : <RedoIcon />}
      variant="plain"
      aria-label={intl.formatMessage({
        id: 'sources.checkavailability',
        defaultMessage: 'Check integration availability',
      })}
      onClick={async () => {
        if (!source?.id) {
          return;
        }
        setLoading(true);
        try {
          await getSourcesApi().checkAvailabilitySource(source.id);
          await dispatch(loadEntities());
        } finally {
          setLoading(false);
        }
      }}
      isDisabled={loading}
    />
  );
};

export default AvailabilityChecker;
