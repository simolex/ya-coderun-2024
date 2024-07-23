const solution = require(".");

describe("497. Антивирус", () => {
    test("test-1", () => {
        const result = solution([
            { type: "spyware", severity: "medium" },
            { severity: "high", target: "winlogon.exe" },
            { zippedSize: 12000, realSize: 56600 },
            { zippedSize: 105000, vector: "usb_drive" },
        ]);
        expect(result).toEqual("");
    });
});
