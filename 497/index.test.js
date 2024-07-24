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
    test("test-2", () => {
        const result = solution([
            { type: "ransomware", corruptUserData: true },
            { type: "adware" },
        ]);
        expect(result).toEqual("{type: 'ransomware' | 'adware', corruptUserData?: boolean}");
    });
    test("test-3", () => {
        const result = solution([null, undefined, true, "", 0, {}]);
        expect(result).toEqual("");
    });
});
