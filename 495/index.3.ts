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
                        { type: "Low-Pass", cutoffWavelength: 580 },
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

type Enumerate<N extends number, Acc extends unknown[] = []> = Acc["length"] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc["length"]]>;

type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

type UnionPaths<Head extends string, Tail extends string, Indexes> = Indexes extends number
    ? `${Head}${Indexes}${Tail}`
    : never;

type GenPaths<Path> = Path extends `${infer Head}(${infer Indexs extends string})${infer Tail}`
    ? Indexs extends `${infer N extends number}-${infer M extends number}`
        ? UnionPaths<Head, Tail, IntRange<N, M>>
        : Path
    : Path;

type isGen<Path> = Path extends `${infer _}(${infer __})${infer ___}`
    ? isGen<GenPaths<Path>>
    : Path;

type w = isGen<"observations.(0-3).magnitude.(0-3)">;

type GetOne<T extends unknown, Path extends string> = Path extends `${infer Left}.${infer Right}`
    ? Left extends keyof T
        ? GetOne<T[Left], Right>
        : never
    : Path extends keyof T
    ? T[Path]
    : never;

type GetAll<T, Path> = Path extends string ? GetOne<T, Path> : never;

type DeepMutable<T> = T extends (...args: any[]) => any
    ? T
    : {
          -readonly [K in keyof T]: T[K] extends object ? DeepMutable<T[K]> : T[K];
      };

type TupleToUnion<T extends unknown[], Result = never> = T extends [infer F, ...infer Last]
    ? Extract<Result, F> extends never
        ? TupleToUnion<Last, Result | F>
        : TupleToUnion<Last, Result>
    : Result;

type Get<T extends unknown, Path extends string> = DeepMutable<GetAll<T, isGen<Path>>>;

type celestialName = Get<typeof celestialBody, "cosmic">; // Sirius
type firstObservationMagnitude = Get<typeof celestialBody, "observations.0.magnitude">; // 1.46
type observationsMagnitude = Get<typeof celestialBody, "observations.(0-2).magnitude">; // 1.46 | 1.12
type observationInstruments = Get<typeof celestialBody, "observations.1.instrumentUsed">; // "Radio Telescope"
type spectraDataPoints = Get<typeof celestialBody, "observations.0.spectra.0.dataPoints.(0-3)">; // { frequency: 400 } | { frequency: 500 } | { frequency: 600 }
type spectraDataPoints_ = Get<
    typeof celestialBody,
    "observations.(0-3).spectra.0.dataPoints.(0-3)"
>; // { frequency: 400 } | { frequency: 500 } | { frequency: 600 }
type spectraFilters = Get<
    typeof celestialBody,
    "observations.0.spectra.0.filters.(0-3).cutoffWavelength"
>; // { frequency: 400 } | { frequency: 500 } | { frequency: 600 }
type secondDataPointIntensity = Get<
    typeof celestialBody,
    "observations.0.spectra.0.dataPoints.1.frequency"
>; // 500
