const timer = {};
timer["sd"] = new Map();
timer[1] = new Map();

timer[1].set(1, 1);
timer[1].set(2, 1);
delete timer[1];
delete timer["sd"];

const e = Object.keys(timer).reduce((count, chatName) => count + timer[chatName].size, 0);
console.log(e);
