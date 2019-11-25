/**
 * @author Jean.h.ma 2019-11-22
 */

const DefaultModules = ["react", "react-native"];
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
                    types.memberExpression(
                        types.identifier(ModulesModuleName),
                        types.stringLiteral(name),
                        true
                    ),
                    types.identifier(spec.imported.name)
                );
            }
            return types.memberExpression(types.identifier(ModulesModuleName), types.stringLiteral(name), true);
    }
}

module.exports = function (babel) {
    const {types} = babel;

    return {
        name: "babel-plugin-transform", // not required
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
                }
                if (codes.length > 0) {
                    path.replaceWithMultiple(codes);
                }
            }
        }
    };
};
