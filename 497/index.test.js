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
            "{type: 'spyware', severity: 'medium'} | {severity: 'high', target: 'winlogon.exe'} | {zippedSize: 12000, realSize: 56600} | {zippedSize: 105000, vector: 'usb_drive'}"
        );
    });
    test("test-2", () => {
        const result = solution([
            { type: "ransomware", corruptUserData: true },
            { type: "adware" },
        ]);
        expect(result).toEqual("{type: 'ransomware', corruptUserData: boolean} | {type: 'adware'}");
    });
    test("test-3", () => {
        const result = solution([null, undefined, true, "", 0, {}]);
        expect(result).toEqual("{} | undefined | boolean | '' | null | 0");
    });
    test("test-4", () => {
        const result = solution([
            { t1: 1, t2: 2, t3: 3 },
            { t1: 1, t2: 2 },
            { t1: 1, t3: 3 },
            { t2: 2, t3: 3 },
        ]);
        expect(result).toEqual(
            "{t1: 1, t2: 2, t3: 3} | {t1: 1, t2: 2} | {t1: 1, t3: 3} | {t2: 2, t3: 3}"
        );
    });
    test("test-5", () => {
        const result = solution([
            { t1: 1, t2: 2, t3: 3 },
            { t1: 4, t2: 5 },
            { t1: 6, t3: 7 },
            { t2: 8, t3: 9 },
        ]);
        expect(result).toEqual(
            "{t1: 1, t2: 2, t3: 3} | {t1: 4, t2: 5} | {t1: 6, t3: 7} | {t2: 8, t3: 9}"
        );
    });
    test("test-6", () => {
        const result = solution([
            { t1: 1 },
            { t1: 4 },
            { t1: 6 },
            { t1: 8 },
            { t1: 7 },
            { t1: "5" },
            { t1: "1" },
            { t1: "4" },
            { t1: "6" },
            { t1: "8" },
            { t1: "7" },
        ]);
        expect(result).toEqual("{t1: string | 1 | 4 | 6 | 8 | 7}");
    });
    test("test-7", () => {
        const result = solution([
            { type: "spyware", severity: "medium" },
            { severity: "high", target: "winlogon.exe" },
            { zippedSize: 12000, realSize: 56600 },
            { zippedSize: 105000, vector: "usb_drive" },
            { zippedSize: 105001, vector: "usb_drive1" },
            { zippedSize: 105002, vector: "usb_drive2" },
            { zippedSize: 105003, vector: "usb_drive3" },
            { zippedSize: 105000, vector: "usb_drive4" },
            { zippedSize: 105000, vector: "usb_drive5" },
        ]);
        expect(result).toEqual(
            "{type: 'spyware', severity: 'medium'} | {severity: 'high', target: 'winlogon.exe'} | {zippedSize: 12000, realSize: 56600} | {zippedSize: 105000 | 105001 | 105002 | 105003, vector: string}"
        );
    });
});
