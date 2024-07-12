import { render } from './index';

describe('render', () => {
    it('renders correctly', () => {
        const value = render('hello dear\nworld');
        const expectedValue = 'hello&#8192dear<br>world';
        expect(value).toBe(expectedValue);
    });
});