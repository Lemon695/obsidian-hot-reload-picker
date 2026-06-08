import { Notice, Plugin } from 'obsidian';
import { PluginPickerModal } from './PluginPickerModal';
import { BatchReloadModal } from './BatchReloadModal';
import { HotReloadPickerSettingTab } from './HotReloadPickerSettingTab';
import { HotReloadPickerSettings, DEFAULT_SETTINGS } from './settings';
import { getStrings, HotReloadPickerStrings } from './i18n';
import { getPluginManager } from './obsidian-internal';

export interface ReloadablePluginItem {
	id: string;
	name: string;
}

export default class HotReloadPickerPlugin extends Plugin {
	settings: HotReloadPickerSettings = { ...DEFAULT_SETTINGS };
	readonly strings: HotReloadPickerStrings = getStrings();
	private quickCommandIds: Set<string> = new Set();

	async onload(): Promise<void> {
		await this.loadSettings();

		this.addCommand({
			id: 'hot-reload-plugin',
			name: this.strings.commands.hotReloadPlugin,
			callback: () => {
				new PluginPickerModal(this.app, this).open();
			}
		});

		this.addCommand({
			id: 'reload-last-plugin',
			name: this.strings.commands.reloadLastPlugin,
			callback: () => {
				void this.reloadLastPlugin();
			}
		});

		this.addCommand({
			id: 'toggle-favorite-last-plugin',
			name: this.strings.commands.toggleFavoriteLastPlugin,
			callback: () => {
				void this.toggleFavoriteLastPlugin();
			}
		});

		this.addCommand({
			id: 'batch-reload-plugins',
			name: this.strings.commands.batchReloadPlugins,
			callback: () => {
				new BatchReloadModal(this.app, this).open();
			}
		});

		this.addSettingTab(new HotReloadPickerSettingTab(this.app, this));
		this.registerConfiguredPluginCommands();
	}

	onunload(): void {
	}

	async loadSettings(): Promise<void> {
		const data = await this.loadData() as Partial<HotReloadPickerSettings> | null;
		this.settings = Object.assign({}, DEFAULT_SETTINGS, data ?? {});
		this.settings.favoritePluginIds = this.normalizePluginIds(this.settings.favoritePluginIds);
		this.settings.commandPluginIds = this.normalizePluginIds(this.settings.commandPluginIds);
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}

	isFavoritePlugin(pluginId: string): boolean {
		return this.settings.favoritePluginIds.includes(pluginId);
	}

	getReloadablePlugins(): ReloadablePluginItem[] {
		const plugins = getPluginManager(this.app).plugins;
		const items = Object.values(plugins).map(plugin => ({
			id: plugin.manifest.id,
			name: plugin.manifest.name
		}));

		if (this.settings.excludeSelf) {
			return items.filter(item => item.id !== this.manifest.id);
		}

		return items;
	}

	registerConfiguredPluginCommands(): void {
		const availablePluginIds = new Set(this.getReloadablePlugins().map(plugin => plugin.id));

		for (const commandId of this.quickCommandIds) {
			this.removeCommand(commandId);
		}

		this.quickCommandIds.clear();

		for (const pluginId of this.settings.commandPluginIds) {
			if (availablePluginIds.has(pluginId)) {
				this.registerQuickReloadCommand(pluginId);
			}
		}
	}

	sortPluginsByFavorite<T extends { id: string; name: string }>(items: T[]): T[] {
		const sortedItems = [...items];
		sortedItems.sort((a, b) => this.comparePluginsByFavorite(a, b));
		return sortedItems;
	}

	async reloadPluginById(pluginId: string): Promise<void> {
		const pluginManager = getPluginManager(this.app);
		const targetPlugin = pluginManager.plugins[pluginId];

		if (!targetPlugin) {
			new Notice(this.strings.notices.pluginMissing(pluginId));
			return;
		}

		try {
			await pluginManager.disablePlugin(pluginId);
			await pluginManager.enablePlugin(pluginId);
			this.settings.lastReloadedPluginId = pluginId;
			await this.saveSettings();
			new Notice(this.strings.notices.reloaded(targetPlugin.manifest.name));
		} catch (e) {
			const error = e instanceof Error ? e : new Error(String(e));
			new Notice(this.strings.notices.reloadFailed(targetPlugin.manifest.name, error.message));
		}
	}

	private registerQuickReloadCommand(pluginId: string): void {
		const commandId = this.getQuickReloadCommandId(pluginId);
		const pluginName = this.getPluginName(pluginId);
		this.addCommand({
			id: commandId,
			name: this.strings.notices.quickReloadCommandName(pluginName),
			callback: () => {
				void this.reloadPluginById(pluginId);
			}
		});
		this.quickCommandIds.add(commandId);
	}

	private getQuickReloadCommandId(pluginId: string): string {
		const safeId = pluginId.replace(/[^a-zA-Z0-9_-]/g, '-');
		return `quick-reload-${safeId}`;
	}

	private getPluginName(pluginId: string): string {
		return getPluginManager(this.app).plugins[pluginId]?.manifest.name ?? pluginId;
	}

	private comparePluginsByFavorite(a: { id: string; name: string }, b: { id: string; name: string }): number {
		const favoriteDiff = Number(this.isFavoritePlugin(b.id)) - Number(this.isFavoritePlugin(a.id));
		if (favoriteDiff !== 0) {
			return favoriteDiff;
		}

		return a.name.localeCompare(b.name, 'zh-Hans');
	}

	private async reloadLastPlugin(): Promise<void> {
		const pluginId = this.settings.lastReloadedPluginId;

		if (!pluginId) {
			new Notice(this.strings.notices.noLastReloadedPlugin);
			return;
		}

		await this.reloadPluginById(pluginId);
	}

	private async toggleFavoriteLastPlugin(): Promise<void> {
		const pluginId = this.settings.lastReloadedPluginId;

		if (!pluginId) {
			new Notice(this.strings.notices.noLastReloadedPluginForFavorite);
			return;
		}

		const pluginName = this.getPluginName(pluginId);
		const favoriteIds = this.settings.favoritePluginIds;

		if (favoriteIds.includes(pluginId)) {
			this.settings.favoritePluginIds = favoriteIds.filter(id => id !== pluginId);
			await this.saveSettings();
			new Notice(this.strings.notices.favoriteRemoved(pluginName));
			return;
		}

		this.settings.favoritePluginIds = [...favoriteIds, pluginId];
		await this.saveSettings();
		new Notice(this.strings.notices.favoriteAdded(pluginName));
	}

	private normalizePluginIds(value: unknown): string[] {
		if (!Array.isArray(value)) {
			return [];
		}

		return [...new Set(value.filter((item): item is string => typeof item === 'string'))];
	}
}
