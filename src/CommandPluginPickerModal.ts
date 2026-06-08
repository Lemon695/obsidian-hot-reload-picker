import { App, FuzzyMatch, FuzzySuggestModal } from 'obsidian';
import HotReloadPickerPlugin from './main';
import { ReloadablePluginItem } from './main';

export class CommandPluginPickerModal extends FuzzySuggestModal<ReloadablePluginItem> {
	plugin: HotReloadPickerPlugin;
	onChoosePlugin: (pluginId: string) => void;

	constructor(app: App, plugin: HotReloadPickerPlugin, onChoosePlugin: (pluginId: string) => void) {
		super(app);
		this.plugin = plugin;
		this.onChoosePlugin = onChoosePlugin;
		this.setPlaceholder(this.plugin.strings.placeholders.commandPicker);
	}

	getItems(): ReloadablePluginItem[] {
		const configuredIds = new Set(this.plugin.settings.commandPluginIds);
		const items = this.plugin.getReloadablePlugins().filter(item => !configuredIds.has(item.id));

		return this.plugin.sortPluginsByFavorite(items);
	}

	getItemText(item: ReloadablePluginItem): string {
		return `${item.name} ${item.id}`;
	}

	renderSuggestion(item: FuzzyMatch<ReloadablePluginItem>, el: HTMLElement): void {
		const wrapper = el.createDiv();
		wrapper.createDiv({ text: item.item.name });
		wrapper.createDiv({ text: item.item.id, cls: 'suggest-item-description' });
	}

	onChooseItem(item: ReloadablePluginItem): void {
		this.onChoosePlugin(item.id);
	}
}
