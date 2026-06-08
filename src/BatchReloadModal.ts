import { App, Modal, Notice, Setting, ButtonComponent } from 'obsidian';
import HotReloadPickerPlugin from './main';
import { getPluginManager } from './obsidian-internal';

interface PluginItem {
	id: string;
	name: string;
	selected: boolean;
}

export class BatchReloadModal extends Modal {
	plugin: HotReloadPickerPlugin;
	plugins: PluginItem[];
	private statusEl: HTMLElement | null;
	private isReloading: boolean;

	constructor(app: App, plugin: HotReloadPickerPlugin) {
		super(app);
		this.plugin = plugin;
		this.plugins = [];
		this.statusEl = null;
		this.isReloading = false;
	}

	onOpen(): void {
		const { contentEl } = this;
		contentEl.empty();

		new Setting(contentEl)
			.setName(this.plugin.strings.labels.batchHeading)
			.setHeading();

		const items = this.plugin.getReloadablePlugins().map(plugin => ({
			id: plugin.id,
			name: plugin.name,
			selected: false
		}));

		this.plugins = this.plugin.sortPluginsByFavorite(items);

		const listContainer = contentEl.createDiv({ cls: 'hot-reload-batch-list' });
		this.renderSelectionActions(contentEl, listContainer);
		this.renderPluginList(listContainer);

		this.statusEl = contentEl.createDiv({ cls: 'hot-reload-batch-status' });
		this.statusEl.setText(this.plugin.strings.labels.batchInitialStatus);

		this.renderActionButtons(contentEl);
	}

	renderPluginList(container: HTMLElement): void {
		container.empty();

		this.plugins.forEach(plugin => {
			const desc = this.plugin.isFavoritePlugin(plugin.id)
				? this.plugin.strings.labels.favoritePluginDescription(plugin.id)
				: plugin.id;

			new Setting(container)
				.setName(plugin.name)
				.setDesc(desc)
				.addToggle(toggle => toggle
					.setValue(plugin.selected)
					.setDisabled(this.isReloading)
					.onChange(value => {
						plugin.selected = value;
					}));
		});
	}

	async reloadSelected(executeButton?: ButtonComponent): Promise<void> {
		const selectedPlugins = this.plugins.filter(plugin => plugin.selected);

		if (selectedPlugins.length === 0) {
			new Notice(this.plugin.strings.notices.selectAtLeastOnePlugin);
			this.setStatus(this.plugin.strings.notices.selectAtLeastOnePlugin);
			return;
		}

		this.isReloading = true;
		executeButton?.setDisabled(true);
		this.setStatus(this.plugin.strings.notices.batchPreparing(selectedPlugins.length));

		let successCount = 0;
		const failures: string[] = [];
		const pluginManager = getPluginManager(this.app);

		for (const [index, plugin] of selectedPlugins.entries()) {
			this.setStatus(this.plugin.strings.notices.batchProgress(index + 1, selectedPlugins.length, plugin.name));

			try {
				await pluginManager.disablePlugin(plugin.id);
				await pluginManager.enablePlugin(plugin.id);
				successCount++;
			} catch (e) {
				const error = e instanceof Error ? e : new Error(String(e));
				failures.push(`${plugin.name}：${error.message}`);
			}
		}

		this.isReloading = false;
		executeButton?.setDisabled(false);
		this.renderBatchResult(successCount, failures);
	}

	onClose(): void {
		const { contentEl } = this;
		contentEl.empty();
	}

	private renderSelectionActions(contentEl: HTMLElement, listContainer: HTMLElement): void {
		const selectAllContainer = contentEl.createDiv({ cls: 'hot-reload-batch-select-all' });
		new Setting(selectAllContainer)
			.setName(this.plugin.strings.labels.selectionActions)
			.addButton(btn => btn
				.setButtonText(this.plugin.strings.labels.selectAll)
				.onClick(() => {
					this.plugins.forEach(plugin => {
						plugin.selected = true;
					});
					this.renderPluginList(listContainer);
				}))
			.addButton(btn => btn
				.setButtonText(this.plugin.strings.labels.clearAll)
				.onClick(() => {
					this.plugins.forEach(plugin => {
						plugin.selected = false;
					});
					this.renderPluginList(listContainer);
				}));
	}

	private renderActionButtons(contentEl: HTMLElement): void {
		const buttonContainer = contentEl.createDiv({ cls: 'hot-reload-batch-buttons' });
		let executeButton: ButtonComponent | undefined;

		new Setting(buttonContainer)
			.addButton(btn => {
				executeButton = btn;
				btn.setButtonText(this.plugin.strings.labels.reloadSelected)
					.setCta()
					.onClick(() => {
						void this.reloadSelected(executeButton);
					});
			})
			.addButton(btn => btn
				.setButtonText(this.plugin.strings.labels.close)
				.onClick(() => this.close()));
	}

	private renderBatchResult(successCount: number, failures: string[]): void {
		if (failures.length === 0) {
			const message = this.plugin.strings.notices.batchSuccess(successCount);
			new Notice(message);
			this.setStatus(message);
			return;
		}

		new Notice(this.plugin.strings.notices.batchDone(successCount, failures.length));
		this.setStatus(this.plugin.strings.notices.batchStatusWithFailures(successCount, failures.length, failures.join('；')));
	}

	private setStatus(message: string): void {
		this.statusEl?.setText(message);
	}
}
