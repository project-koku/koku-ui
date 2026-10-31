import { COST_BASENAME, SETTINGS_INTEGRATIONS_PATH } from './routes';

describe('settings integrations path', () => {
  test('keeps the vendor sources UI under the Cost Management settings page', () => {
    expect(SETTINGS_INTEGRATIONS_PATH).toBe(`${COST_BASENAME}/settings/integrations`);
  });
});
