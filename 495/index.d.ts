const celestialBody = {
    cosmicData: {
        name: 'Sirius',
        type: 'Main Sequence Star',
        discoveryDate: 'Unknown Ancient Times',
    },
    observations: [
        {
            id: 1,
            title: 'Visible Light Spectrum',
            observationType: 'Electromagnetic Spectrum',
            instrumentUsed: 'Telescope',
            spectra: [
                {
                    id: 1,
                    startWavelength: 390,
                    endWavelength: 700,
                    dataPoints: [
                        { frequency: 400 },
                        { frequency: 500 },
                        { frequency: 600 },
                    ],
                    filters: [
                        { type: 'High-Pass', cutoffWavelength: 420 },
                        { type: 'Low-Pass', cutoffWavelength: 680 },
                    ],
                },
            ],
            coordinates: { rightAscension: '06h 45m 08.91728s', declination: '-16° 42′ 58.0171″' },
            magnitude: 1.46,
        },
        {
            id: 2,
            title: 'Radio Frequency Detection',
            observationType: 'Radio Astronomy',
            instrumentUsed: 'Radio Telescope',
            spectra: [
                {
                    id: 2,
                    startFrequency: 300,
                    endFrequency: 900,
                    dataPoints: [
                        { frequency: 400 },
                        { frequency: 600 },
                        { frequency: 800 },
                    ],
                },
            ],
            coordinates: { rightAscension: '06h 45m 08.91728s', declination: '-16° 42′ 58.0171″' },
            magnitude: 1.12,
        },
    ],
} as const;

type TupleSplit<T, N extends number, O extends readonly unknown[] = readonly []> =
    O['length'] extends N
    ? [O, T]
    : T extends readonly [infer F, ...infer R]
    ? TupleSplit<readonly [...R], N, readonly [...O, F]>
    : [O, T]

type PreSubArray<T, N extends number, M extends number> = TupleSplit<TupleSplit<T, N>[1], M>;
type First<T> = T extends { length: 0 } ? never : T[0];


type SubArray<T, N extends number, M extends number> = PreSubArray<T, N, M>[1] extends []
    ? PreSubArray<T, N, M>[0]
    : [...PreSubArray<T, N, M>[0], First<PreSubArray<T, N, M>[1]>];



type Get<T extends unknown, Path extends string> = Path extends `${infer Left}.${infer Right}`
    ? Left extends keyof T
    ? Get<Exclude<T[Left], undefined>, Right> | Extract<T[Left], undefined>
    : Left extends `(${infer N extends number}-${infer M extends number})`
    ? SubArray<T, N, M>
    : never
    : Path extends keyof T
    ? T[Path]
    : Path extends `(${infer N extends number}-${infer M extends number})`
    ? SubArray<T, N, M>
    : never;



type celestialName = Get<typeof celestialBody, 'cosmicData.name'>; // Sirius
type firstObservationMagnitude = Get<typeof celestialBody, 'observations.0.magnitude'>; // 1.46
type observationsMagnitude = Get<typeof celestialBody, 'observations.(0-2).magnitude'>; // 1.46 | 1.12
type observationsMagnitude = Get<typeof celestialBody, 'observations.1.magnitude'>; // 1.46 | 1.12
type observationInstruments = Get<typeof celestialBody, 'observations.1.instrumentUsed'>; // "Radio Telescope"
type spectraDataPoints = Get<typeof celestialBody, 'observations.0.spectra.0.dataPoints.(0-3)'>; // { frequency: 400 } | { frequency: 500 } | { frequency: 600 }
type secondDataPointIntensity = Get<typeof celestialBody, 'observations.0.spectra.0.dataPoints.1.frequency'>; // 500