import formatMoney from '../lib/formatMoney';

describe('formatMoney funtion', () => {
  it('works with fractional dollars', () => {
    expect(formatMoney(1)).toEqual('$0.01');
    expect(formatMoney(99)).toEqual('$0.99');
  });

  it('leaves off cents when it is a whole dollar amount', () => {
    expect(formatMoney(100)).toEqual('$1');
    expect(formatMoney(5000)).toEqual('$50');
    expect(formatMoney(50000000)).toEqual('$500,000');
  });

  it('works with whole and fractional dollars', () => {
    expect(formatMoney(140)).toEqual('$1.40');
    expect(formatMoney(5012)).toEqual('$50.12');
  });
});
