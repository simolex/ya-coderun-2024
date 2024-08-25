import { foxSay } from './index';

describe('setMessage', () => {
    it('says correctly', () => {
      const value = foxSay('yiff');
      const expectedValue = `
   /|_/|
  / ^ ^(_o  <  yiff
 /    __.'
 /     \\
(_) (_) '._
  '.__     '. .-''-'.
     ( '.   ('.____.''
     _) )'_, )
    (__/ (__/
    ==============
  `
      console.log(value)
      expect(value).toBe(expectedValue);
  });
});