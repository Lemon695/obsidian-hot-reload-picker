import { getLanguage } from 'obsidian';

export interface HotReloadPickerStrings {
	commands: {
		hotReloadPlugin: string;
		reloadLastPlugin: string;
		toggleFavoriteLastPlugin: string;
		batchReloadPlugins: string;
	};
	settings: {
		quickReloadHeading: string;
		quickReloadDesc: string;
		noQuickCommands: string;
		noQuickCommandsDesc: string;
		addQuickCommand: string;
		addQuickCommandDesc: string;
		searchAndAdd: string;
		moveUp: string;
		moveDown: string;
		remove: string;
		generalHeading: string;
		generalDesc: string;
		hideSelf: string;
		hideSelfDesc: string;
	};
	placeholders: {
		pluginPicker: string;
		commandPicker: string;
	};
	labels: {
		favorite: string;
		lastReloaded: string;
		favoritePluginDescription: (pluginId: string) => string;
		batchHeading: string;
		batchInitialStatus: string;
		selectionActions: string;
		selectAll: string;
		clearAll: string;
		reloadSelected: string;
		close: string;
		failureDetailsPrefix: string;
	};
	notices: {
		pluginMissing: (pluginId: string) => string;
		reloaded: (pluginName: string) => string;
		reloadFailed: (pluginName: string, message: string) => string;
		quickReloadCommandName: (pluginName: string) => string;
		noLastReloadedPlugin: string;
		noLastReloadedPluginForFavorite: string;
		favoriteAdded: (pluginName: string) => string;
		favoriteRemoved: (pluginName: string) => string;
		selectAtLeastOnePlugin: string;
		batchPreparing: (count: number) => string;
		batchProgress: (index: number, total: number, pluginName: string) => string;
		batchSuccess: (count: number) => string;
		batchDone: (successCount: number, failureCount: number) => string;
		batchStatusWithFailures: (successCount: number, failureCount: number, details: string) => string;
	};
}

