/**
 * @author Jean.h.ma 2019-11-22
 *
 * test https://astexplorer.net/#/gist/9e3145f7e516ebacb9b926e530a5666a/9b212ef9d2e7a259481f7d755bfb9900a52a016e
 *
 */

const DefaultModules = ["react", "react-native"];
const DefaultResourceTest = /\.(gif|png|jpeg|jpg|svg)$/i;
const ReactModuleName = "$REACT$";
const ReactNativeModuleName = "$REACTNATIVE$";
const ModulesModuleName = "$MODULES$";

function getBuiltinModule(node, spec, types) {
    const name = node.source.value;
    switch (name) {
        case "react":
            if (spec.type === "ImportSpecifier") {
                return types.memberExpression(types.identifier(ReactModuleName), types.identifier(spec.imported.name));
            }
            return types.identifier(ReactModuleName);
        case "react-native":
            if (spec.type === "ImportSpecifier") {
                return types.memberExpression(types.identifier(ReactNativeModuleName), types.identifier(spec.imported.name));
            }
            return types.identifier(ReactNativeModuleName);
        default:
            if (spec.type === "ImportSpecifier") {
                return types.memberExpression(
                    types.memberExpression(types.identifier(ModulesModuleName), types.stringLiteral(name), true),
                    types.identifier(spec.imported.name)
                );
            }
            return types.memberExpression(types.identifier(ModulesModuleName), types.stringLiteral(name), true);
    }
}

function toUriSource(types, sourceName) {
    return types.objectExpression([
        types.objectProperty(
            types.identifier("uri"),
            types.binaryExpression(
                "+",
                types.memberExpression(types.identifier(ModulesModuleName), types.stringLiteral("__BASE_URL__"), true),
                types.callExpression(types.identifier("require"), [types.stringLiteral(sourceName)])
            )
        )
    ]);
}

module.exports = function(babel) {
    const { types } = babel;
    return {
        name: "cerberus-transform", // not required
        visitor: {
            CallExpression(path, { opts }) {
                let codes = [];
                const { node } = path;
                const calleeName = node.callee.name;
                if (calleeName === "require") {
                    if (node.arguments.length === 1) {
                        const arg = node.arguments[0];
                        if (arg.type === "StringLiteral") {
                            const { value } = arg;
                            const test = opts.resourceTest || DefaultResourceTest;
                            if (test.test(value)) {
                                codes.push(toUriSource(types, value));
                            }
                        }
                    }
                }
                if (codes.length > 0) {
                    path.replaceWithMultiple(codes);
                }
                path.skip();
            },
            ImportDeclaration(path, { opts }) {
                const excludeModules = opts && opts.modules && opts.modules.length > 0 ? DefaultModules.concat(opts.modules) : DefaultModules;
                let codes = [];
                const { node } = path;
                const { specifiers } = node;
                const name = node.source.value;
                const existsInExclude = excludeModules.indexOf(name) >= 0;
                if (existsInExclude) {
                    if (specifiers) {
                        specifiers.forEach(function(spec) {
                            switch (spec.type) {
                                case "ImportNamespaceSpecifier":
                                case "ImportDefaultSpecifier":
                                    codes.push(
                                        types.variableDeclaration("const", [
                                            types.variableDeclarator(types.identifier(spec.local.name), getBuiltinModule(node, spec, types))
                                        ])
                                    );
                                    break;
                                case "ImportSpecifier":
                                    codes.push(
                                        types.variableDeclaration("const", [
                                            types.variableDeclarator(types.identifier(spec.local.name), getBuiltinModule(node, spec, types))
                                        ])
                                    );
                                    break;
                            }
                        });
                    }
                } else {
                    const test = opts.resourceTest || DefaultResourceTest;
                    if (test.test(name)) {
                        if (specifiers) {
                            specifiers.forEach(function(spec) {
                                switch (spec.type) {
                                    case "ImportDefaultSpecifier":
                                        codes.push(
                                            types.variableDeclaration("const", [
                                                types.variableDeclarator(
                                                    types.identifier(spec.local.name),
                                                    types.callExpression(types.identifier("require"), [types.stringLiteral(name)])
                                                )
                                            ])
                                        );
                                        break;
                                }
                            });
                        }
                    }
                }
                if (codes.length > 0) {
                    path.replaceWithMultiple(codes);
                }
            }
        }
    };
};

