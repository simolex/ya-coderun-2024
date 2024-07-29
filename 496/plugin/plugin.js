module.exports = (opts = { vendorPrefixes: {} }) => {
    return {
        postcssPlugin: "Autoprefixer",
        Once(root) {
            // Calls once per file, since every file has single Root
        },
        Rule(decl) {
            console.log(decl);
            // All declaration nodes
        },
    };
};

module.exports.postcss = true;
