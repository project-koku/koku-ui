import { updateTiersCurrency } from './costModelWizard';

describe('updateTiersCurrency', () => {
  test('updates currency units for tiered and tag rates', () => {
    const tiers = [
      { tiered_rates: [{ unit: 'USD', usage: { unit: 'USD' } }] },
      { tag_rates: { tag_values: [{ unit: 'USD' }] } },
    ];
    const res = updateTiersCurrency(tiers as any, 'EUR');
    expect(res[0].tiered_rates[0].unit).toBe('EUR');
    expect(res[0].tiered_rates[0].usage.unit).toBe('EUR');
    expect(res[1].tag_rates.tag_values[0].unit).toBe('EUR');
  });
}); 