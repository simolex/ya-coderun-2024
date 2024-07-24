const solution = require(".");

describe("497. Антивирус", () => {
    test("test-1", () => {
        const result = solution([
            { type: "spyware", severity: "medium" },
            { severity: "high", target: "winlogon.exe" },
            { zippedSize: 12000, realSize: 56600 },
            { zippedSize: 105000, vector: "usb_drive" },
        ]);
        expect(result).toEqual(
            "{severity: 'medium' | 'high', type?: 'spyware', target?: 'winlogon.exe'} | {zippedSize: 12000 | 105000, realSize?: 56600, vector?: 'usb_drive'}"
        );
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
        expect(result).toEqual("{} | undefined | boolean | '' | null | 0");
    });
    test("test-3", () => {
        const result = solution([
            { t1: 1, t2: 2, t3: 3 },
            { t1: 1, t2: 2 },
            { t1: 1, t3: 3 },
            { t2: 2, t3: 3 },
        ]);
        expect(result).toEqual("{} | undefined | boolean | '' | null | 0");
    });
});
