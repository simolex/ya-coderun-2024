const solution = require(".");

describe("A. Быстрый поиск в массиве", () => {
    test("test-1", () => {
        const result = solution(
            [10, 1, 10, 3, 4],
            [
                [1, 10],
                [2, 9],
                [3, 4],
                [2, 2]
            ]
        );
        expect(result).toEqual([5, 2, 2, 0]);
    });
});
