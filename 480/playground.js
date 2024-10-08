const detectDangerousWave = ({ distanceToLighthouse, distanceToBuoy, wavesFinished }) => {
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

const delay = (delay, ...params) => new Promise((resolve) => setTimeout(resolve, delay, ...params));

const wavesFinished = delay(2000, (result) => {
    const expectedResult = [
        { reachTime: startTime + 2000, height: 5 },
        { reachTime: startTime + 3000, height: 7 },
    ];

    console.log(JSON.stringify(result), JSON.stringify(expectedResult));

    console.assert(JSON.stringify(result) === JSON.stringify(expectedResult), "test failed");
});

const detector = detectDangerousWave({
    distanceToLighthouse: 100,
    distanceToBuoy: 80,
    wavesFinished,
});

const startTime = Date.now();

// at startTime
detector({ height: 2, startTime, buoyReached: delay(400) });
detector({ height: 7, startTime, buoyReached: delay(600) });

// at startTime + 500
detector({
    height: 2,
    startTime: startTime + 500,
    buoyReached: delay(300 + 500),
});

// at startTime + 1000
detector({
    height: 1,
    startTime: startTime + 1000,
    buoyReached: delay(200 + 1000),
});
