# Hot Reload Picker

Reload enabled plugins from the command palette for faster Obsidian plugin development.

[简体中文说明](./README.zh-CN.md)

## Why this plugin

Hot Reload Picker is intentionally narrow in scope:

- **Manual and predictable** — you decide exactly when to reload a plugin
- **Command-palette first** — optimized for keyboard-driven development workflows
- **Lightweight** — focused on plugin reloading only, without bundling unrelated developer tools

If you prefer automatic file watching and broader developer utilities, a larger toolbox plugin may suit you better. If you want a dedicated, fast, low-friction reloader, this plugin is designed for that workflow.

## Features

- Reload any enabled plugin from a searchable picker
- Reload the last plugin again with one command
- Favorite frequently reloaded plugins and keep them at the top
- Reload multiple plugins in one batch
- Generate dedicated commands such as `Reload plugin: Calendar`
- Optionally hide Hot Reload Picker itself from reload lists
- Localized UI for English and Chinese based on the current Obsidian language

## Commands

Depending on your Obsidian language, commands appear in English or Chinese.

- `Reload plugin`
- `Reload last plugin`
- `Toggle favorite for last plugin`
- `Reload multiple plugins`
- `Reload plugin: <Plugin name>` for each configured quick command

## Settings

### Quick reload commands

Create dedicated reload commands for the plugins you touch most often:

1. Open **Settings → Community plugins → Hot Reload Picker**
2. In **Quick reload commands**, click **Search and add**
3. Select one or more enabled plugins
4. Use **Move up** / **Move down** to reorder generated commands

### General

- **Hide this plugin from reload lists** — recommended while developing other plugins, so you do not accidentally reload Hot Reload Picker itself

## Typical workflow

1. Save or rebuild the plugin you are developing
2. Open the command palette
3. Run `Reload plugin` or a dedicated quick reload command
4. Verify the updated behavior immediately

This is especially useful when you are iterating on multiple plugins and want a manual but fast reload step.

## Privacy and network disclosure

- **No network requests**
- **No telemetry**
- **No ads**
- **No external accounts required**
- **All data stays local in your vault's plugin data**

The plugin stores only its own small settings payload, such as:

- last reloaded plugin ID
- favorite plugin IDs
- quick reload command targets
- whether the plugin hides itself from reload lists

## Compatibility

- **Desktop only**
- **Obsidian 1.8.7+**

Hot Reload Picker relies on Obsidian's desktop runtime plugin manager to disable and enable plugins in place. It only works with **enabled** plugins that are currently loaded by the app.

## Installation

### From Community Plugins

Once published:

1. Open **Settings → Community plugins**
2. Click **Browse**
3. Search for **Hot Reload Picker**
4. Click **Install**, then **Enable**

### Manual installation

1. Download `main.js`, `manifest.json`, and `styles.css` from the latest GitHub release
2. Create a folder at `<vault>/.obsidian/plugins/hot-reload-picker/`
3. Copy the release assets into that folder
4. Reload Obsidian
5. Enable **Hot Reload Picker** in **Settings → Community plugins**

## Development

```bash
npm install
npm run lint
npm run build
npm run dev
```

### Project structure

```text
src/
├── main.ts
├── i18n.ts
├── PluginPickerModal.ts
├── BatchReloadModal.ts
├── HotReloadPickerSettingTab.ts
├── CommandPluginPickerModal.ts
├── settings.ts
└── obsidian-internal.ts
```

## FAQ

### Why don't I see some plugins in the picker?

Hot Reload Picker only lists **enabled** plugins. A plugin must already be loaded by Obsidian before it can be reloaded in place.

### Why is this plugin hidden from the picker?

By default, the plugin hides itself to reduce accidental self-reloads during development. You can change this in **Settings → Community plugins → Hot Reload Picker → General**.

### Is this automatic hot reload?

No. This plugin is intentionally manual. It speeds up the reload step, but it does not watch your filesystem or rebuild your code automatically.

### Does this plugin work on mobile?

No. The plugin uses desktop-only plugin management behavior and is published as a desktop-only plugin.

## License

0-BSD
