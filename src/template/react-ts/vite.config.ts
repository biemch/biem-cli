import vitePluginBiem from '@biem/template-utils/plugin/vite/template';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import vitePluginSvgr from 'vite-plugin-svgr';

import { template } from './biem.config.json';
import { Values } from './src/types';

export default defineConfig({
	plugins: [
		react(),
		vitePluginSvgr(),
		vitePluginBiem<Values>({
			defaults: template.defaults,
		}),
		viteSingleFile(),
	],
	server: {
		port: 4000,
	},
	clearScreen: false,
	build: {
		copyPublicDir: false,
		emptyOutDir: true,
		assetsInlineLimit: Number.MAX_SAFE_INTEGER,
	},
});
