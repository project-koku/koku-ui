import { addMultiValueQuery, addSingleValueQuery, removeMultiValueQuery, removeSingleValueQuery } from './filterLogic';

describe('add multi value query', () => {
  it('add new query key', () => {
    const q = {};
    expect(addMultiValueQuery(q)('name', 'ocp-cost')).toEqual({
      name: ['ocp-cost'],
    });
  });
  it('add new value to query key', () => {
    const q = { name: ['ocp-cost'] };
    expect(addMultiValueQuery(q)('name', 'aws-cost')).toEqual({
      name: ['ocp-cost', 'aws-cost'],
    });
  });
  it('add new value to query key even if it exists', () => {
    const q = { name: ['ocp-cost'] };
    expect(addMultiValueQuery(q)('name', 'ocp-cost')).toEqual({
      name: ['ocp-cost', 'ocp-cost'],
    });
  });
});

describe('add single value query', () => {
  it('add new query key', () => {
    const q = {};
    expect(addSingleValueQuery(q)('name', 'ocp-cost')).toEqual({
      name: 'ocp-cost',
    });
  });
  it('update value to query key', () => {
    const q = { name: 'ocp-cost' };
    expect(addSingleValueQuery(q)('name', 'aws-cost')).toEqual({
      name: 'aws-cost',
    });
  });
});

describe('remove single value query', () => {
  it('remove single value for not existed key', () => {
    const q = { name: 'ocp-cost' };
    expect(removeSingleValueQuery(q)('source_type', 'AWS')).toEqual({
      name: 'ocp-cost',
    });
  });
  it('remove value from query key', () => {
    const q = { name: 'ocp-cost' };
    expect(removeSingleValueQuery(q)('name', 'aws-cost')).toEqual({});
  });
});

describe('remove multi value query', () => {
  it('remove multi value for not existed key', () => {
    const q = { name: 'ocp-cost' };
    expect(removeMultiValueQuery(q)('source_type', 'AWS')).toEqual({
      name: 'ocp-cost',
    });
  });
  it('remove value from query key that has one value', () => {
    const q = { name: ['ocp-cost'] };
    expect(removeMultiValueQuery(q)('name', 'ocp-cost')).toEqual({});
  });
  it('remove value from query key that has more than one value', () => {
    const q = { name: ['ocp-cost', 'aws-cost'] };
    expect(removeMultiValueQuery(q)('name', 'ocp-cost')).toEqual({
      name: ['aws-cost'],
    });
  });
});
