const fs = require("fs");
const dirPath = "./";
const files = fs.readdirSync(dirPath);
throw Error(files);

/**
 * 128bae56-f9ac-4c5e-8db9-94ef8163cff3_err,
 * 128bae56-f9ac-4c5e-8db9-94ef8163cff3_out,
 * 52f467bf-fb38-4d5f-a136-1131095b75f6,
 * 92f411b5-b131-4e09-bcc3-71f6590071d3,
 * Makefile,
 * compilingScript,
 * executingScript,
 * input.js,
 * output.txt,
 * participant-solution.js,
 * run.js,
 * tmp-participant-solution.js
make: *** [Makefile:15: run] Error 1
 */
