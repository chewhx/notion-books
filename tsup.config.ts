import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src'],
	clean: true,
	treeshake: true,
	outDir: 'dist',
	format: ['esm', 'cjs'],
	dts: true,
});
