/**
 * @author Jean.h.ma 2019-11-22
 */

const DefaultModules = ["react", "react-native"];
const ReactModuleName = "$React$";
const ReactNativeModuleName = "$ReactNative$";
const ModulesModuleName = "$Modules$";

function getBuiltinModule(name) {
    switch (name) {
        case "react":
            return ReactModuleName;
        case "react-native":
            return ReactNativeModuleName;
        default:
            return ModulesModuleName;
    }
}

module.exports = function (babel) {
    const {types} = babel;

    return {
        name: "cerberus-transform", // not required
        visitor: {
            ImportDeclaration(path, {opts}) {
                const excludeModules = opts && opts.modules && opts.modules.length > 0 ? DefaultModules.concat(opts.modules) : DefaultModules;
                let codes = [];
                const {node} = path;
                const {specifiers} = node;
                const name = node.source.value;
                const existsInExclude = excludeModules.indexOf(name) >= 0;
                if (existsInExclude) {
                    if (specifiers) {
                        specifiers.forEach(function (spec) {
                            switch (spec.type) {
                                case "ImportNamespaceSpecifier":
                                case "ImportDefaultSpecifier":
                                    codes.push(
                                        types.variableDeclaration("const", [
                                            types.variableDeclarator(
                                                types.identifier(spec.local.name),
                                                types.identifier(getBuiltinModule(name))
                                            )
                                        ])
                                    );

                                    break;
                                case "ImportSpecifier":
                                    codes.push(
                                        types.variableDeclaration("const", [
                                            types.variableDeclarator(
                                                types.identifier(spec.local.name),
                                                types.memberExpression(
                                                    types.identifier(getBuiltinModule(name)),
                                                    types.identifier(spec.imported.name)
                                                )
                                            )
                                        ])
                                    );
                                    break;
                            }
                        });
                    }
                }
                if (codes.length > 0) {
                    path.replaceWithMultiple(codes);
                }
            }
        }
    };
}
