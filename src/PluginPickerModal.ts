import { App, FuzzySuggestModal, FuzzyMatch } from 'obsidian';
import HotReloadPickerPlugin from './main';
import { ReloadablePluginItem } from './main';

export class PluginPickerModal extends FuzzySuggestModal<ReloadablePluginItem> {
	plugin: HotReloadPickerPlugin;

	constructor(app: App, plugin: HotReloadPickerPlugin) {
		super(app);
		this.plugin = plugin;
		this.setPlaceholder(this.plugin.strings.placeholders.pluginPicker);
	}

	getItems(): ReloadablePluginItem[] {
		return this.plugin.sortPluginsByFavorite(this.plugin.getReloadablePlugins());
	}

	getItemText(item: ReloadablePluginItem): string {
		return `${item.name} ${item.id}`;
	}

	renderSuggestion(item: FuzzyMatch<ReloadablePluginItem>, el: HTMLElement): void {
		const wrapper = el.createDiv();
		const nameDiv = wrapper.createDiv({ text: item.item.name });

		if (this.plugin.isFavoritePlugin(item.item.id)) {
			this.renderFavoriteIcon(nameDiv);
		}

		if (item.item.id === this.plugin.settings.lastReloadedPluginId) {
			this.renderLastReloadedIcon(nameDiv);
		}

		wrapper.createDiv({ text: item.item.id, cls: 'suggest-item-description' });
	}

	onChooseItem(item: ReloadablePluginItem): void {
		void this.reloadPlugin(item);
	}

	private async reloadPlugin(item: ReloadablePluginItem): Promise<void> {
		await this.plugin.reloadPluginById(item.id);
	}

	private renderFavoriteIcon(container: HTMLElement): void {
		const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		icon.setAttribute('class', 'hot-reload-favorite-marker');
		icon.setAttribute('viewBox', '0 0 24 24');
		icon.setAttribute('aria-label', this.plugin.strings.labels.favorite);
		icon.setAttribute('role', 'img');

		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path.setAttribute('d', 'M12 3.2 14.7 8l5.4 1-3.8 4 0.7 5.5-5-2.3-5 2.3 0.7-5.5-3.8-4 5.4-1z');
		path.setAttribute('fill', 'currentColor');
		icon.appendChild(path);
		container.appendChild(icon);
	}

	private renderLastReloadedIcon(container: HTMLElement): void {
		const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		icon.setAttribute('class', 'hot-reload-last-reloaded');
		icon.setAttribute('viewBox', '0 0 24 24');
		icon.setAttribute('aria-label', this.plugin.strings.labels.lastReloaded);
		icon.setAttribute('role', 'img');

		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path.setAttribute('d', 'M17.7 6.3A7.95 7.95 0 0 0 12 4a8 8 0 1 0 7.45 5.1 1 1 0 1 0-1.86.74A6 6 0 1 1 16.2 7.8L14 10h6V4z');
		path.setAttribute('fill', 'currentColor');
		icon.appendChild(path);
		container.appendChild(icon);
	}
}
