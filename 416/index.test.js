const solution = require(".");

describe("416. Праздник", () => {
    test("test-1", () => {
        const result = solution(3, [2, 1, 0]);
        expect(result).toEqual([3, 2, 1]);
    });
    test("test-2", () => {
        const result = solution(2, [1, 1]);
        expect(result).toEqual([]);
    });
    test("test-3", () => {
        const result = solution(3, [0, -3, -1]);
        expect(result).toEqual([1, 3, 2]);
    });
});