const STRINGS: Record<'en' | 'zh', HotReloadPickerStrings> = {
	en: {
		commands: {
			hotReloadPlugin: 'Reload plugin',
			reloadLastPlugin: 'Reload last plugin',
			toggleFavoriteLastPlugin: 'Toggle favorite for last plugin',
			batchReloadPlugins: 'Reload multiple plugins'
		},
		settings: {
			quickReloadHeading: 'Quick reload commands',
			quickReloadDesc: 'Create dedicated commands such as “Reload plugin: Calendar”.',
			noQuickCommands: 'No quick reload commands yet',
			noQuickCommandsDesc: 'Add a plugin below to generate a dedicated reload command.',
			addQuickCommand: 'Add quick reload command',
			addQuickCommandDesc: 'Search enabled plugins that do not already have a quick reload command.',
			searchAndAdd: 'Search and add',
			moveUp: 'Move up',
			moveDown: 'Move down',
			remove: 'Remove',
			generalHeading: 'General',
			generalDesc: 'Adjust how the plugin appears in reload lists.',
			hideSelf: 'Hide this plugin from reload lists',
			hideSelfDesc: 'Recommended while developing other plugins to avoid reloading Hot Reload Picker by mistake.'
		},
		placeholders: {
			pluginPicker: 'Select a plugin to reload...',
			commandPicker: 'Search for a plugin to add as a quick reload command...'
		},
		labels: {
			favorite: 'Favorite plugin',
			lastReloaded: 'Last reloaded plugin',
			favoritePluginDescription: (pluginId: string) => `Favorite plugin · ${pluginId}`,
			batchHeading: 'Reload multiple plugins',
			batchInitialStatus: 'Select plugins and start reloading.',
			selectionActions: 'Selection',
			selectAll: 'Select all',
			clearAll: 'Clear all',
			reloadSelected: 'Reload selected plugins',
			close: 'Close',
			failureDetailsPrefix: 'Failure details: '
		},
		notices: {
			pluginMissing: (pluginId: string) => `Plugin is not enabled or no longer available: ${pluginId}`,
			reloaded: (pluginName: string) => `Reloaded: ${pluginName}`,
			reloadFailed: (pluginName: string, message: string) => `Failed to reload ${pluginName}: ${message}`,
			quickReloadCommandName: (pluginName: string) => `Reload plugin: ${pluginName}`,
			noLastReloadedPlugin: 'No last reloaded plugin yet.',
			noLastReloadedPluginForFavorite: 'No last reloaded plugin yet, so there is nothing to favorite.',
			favoriteAdded: (pluginName: string) => `Added to favorites: ${pluginName}`,
			favoriteRemoved: (pluginName: string) => `Removed from favorites: ${pluginName}`,
			selectAtLeastOnePlugin: 'Select at least one plugin.',
			batchPreparing: (count: number) => `Preparing to reload ${count} plugin${count === 1 ? '' : 's'}...`,
			batchProgress: (index: number, total: number, pluginName: string) => `Reloading ${index}/${total}: ${pluginName}`,
			batchSuccess: (count: number) => `Reloaded ${count} plugin${count === 1 ? '' : 's'}.`,
			batchDone: (successCount: number, failureCount: number) => `Reload complete: ${successCount} succeeded, ${failureCount} failed.`,
			batchStatusWithFailures: (successCount: number, failureCount: number, details: string) => `Reload complete: ${successCount} succeeded, ${failureCount} failed. Failure details: ${details}`
		}
	},
	zh: {
		commands: {
			hotReloadPlugin: '热加载插件',
			reloadLastPlugin: '热加载上次插件',
			toggleFavoriteLastPlugin: '收藏或取消收藏上次插件',
			batchReloadPlugins: '批量热加载插件'
		},
		settings: {
			quickReloadHeading: '快捷热加载命令',
			quickReloadDesc: '为常用插件生成单独命令，例如“热加载插件：Calendar”。',
			noQuickCommands: '尚未配置快捷命令',
			noQuickCommandsDesc: '从下方选择插件后添加。',
			addQuickCommand: '添加快捷命令',
			addQuickCommandDesc: '搜索当前已启用且尚未配置快捷命令的插件。',
			searchAndAdd: '搜索并添加',
			moveUp: '上移',
			moveDown: '下移',
			remove: '移除',
			generalHeading: '常规',
			generalDesc: '调整插件在热加载列表中的展示方式。',
			hideSelf: '在热加载列表中隐藏本插件',
			hideSelfDesc: '开发其他插件时建议开启，避免误重载 Hot Reload Picker。'
		},
		placeholders: {
			pluginPicker: '选择要热加载的插件...',
			commandPicker: '搜索要添加为快捷命令的插件...'
		},
		labels: {
			favorite: '常用插件',
			lastReloaded: '上次重载',
			favoritePluginDescription: (pluginId: string) => `常用插件 · ${pluginId}`,
			batchHeading: '批量热加载插件',
			batchInitialStatus: '选择插件后开始热加载。',
			selectionActions: '选择操作',
			selectAll: '全选',
			clearAll: '取消全选',
			reloadSelected: '热加载选中的插件',
			close: '关闭',
			failureDetailsPrefix: '失败详情：'
		},
		notices: {
			pluginMissing: (pluginId: string) => `插件未启用或不存在：${pluginId}`,
			reloaded: (pluginName: string) => `已热加载：${pluginName}`,
			reloadFailed: (pluginName: string, message: string) => `热加载失败：${pluginName} — ${message}`,
			quickReloadCommandName: (pluginName: string) => `热加载插件：${pluginName}`,
			noLastReloadedPlugin: '没有上次重载记录',
			noLastReloadedPluginForFavorite: '没有上次重载记录，无法收藏',
			favoriteAdded: (pluginName: string) => `已收藏：${pluginName}`,
			favoriteRemoved: (pluginName: string) => `已取消收藏：${pluginName}`,
			selectAtLeastOnePlugin: '请至少选择一个插件。',
			batchPreparing: (count: number) => `准备热加载 ${count} 个插件...`,
			batchProgress: (index: number, total: number, pluginName: string) => `正在热加载 ${index}/${total}：${pluginName}`,
			batchSuccess: (count: number) => `成功热加载 ${count} 个插件。`,
			batchDone: (successCount: number, failureCount: number) => `热加载完成：成功 ${successCount} 个，失败 ${failureCount} 个。`,
			batchStatusWithFailures: (successCount: number, failureCount: number, details: string) => `热加载完成：成功 ${successCount} 个，失败 ${failureCount} 个。失败详情：${details}`
		}
	}
};

export function getStrings(): HotReloadPickerStrings {
	const language = getLanguage().toLowerCase();
	return language.startsWith('zh') ? STRINGS.zh : STRINGS.en;
}
