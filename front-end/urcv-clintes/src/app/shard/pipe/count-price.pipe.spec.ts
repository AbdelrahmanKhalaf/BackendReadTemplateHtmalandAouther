import { CountPricePipe } from './count-price.pipe';

describe('CountPricePipe', () => {
  it('create an instance', () => {
    const pipe = new CountPricePipe();
    expect(pipe).toBeTruthy();
  });
});
