import { checkBoxLogic, deleteChip } from './selectCheckbox';

describe('select checkbox', () => {
  it('deleteChip', () => {
    expect(deleteChip(['user1', 'user2'], 'user1')).toEqual(['user2']);
    expect(deleteChip(['user2'], 'user1')).toEqual(['user2']);
    expect(deleteChip(['user2'], 'user2')).toEqual([]);
  });
  it('checkbox logic', () => {
    expect(checkBoxLogic([], 'user1')).toEqual(['user1']);
    expect(checkBoxLogic(['user1'], 'user1')).toEqual([]);
    expect(checkBoxLogic(['user1'], 'user2')).toEqual(['user1', 'user2']);
  });
});
