const solution = require(".");

describe("3136. Угадай функцию", () => {
    test("test-1", () => {
        const result = solution(1);
        expect(result).toBe(1);
    });
    test("test-2", () => {
        const result = solution(2);
        expect(result).toBe(1);
    });
    test("test-3", () => {
        const result = solution(3);
        expect(result).toBe(2);
    });
    test("test-4", () => {
        const result = solution(4);
        expect(result).toBe(2);
    });
    test("test-5", () => {
        const result = solution(5);
        expect(result).toBe(4);
    });
    test("test-6", () => {
        const result = solution(6);
        expect(result).toBe(2);
    });
    test("test-7", () => {
        const result = solution(7);
        expect(result).toBe(6);
    });
    test("test-8", () => {
        const result = solution(8);
        expect(result).toBe(4);
    });
    test("test-9", () => {
        const result = solution(9);
        expect(result).toBe(6);
    });
    test("test-10", () => {
        const result = solution(10);
        expect(result).toBe(4);
    });
});
