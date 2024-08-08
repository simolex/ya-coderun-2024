const test = require(".");
const e = [
    { start: 1697428800, finish: 1697431200 }, //0
    { start: 1697429400, finish: 1697431800 },
    { start: 1697430000, finish: 1697434800 },
    { start: 1697430600, finish: 1697432400 },
    { start: 1697431140, finish: 1697442840 },
    { start: 1697434080, finish: 1697439960 }, //5
    { start: 1697435160, finish: 1697439960 },
    { start: 1697515200, finish: 1697517600 },
    { start: 1697515200, finish: 1697517600 },
    { start: 1697516220, finish: 1697519580 },
    { start: 1697516220, finish: 1697519580 }, //10
    { start: 1697516220, finish: 1697519580 },
    { start: 1697516520, finish: 1697539620 },
    { start: 1697517720, finish: 1697528700 },
    { start: 1697519760, finish: 1697530680 },
    { start: 1697608200, finish: 1697615220 }, //15
    { start: 1697608200, finish: 1697615220 },
    { start: 1697609220, finish: 1697611200 },
    { start: 1697609220, finish: 1697611200 },
    { start: 1697609220, finish: 1697611200 },
    { start: 1697609220, finish: 1697611200 }, //20
    { start: 1697609700, finish: 1697631180 },
    { start: 1697611260, finish: 1697621220 },
    { start: 1697615220, finish: 1697617200 },
    { start: 1697617200, finish: 1697619180 }
];
const events = [
    { start: 1697428800, finish: 1697443200 },
    { start: 1697443800, finish: 1697458200 },
    { start: 1697428800, finish: 1697431800 },
    { start: 1697442000, finish: 1697445000 },
    { start: 1697429400, finish: 1697443200 },
    { start: 1697443800, finish: 1697458200 },
    { start: 1697515200, finish: 1697531400 },
    { start: 1697517000, finish: 1697521200 },
    { start: 1697519400, finish: 1697524200 },
    { start: 1697524800, finish: 1697529000 },
    { start: 1697532000, finish: 1697544600 },
    { start: 1697532000, finish: 1697538000 },
    { start: 1697537400, finish: 1697544600 },
    { start: 1697603400, finish: 1697608800 },
    { start: 1697605200, finish: 1697611200 },
    { start: 1697607000, finish: 1697631000 },
    { start: 1697608200, finish: 1697621400 },
    { start: 1697697000, finish: 1697701800 },
    { start: 1697699400, finish: 1697701800 },
    { start: 1697702700, finish: 1697703300 },
    { start: 1697703600, finish: 1697708400 },
    { start: 1697706900, finish: 1697707800 },
    { start: 1697702880, finish: 1697704380 },
    { start: 1697703000, finish: 1697706600 },
    { start: 1697702400, finish: 1697717400 },
    { start: 1697702400, finish: 1697709900 },
    { start: 1697774400, finish: 1697790600 },
    { start: 1697774400, finish: 1697776200 },
    { start: 1697778000, finish: 1697781600 },
    { start: 1697774700, finish: 1697779800 },
    { start: 1697775600, finish: 1697779800 },
    { start: 1697782200, finish: 1697784000 }
];
const res = test(e, {
    dayWidth: 235,
    gap: 5,
    startWeek: 1697396400 + 8 * 60 * 60 + 30 * 60
});
