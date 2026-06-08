export interface HotReloadPickerSettings {
	lastReloadedPluginId: string | null;
	excludeSelf: boolean;
	favoritePluginIds: string[];
	commandPluginIds: string[];
}

export const DEFAULT_SETTINGS: HotReloadPickerSettings = {
	lastReloadedPluginId: null,
	excludeSelf: true,
	favoritePluginIds: [],
	commandPluginIds: []
};
