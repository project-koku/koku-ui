import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  BOX_PLOT_FLAG,
  DEFAULT_ONPREM_UNLEASH_FLAGS,
  resolveOnpremUnleashFlags,
} from '../src/unleash/defaultFlags.ts';

describe('resolveOnpremUnleashFlags', () => {
  it('defaults to the box-plot flag when env is unset or empty (COST-7658)', () => {
    assert.equal(DEFAULT_ONPREM_UNLEASH_FLAGS, BOX_PLOT_FLAG);
    assert.equal(BOX_PLOT_FLAG, 'cost-management.koku-ui-ros.box-plot');
    assert.equal(resolveOnpremUnleashFlags(undefined), BOX_PLOT_FLAG);
    assert.equal(resolveOnpremUnleashFlags(''), BOX_PLOT_FLAG);
    assert.equal(resolveOnpremUnleashFlags('   '), BOX_PLOT_FLAG);
  });

  it('preserves an explicit comma-separated override', () => {
    const override = 'cost-management.koku-ui-ros.box-plot,cost-management.koku-ui-ros.project-link';
    assert.equal(resolveOnpremUnleashFlags(override), override);
  });
});
