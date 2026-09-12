import { render, screen } from '@testing-library/react';
import React from 'react';

import { FetchStatus } from 'store/common';

import { ParentTagMappingReview } from './parentTagMappingReview';

describe('ParentTagMappingReview', () => {
  test('renders parent and child tag details', () => {
    render(
      <ParentTagMappingReview
        parentTags={[{ uuid: 'p-1', key: 'env', source_type: 'AWS' } as any]}
        childTags={[{ uuid: 'c-1', key: 'app', source_type: 'OCP' } as any]}
      />
    );

    expect(screen.getByText('env')).toBeInTheDocument();
    expect(screen.getByText('app')).toBeInTheDocument();
  });

  test('shows an error alert', () => {
    render(
      <ParentTagMappingReview
        settingsError={{ message: 'already mapped' } as any}
        settingsFetchStatus={FetchStatus.complete}
      />
    );

    expect(screen.getByText('already mapped')).toBeInTheDocument();
  });
});
