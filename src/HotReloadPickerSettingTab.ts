import { App, PluginSettingTab, Setting } from 'obsidian';
import { CommandPluginPickerModal } from './CommandPluginPickerModal';
import HotReloadPickerPlugin from './main';
import { getPluginManager } from './obsidian-internal';

export class HotReloadPickerSettingTab extends PluginSettingTab {
	plugin: HotReloadPickerPlugin;

	constructor(app: App, plugin: HotReloadPickerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		this.renderLegacySettings();
	}

	private renderLegacySettings(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName(this.plugin.strings.settings.quickReloadHeading)
			.setDesc(this.plugin.strings.settings.quickReloadDesc)
			.setHeading();

		this.renderConfiguredCommands(containerEl);
		this.renderAddCommandControl(containerEl);
		this.renderGeneralSettings(containerEl);
	}

	private refreshSettingsView(): void {
		this.renderLegacySettings();
	}

	private renderConfiguredCommands(containerEl: HTMLElement): void {
		if (this.plugin.settings.commandPluginIds.length === 0) {
			new Setting(containerEl)
				.setName(this.plugin.strings.settings.noQuickCommands)
				.setDesc(this.plugin.strings.settings.noQuickCommandsDesc);
			return;
		}

		this.plugin.settings.commandPluginIds.forEach((pluginId, index) => {
			const pluginName = this.getPluginName(pluginId);
			new Setting(containerEl)
				.setName(this.plugin.strings.notices.quickReloadCommandName(pluginName))
				.setDesc(pluginId)
				.addButton(button => button
					.setButtonText(this.plugin.strings.settings.moveUp)
					.setDisabled(index === 0)
					.onClick(() => {
						void this.moveCommandPlugin(index, index - 1);
					}))
				.addButton(button => button
					.setButtonText(this.plugin.strings.settings.moveDown)
					.setDisabled(index === this.plugin.settings.commandPluginIds.length - 1)
					.onClick(() => {
						void this.moveCommandPlugin(index, index + 1);
					}))
				.addButton(button => button
					.setButtonText(this.plugin.strings.settings.remove)
					.onClick(() => {
						void this.removeCommandPlugin(pluginId);
					}));
		});
	}

	private renderAddCommandControl(containerEl: HTMLElement): void {
		const hasAvailablePlugins = this.hasAvailablePluginOptions();

		new Setting(containerEl)
			.setName(this.plugin.strings.settings.addQuickCommand)
			.setDesc(this.plugin.strings.settings.addQuickCommandDesc)
			.addButton(button => button
				.setButtonText(this.plugin.strings.settings.searchAndAdd)
				.setDisabled(!hasAvailablePlugins)
				.onClick(() => {
					new CommandPluginPickerModal(this.app, this.plugin, pluginId => {
						void this.addCommandPlugin(pluginId);
					}).open();
				}));
	}

	private renderGeneralSettings(containerEl: HTMLElement): void {
		new Setting(containerEl)
			.setName(this.plugin.strings.settings.generalHeading)
			.setDesc(this.plugin.strings.settings.generalDesc)
			.setHeading();

		new Setting(containerEl)
			.setName(this.plugin.strings.settings.hideSelf)
			.setDesc(this.plugin.strings.settings.hideSelfDesc)
				.addToggle(toggle => toggle
					.setValue(this.plugin.settings.excludeSelf)
					.onChange(async value => {
						this.plugin.settings.excludeSelf = value;
						this.plugin.registerConfiguredPluginCommands();
						await this.plugin.saveSettings();
						this.refreshSettingsView();
					}));
	}

	private async addCommandPlugin(pluginId: string): Promise<void> {
		this.plugin.settings.commandPluginIds = this.normalizeIds([
			...this.plugin.settings.commandPluginIds,
			pluginId
		]);
		await this.plugin.saveSettings();
		this.plugin.registerConfiguredPluginCommands();
		this.refreshSettingsView();
	}

	private async removeCommandPlugin(pluginId: string): Promise<void> {
		this.plugin.settings.commandPluginIds = this.plugin.settings.commandPluginIds.filter(id => id !== pluginId);
		await this.saveCommandOrder();
	}

	private async moveCommandPlugin(fromIndex: number, toIndex: number): Promise<void> {
		if (toIndex < 0 || toIndex >= this.plugin.settings.commandPluginIds.length) {
			return;
		}

		const commandPluginIds = [...this.plugin.settings.commandPluginIds];
		const [pluginId] = commandPluginIds.splice(fromIndex, 1);
		if (!pluginId) {
			return;
		}

		commandPluginIds.splice(toIndex, 0, pluginId);
		this.plugin.settings.commandPluginIds = commandPluginIds;
		await this.saveCommandOrder();
	}

	private async saveCommandOrder(): Promise<void> {
		await this.plugin.saveSettings();
		this.plugin.registerConfiguredPluginCommands();
		this.refreshSettingsView();
	}

	private hasAvailablePluginOptions(): boolean {
		const configuredIds = new Set(this.plugin.settings.commandPluginIds);
		return this.plugin.getReloadablePlugins().some(plugin => !configuredIds.has(plugin.id));
	}

	private getPluginName(pluginId: string): string {
		return getPluginManager(this.app).plugins[pluginId]?.manifest.name ?? pluginId;
	}

	private normalizeIds(ids: string[]): string[] {
		return [...new Set(ids)];
	}
}
