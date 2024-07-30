module.exports = (opts = { vendorPrefixes: {} }) => {
    const { vendorPrefixes: vPrefixes } = opts;
    const processedRule = Symbol("processedRule");
    const processedDecl = Symbol("processedDecl");
    const pseudoElement = /(\\n)?([\.#_a-zA-Z]+[_a-zA-Z0-9-]*\:\:)([_a-zA-Z]+[_a-zA-Z0-9-]*)/g;
    return {
        postcssPlugin: "Autoprefixer",

        Rule(rule) {
            if (!rule[processedRule]) {
                rule[processedRule] = true;
                let result;
                while ((result = pseudoElement.exec(rule.selector)) !== null) {
                    if (vPrefixes[`::${result[3]}`]) {
                        for (let item of vPrefixes[`::${result[3]}`]) {
                            const newRule = rule.cloneBefore({
                                selector: `${result[2]}-${item}-${result[3]}`,
                                source: rule.source,
                            });
                            newRule[processedRule] = true;
                        }
                    }
                }
            }
        },

        Declaration(decl) {
            if (!decl[processedDecl]) {
                decl[processedDecl] = true;
                if (vPrefixes[decl.prop]) {
                    for (let item of vPrefixes[decl.prop]) {
                        const newDecl = decl.cloneBefore({
                            prop: `-${item}-${decl.prop}`,
                            source: decl.source,
                        });
                        newDecl[processedDecl] = true;
                    }
                }
            }
        },
    };
};

module.exports.postcss = true;
