module.exports = function solution(list, config) {
    const FIX = 3;
    const getMinutes = (ts, weekStart) => Math.floor((ts - weekStart) / 60);

    const getDayOfWeek = (minutes) => Math.floor(minutes / (24 * 60)) + 1;

    const getIntersections = (event, evetns, withCurrent = false) => {
        return evetns.filter((e) => {
            if (!withCurrent && event === e) return false;
            if (
                (event.startMinutes < e.finishMinutes && event.startMinutes >= e.startMinutes) ||
                (event.finishMinutes > e.startMinutes && event.finishMinutes <= e.finishMinutes) ||
                (event.startMinutes <= e.startMinutes && event.finishMinutes >= e.finishMinutes)
            ) {
                return true;
            }
            return false;
        });
    };

    const getColumns = (events) => {
        const columns = [];
        events.forEach((event) => {
            let placed = false;
            for (let col = 0; col < columns.length; col++) {
                if (columns[col][columns[col].length - 1].finishMinutes <= event.startMinutes) {
                    columns[col].push(event);
                    placed = true;
                    break;
                }
            }
            if (!placed) {
                columns.push([event]);
            }
        });

        return columns;
    };

    list = list.map((event) => {
        const startMinutes = getMinutes(event.start, config.startWeek);
        const finishMinutes = getMinutes(event.finish, config.startWeek);
        return {
            ...event,
            startMinutes,
            finishMinutes,
            duration: finishMinutes - startMinutes,
            day: getDayOfWeek(startMinutes)
        };
    });

    list.sort((a, b) => {
        if (a.startMinutes !== b.startMinutes) {
            return a.startMinutes - b.startMinutes;
        }
        return b.duration - a.duration;
    });

    const { dayWidth, gap } = config;
    const result = [];

    for (let i = 1; i <= 5; i++) {
        const dayEvents = list.filter((event) => event.day === i);
        const columns = getColumns(dayEvents);
        const dayResult = [];
        columns.forEach((col, colIndex) => {
            col.forEach((event, i) => {
                const width = +((dayWidth - (columns.length - 1) * gap) / columns.length).toFixed(FIX);
                const left = +(colIndex * (width + gap)).toFixed(FIX);
                dayResult.push({
                    day: event.day,
                    height: event.duration,
                    top: event.startMinutes % (24 * 60),
                    width,
                    left,
                    ...event
                });
            });
        });

        const getIntersectionsLeft = (event, evetns) => {
            let maxLvl = 1;
            const queue = [[event, 1]];
            const visited = new Set();
            visited.add(event);

            while (queue.length) {
                const [e, lvl] = queue.pop();
                maxLvl = Math.max(maxLvl, lvl);
                const eventLeft = +(e.left - gap).toFixed(FIX);
                const intersections = getIntersections(e, dayResult).filter(
                    ({ fixed, left, width }) => fixed === false && +(left + width).toFixed(FIX) === eventLeft
                );
                if (intersections.length) {
                    const [inter] = intersections;
                    if (!visited.has(inter)) {
                        queue.push([inter, lvl + 1]);
                        visited.add(inter);
                    }
                }
                // intersections.forEach((inter) => {
                //   if (!visited.has(inter)) {
                //     queue.push([inter, lvl + 1]);
                //     visited.add(inter);
                //   }
                // });
            }
            return [[...visited], maxLvl];
        };

        const markFixed = (event) => {
            const queue = [event];
            const visited = new Set();
            visited.add(event);

            while (queue.length) {
                const e = queue.pop();
                e.fixed = true;
                const eventLeft = +(e.left - gap).toFixed(FIX);
                const intersections = getIntersections(e, dayResult).filter(
                    ({ fixed, left, width }) => fixed === undefined && +(left + width).toFixed(FIX) === eventLeft
                );

                intersections.forEach((inter) => {
                    if (!visited.has(inter)) {
                        queue.push(inter);
                        visited.add(inter);
                    }
                });
            }
        };

        dayResult
            .sort((a, b) => {
                return b.width + b.left - (a.width + a.left);
            })
            .forEach((event) => {
                if (event.fixed === undefined) {
                    const eventRight = +(event.width + event.left).toFixed(0);
                    // console.log(eventRight, dayWidth)
                    if (eventRight === dayWidth) {
                        markFixed(event);
                    }
                }
            });

        const notFixed = dayResult
            .filter((event) => {
                if (event.fixed === undefined) {
                    event.fixed = false;
                    return true;
                }
                return false;
            })
            .sort((a, b) => b.left - a.left);

        notFixed.forEach((event, i) => {
            if (event.fixed === false && i <= 111) {
                const [component, maxLvl] = getIntersectionsLeft(event, notFixed);
                component.sort((a, b) => a.left - b.left);

                const allIntersectionsFromEvent = getIntersections(event, dayResult).filter(({ fixed }) => fixed);
                const leftIntersections = allIntersectionsFromEvent
                    .filter((e) => e.left < component[0].left)
                    .sort((a, b) => {
                        return b.width + b.left - (a.width + a.left);
                    });
                const rightIntersections = allIntersectionsFromEvent
                    .filter((e) => e.left > event.left)
                    .sort((a, b) => a.left - b.left);

                let start = 0;
                let end = dayWidth;

                if (leftIntersections.length) {
                    const [maxLeft] = leftIntersections;
                    start = +(maxLeft.left + maxLeft.width + gap).toFixed(FIX);
                }

                if (rightIntersections.length) {
                    const [minRight] = rightIntersections;
                    end = +(minRight.left - gap).toFixed(FIX);
                }
                // TODO разобраться с разбиением на колонки
                const columnsComponent = getColumns(component);
                // console.log('component', component)
                // console.log(columnsComponent)
                // console.log('maxLvl', maxLvl)
                component.forEach((comp, idx) => {
                    const width = +((end - start - (component.length - 1) * gap) / component.length).toFixed(FIX);
                    const left = +(idx * (width + gap) + start).toFixed(FIX);
                    comp.width = width;
                    comp.left = left;
                    comp.fixed = true;
                });
            }
        });

        result.push(...dayResult);
    }

    return result.map((r) => {
        return {
            day: r.day,
            height: r.height,
            top: r.top,
            width: r.width,
            left: r.left
            // name: r.name,
            // fixed: r.fixed,
        };
    });
};
