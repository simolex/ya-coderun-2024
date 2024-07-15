const celestialBody = {
    cosmicData: {
        name: "Sirius",
        type: "Main Sequence Star",
        discoveryDate: "Unknown Ancient Times",
    },
    observations: [
        {
            id: 1,
            title: "Visible Light Spectrum",
            observationType: "Electromagnetic Spectrum",
            instrumentUsed: "Telescope",
            spectra: [
                {
                    id: 1,
                    startWavelength: 390,
                    endWavelength: 700,
                    dataPoints: [{ frequency: 400 }, { frequency: 500 }, { frequency: 600 }],
                    filters: [
                        { type: "High-Pass", cutoffWavelength: 420 },
                        { type: "Low-Pass", cutoffWavelength: 680 },
                    ],
                },
            ],
            coordinates: { rightAscension: "06h 45m 08.91728s", declination: "-16° 42′ 58.0171″" },
            magnitude: 1.46,
        },
        {
            id: 2,
            title: "Radio Frequency Detection",
            observationType: "Radio Astronomy",
            instrumentUsed: "Radio Telescope",
            spectra: [
                {
                    id: 2,
                    startFrequency: 300,
                    endFrequency: 900,
                    dataPoints: [{ frequency: 400 }, { frequency: 600 }, { frequency: 800 }],
                },
            ],
            coordinates: { rightAscension: "06h 45m 08.91728s", declination: "-16° 42′ 58.0171″" },
            magnitude: 1.12,
        },
    ],
} as const;

type ComputeRange<
    N extends number,
    Result extends Array<unknown> = [],
    > =
    (Result['length'] extends N
        ? Result
        : ComputeRange<N, [...Result, Result['length']]>
    )

type Add<A extends number> = [...ComputeRange<A>, 0]['length']

type IsGreater<A extends number, B extends number> = IsLiteralNumber<[...ComputeRange<B>][Last<[...ComputeRange<A>]>]> extends true ? false : true

type Last<T extends any[]> = T extends [...infer _, infer Last] ? Last extends number ? Last : never : never

type RemoveLast<T extends any[]> = T extends [...infer Rest, infer _] ? Rest : never

type IsLiteralNumber<N> = N extends number ? number extends N ? false : true : false


// type AddIteration<
//     Min extends number,
//     Max extends number,
//     Result extends Array<unknown> = [Min]
//     > =
//     IsGreater<Last<Result>, Max> extends true
//     ? RemoveLast<Result>
//     : AddIteration<
//         Min, Max, [...Result, Add<Last<Result>>]
//     >

type AddIteration<Start extends number, End extends number> = RangeImpl<Start, End>;
type RangeImpl<
    Start extends number,
    End extends number,
    T extends void[] = Tuple<void, Start>
    > = End extends T["length"]
    ? [End]
    : [T["length"], ...RangeImpl<Start, End, [void, ...T]>];

// Helper type for creating `N` length tuples. Assumes `N` is an integer
// greater than `0`. Example:
// Tuple<number, 2 | 4> -> [number, number] | [number, number, number, number]
type Tuple<T, N extends number> = TupleImpl<T, N>;
// prettier-ignore
type TupleImpl<T, N extends number, U extends T[] = []> =
    N extends U["length"]
    ? U
    : TupleImpl<T, N, [T, ...U]>;


type www = Range1<0, 2>

type IndexIteration<Head extends string, Tail extends string, Indexs extends unknown[], Result extends readonly unknown[] = readonly []> =
    Indexs["length"] extends 0
    ? [...Result]
    : Indexs extends [infer Index extends number, ...infer RestIndexs]
    ? IndexIteration<Head, Tail, RestIndexs, [...Result, `${Head}${Index}${Tail}`]>
    : [...Result]


type PathIteration<Path extends string> =
    Path extends `${infer Head}(${infer Indexs extends string})${infer Tail}`
    ? Indexs extends `${infer N extends number}-${infer M extends number}`
    ? IndexIteration<Head, Tail, [...AddIteration<N, M>]>
    : [Path]
    : [Path]

type GenPaths<Paths extends unknown[], Result extends readonly unknown[] = readonly []> =
    Paths["length"] extends 0
    ? [...Result]
    : Paths extends [infer Path extends string, ...infer Rest extends string[]]
    ? GenPaths<[...Rest], [...Result, ...PathIteration<Path>]>
    : [...Result]

type isGen<Paths extends unknown[]> =
    Paths[0] extends `${infer H}(${infer R})${infer T}`
    ? isGen<[...GenPaths<Paths>]>
    : [...Paths]


type GetOne<T extends unknown, Path extends string> =
    Path extends `${infer Left}.${infer Right}`
    ? Left extends keyof T
    ? GetOne<T[Left], Right>
    : never
    : Path extends keyof T
    ? T[Path]
    : never;

type GetByList<
    T extends unknown,
    Paths extends unknown[],
    Result extends readonly unknown[] = readonly []
    > = Paths["length"] extends 0
    ? [...Result]
    : Paths extends [infer Path extends string, ...infer Rest]
    ? GetOne<T, Path> extends never
    ? GetByList<T, Rest, [...Result]>
    : GetByList<T, Rest, [...Result, GetOne<T, Path>]>
    : [...Result]

type DeepMutable<T> = T extends Record<string, any>
    ? {
        - readonly [K in keyof T]: T[K] extends Record<string, any>
        ? T[K] extends (...args: any[]) => any
        ? T[K]
        : DeepMutable<T[K]>
        : T[K]
    } : T

type qwe = isGen<['observations.(0-2).magnitude']>
type Get<T extends unknown, Path extends string> = [...GetByList<T, isGen<[Path]>>] extends Array<infer ITEMS> ? ITEMS : undefined


type celestialName = Get<typeof celestialBody, 'cosmicData.name'>; // Sirius
type firstObservationMagnitude = Get<typeof celestialBody, 'observations.0.magnitude'>; // 1.46
type observationsMagnitude = Get<typeof celestialBody, 'observations.(0-2).magnitude'>; // 1.46 | 1.12
type observationInstruments = Get<typeof celestialBody, 'observations.1.instrumentUsed'>; // "Radio Telescope"
type spectraDataPoints = Get<typeof celestialBody, 'observations.0.spectra.0.dataPoints.(0-3)'>; // { frequency: 400 } | { frequency: 500 } | { frequency: 600 }
type secondDataPointIntensity = Get<typeof celestialBody, 'observations.0.spectra.0.dataPoints.1.frequency'>; // 500

