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

export const detectDangerousWave = ({ distanceToLighthouse, distanceToBuoy, wavesFinished }) => {
    const distance_LighthouseToBuoy = distanceToLighthouse - distanceToBuoy;

    const waves = [];

    wavesFinished.then((resolve) => {
        const countWave = waves.length;
        const reachedWave = new Map();
        const dangerousWave = [];

        for (let i = 0; i < countWave; i++) {
            const normalBuoyTime =
                Math.floor(waves[i].buoyTime / 100) * 100 + (waves[i].startTime % 100);
            const reachTime =
                normalBuoyTime +
                (distanceToBuoy / distance_LighthouseToBuoy) *
                    (normalBuoyTime - waves[i].startTime);

            if (!reachedWave.has(reachTime)) {
                reachedWave.set(reachTime, { height: 0 });
            }

            reachedWave.get(reachTime).height += waves[i].height;
        }

        reachedWave.forEach((wave, reachTime) => {
            if (wave.height >= 5) {
                dangerousWave.push({
                    reachTime,
                    height: wave.height,
                });
            }
        });

        return resolve(dangerousWave);
    });

    return (wave) => {
        const { startTime, height, buoyReached } = wave;
        buoyReached.then(() => {
            const buoyTime = Date.now();
            waves.push({
                startTime,
                buoyTime: buoyTime,
                height,
            });
        });
    };
};
