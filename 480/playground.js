// type Timestamp = number;
// interface Wave {
//     startTime: Timestamp;
//     height: number;
//     buoyReached: Promise<void>;
// }

// interface DangerousWave {
//     reachTime: Timestamp;
//     height: number;
// }

// type WavesEndHandler = (result: DangerousWave[]) => void;

// interface DetectDangerousWaveProps {
//     distanceToLighthouse: number;
//     distanceToBuoy: number;
//     wavesFinished: Promise<WavesEndHandler>;
// }

// type DetectDangerousWaveReturn = (wave: Wave) => void;

const detectDangerousWave = ({ distanceToLighthouse, distanceToBuoy, wavesFinished }) => {
    const distance_LighthouseToBuoy = distanceToLighthouse - distanceToBuoy;

    const waves = [];

    wavesFinished.then((resolve) => {
        const countWave = waves.length;
        const reachedWave = new Map();
        const dangerousWave = [];

        for (let i = 0; i < countWave; i++) {
            const normTime = Math.round(waves[i].reachTime / 70) * 70;

            if (!reachedWave.has(normTime)) {
                reachedWave.set(normTime, { height: 0 });
            }

            reachedWave.get(normTime).height += waves[i].height;
            reachedWave.get(normTime).reachTime = waves[i].reachTime;
        }
        reachedWave.forEach((wave) => {
            if (wave.height >= 5) {
                dangerousWave.push({ reachTime: wave.reachTime / distance_LighthouseToBuoy, height: wave.height });
            }
        });

        resolve(dangerousWave);
    });

    return (wave) => {
        const { startTime, height, buoyReached } = wave;
        buoyReached.finally(() => {
            const buoyTime = Date.now();
            waves.push({
                reachTime: buoyTime * distance_LighthouseToBuoy + distanceToBuoy * (buoyTime - startTime),
                height
            });
        });
    };
};

const delay = (delay, ...params) => new Promise((resolve) => setTimeout(resolve, delay, ...params));

const wavesFinished = delay(2000, (result) => {
    const expectedResult = [
        { reachTime: startTime + 2000, height: 5 },
        { reachTime: startTime + 3000, height: 7 }
    ];

    console.log(JSON.stringify(result), JSON.stringify(expectedResult));

    console.assert(JSON.stringify(result) === JSON.stringify(expectedResult), "test failed");
});

const detector = detectDangerousWave({
    distanceToLighthouse: 100,
    distanceToBuoy: 80,
    wavesFinished
});

const startTime = Date.now();

// at startTime
detector({ height: 2, startTime, buoyReached: delay(400) });
detector({ height: 7, startTime, buoyReached: delay(600) });

// at startTime + 500
detector({
    height: 2,
    startTime: startTime + 500,
    buoyReached: delay(300 + 500)
});

// at startTime + 1000
detector({
    height: 1,
    startTime: startTime + 1000,
    buoyReached: delay(200 + 1000)
});
