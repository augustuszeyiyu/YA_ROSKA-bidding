import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from "@rollup/plugin-commonjs";
import dts from "rollup-plugin-dts";


export default [
	{
		input: "./_dist/index.js",
		output: [
			{
				file: './_build/index/script.js',
				format: 'umd',
				name: 'ROSKA_FORM'
			}
		],
		plugins: [
			commonjs({
				include: ["./_dist/**/*.js", "./node_modules/**"], // Default: undefined
				ignoreGlobal: true, // Default: false
				sourceMap: false	// Default: true
			}),
			nodeResolve()
		]
	},
	{
		input: "./_dist/index.d.ts",
		output: [
			{
				file: './_build/index/YARoska.d.ts',
				format: 'es'
			}
		],
		plugins: [ dts() ]
	}
]