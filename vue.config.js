
const path = require('path')
const host = '0.0.0.0'
const port = 8081

module.exports = {
	lintOnSave: false,
	productionSourceMap: false,
	outputDir: path.resolve(__dirname, 'dist'),
	devServer: {
		host,
		port,
		public: `${host}:${port}`,
		disableHostCheck: true,
		https: false,
	}
}