import { App, Plugin } from 'obsidian';

export interface AppWithPlugins extends App {
	plugins: {
		plugins: Record<string, Plugin>;
		disablePlugin: (id: string) => Promise<void>;
		enablePlugin: (id: string) => Promise<void>;
	};
}

export function getPluginManager(app: App): AppWithPlugins['plugins'] {
	return (app as AppWithPlugins).plugins;
}
