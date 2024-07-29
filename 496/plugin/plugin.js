module.exports = (opts = { vendorPrefixes: {} }) => {
    let root;
    return {
        postcssPlugin: "Autoprefixer",
        Once(_root) {
            root = _root;
        },
        Rule(decl) {
            console.log(decl.selector);
            // for (const rule of decl.nodes) {
            //     console.log(rule.selector);
            // }
            // All declaration nodes
        },
    };
};

module.exports.postcss = true;
