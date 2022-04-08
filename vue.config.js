const pkg = require('./package.json')

process.env.VUE_APP_MY_VERSION = JSON.stringify(pkg.version)
process.env.VUE_APP_DEP_VERSIONS = JSON.stringify(pkg.dependencies)

module.exports = {
    runtimeCompiler: true,
    lintOnSave: false,
    devServer: {
        hot: "only",
    }
}
