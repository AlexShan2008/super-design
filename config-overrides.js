// const { override, addWebpackAlias, addDecoratorsLegacy } = require('customize-cra');
// const path = require('path')

// // const resolve = dir => path.resolve(__dirname, dir);

// module.exports = override(
//     addWebpackAlias({
//         "@": path.resolve(__dirname, 'src')
//     }),
//     addDecoratorsLegacy(),
// );


// const { alias, configPaths } = require('react-app-rewire-alias')

module.exports = function override(config) {

    // alias(configPaths())(config)

    // alias({
    //     ...configPaths(['tsconfig.paths.json'])
    // })(config)

    return config
}
