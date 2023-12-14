#!/usr/bin/env node
import {rollup} from "rollup"
import resolve from "@rollup/plugin-node-resolve"
import path from "node:path"

function myPlugin() {
	return {
		name: "my-plugin",

		resolveId(source) {
			if (source === "my-virtual-module") {
				return source
			}

			return null
		},

		async load(id) {
			if (id === "my-virtual-module") {
				return `import fs from "node:fs/promises"\n`
			}

			return null
		}
	}
}

const options = {
	input: path.resolve(process.argv[2]),

	output: {
		file: "/tmp/output.mjs",
		format: "es"
	},

	plugins: [myPlugin(), resolve()],

	onLog(level, error, handler) {
		process.stderr.write(
			`[${level}] ${error.message}\n`
		)
	}
}

const bundle = await rollup(options)

await bundle.write(options.output)
