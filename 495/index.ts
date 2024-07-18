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

type GenPaths<Path> = Path extends `(${infer Indexs extends string})`
    ? Indexs extends `${infer N extends number}-${infer M extends number}`
        ? IntRange<N, M>
        : Path
    : Path;

type DeepMutable<T> = T extends (...args: any[]) => any
    ? T
    : {
          -readonly [K in keyof T]: T[K] extends object ? DeepMutable<T[K]> : T[K];
      };

type Get<T extends unknown, Path extends string> = Path extends `${infer Left}.${infer Right}`
    ? GenPaths<Left> extends infer P
        ? P extends keyof T
            ? Get<T[P], Right>
            : never
        : never
    : GenPaths<Path> extends infer P
    ? P extends keyof T
        ? DeepMutable<T[P]>
        : never
    : never;

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
