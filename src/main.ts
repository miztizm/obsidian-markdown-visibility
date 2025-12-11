import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface MarkdownVisibilitySettings {
	enabled: boolean;
	showStatusBar: boolean;
	hideHeaders: boolean;
	hideBold: boolean;
	hideItalic: boolean;
	hideLinks: boolean;
	hideCode: boolean;
	hideQuotes: boolean;
	hideLists: boolean;
}

const DEFAULT_SETTINGS: MarkdownVisibilitySettings = {
	enabled: true,
	showStatusBar: true,
	hideHeaders: true,
	hideBold: true,
	hideItalic: true,
	hideLinks: true,
	hideCode: true,
	hideQuotes: true,
	hideLists: true
}

export default class MarkdownVisibilityPlugin extends Plugin {
	settings: MarkdownVisibilitySettings;
	private statusBarItem: HTMLElement | null = null;

	async onload() {
		// Load settings
		await this.loadSettings();

		// Add status bar item if enabled
		if (this.settings.showStatusBar) {
			this.createStatusBarItem();
		}

		// Register toggle command
		this.addCommand({
			id: 'toggle-md-visibility',
            name: "Toggle marker visibility",
			callback: () => {
				this.toggleVisibility();
			}
		});

		// Add settings tab
		this.addSettingTab(new MarkdownVisibilitySettingTab(this.app, this));

		// Apply CSS if enabled
		if (this.settings.enabled) {
			this.applyStyles();
		}
	}

	onunload() {
		this.removeStyles();
		this.removeStatusBarItem();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	toggleVisibility() {
		this.settings.enabled = !this.settings.enabled;
		void this.saveSettings();

		if (this.settings.enabled) {
			this.applyStyles();
		} else {
			this.removeStyles();
		}

		this.updateStatusBarItem();
	}

	createStatusBarItem() {
		if (this.statusBarItem) {
			return; // Already created
		}
		this.statusBarItem = this.addStatusBarItem();
		this.updateStatusBarItem();

		// Make status bar item clickable
		this.statusBarItem.addClass('mod-clickable');
		this.statusBarItem.addEventListener('click', () => {
			this.toggleVisibility();
		});
	}

	removeStatusBarItem() {
		if (this.statusBarItem) {
			this.statusBarItem.remove();
			this.statusBarItem = null;
		}
	}

	updateStatusBarItem() {
		if (this.statusBarItem) {
			const text = this.settings.enabled ? '👁️ Markers Hidden' : '👁️ Markers Visible';
			this.statusBarItem.setText(text);
		}
	}

	applyStyles() {
		// Add body class to enable CSS rules from styles.css
		document.body.classList.add('markdown-visibility-enabled');

		// Add/remove granular control classes based on settings
		document.body.classList.toggle('mv-hide-headers', this.settings.hideHeaders);
		document.body.classList.toggle('mv-hide-bold', this.settings.hideBold);
		document.body.classList.toggle('mv-hide-italic', this.settings.hideItalic);
		document.body.classList.toggle('mv-hide-links', this.settings.hideLinks);
		document.body.classList.toggle('mv-hide-code', this.settings.hideCode);
		document.body.classList.toggle('mv-hide-quotes', this.settings.hideQuotes);
		document.body.classList.toggle('mv-hide-lists', this.settings.hideLists);
	}

	removeStyles() {
		// Remove body class to disable CSS rules from styles.css
		document.body.classList.remove('markdown-visibility-enabled');

		// Remove all granular control classes
		document.body.classList.remove('mv-hide-headers');
		document.body.classList.remove('mv-hide-bold');
		document.body.classList.remove('mv-hide-italic');
		document.body.classList.remove('mv-hide-links');
		document.body.classList.remove('mv-hide-code');
		document.body.classList.remove('mv-hide-quotes');
		document.body.classList.remove('mv-hide-lists');
	}

	refreshStyles() {
		this.removeStyles();
		if (this.settings.enabled) {
			this.applyStyles();
		}
	}
}

class MarkdownVisibilitySettingTab extends PluginSettingTab {
	plugin: MarkdownVisibilityPlugin;

	constructor(app: App, plugin: MarkdownVisibilityPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl).setName('Interface').setHeading();

		// Show status bar
		new Setting(containerEl)
			.setName('Show status bar item')
			.setDesc('Display plugin status in the bottom status bar (click to toggle)')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.showStatusBar)
				.onChange(async (value) => {
					this.plugin.settings.showStatusBar = value;
					await this.plugin.saveSettings();

					if (value) {
						this.plugin.createStatusBarItem();
					} else {
						this.plugin.removeStatusBarItem();
					}
				}));

		new Setting(containerEl).setName('Granular controls').setHeading();
		containerEl.createEl('p', {
			text: 'Choose which types of Markdown markers to hide:',
			cls: 'setting-item-description'
		});

		// Headers
		new Setting(containerEl)
			.setName('Hide header markers')
			.setDesc('Hide # symbols for headers')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.hideHeaders)
				.onChange(async (value) => {
					this.plugin.settings.hideHeaders = value;
					await this.plugin.saveSettings();
					this.plugin.refreshStyles();
				}));

		// Bold
		new Setting(containerEl)
			.setName('Hide bold markers')
			.setDesc('Hide ** symbols for bold text')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.hideBold)
				.onChange(async (value) => {
					this.plugin.settings.hideBold = value;
					await this.plugin.saveSettings();
					this.plugin.refreshStyles();
				}));

		// Italic
		new Setting(containerEl)
			.setName('Hide italic markers')
			.setDesc('Hide * or _ symbols for italic text')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.hideItalic)
				.onChange(async (value) => {
					this.plugin.settings.hideItalic = value;
					await this.plugin.saveSettings();
					this.plugin.refreshStyles();
				}));

		// Links
		new Setting(containerEl)
			.setName('Hide link markers')
			.setDesc('Hide [] and () symbols for links')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.hideLinks)
				.onChange(async (value) => {
					this.plugin.settings.hideLinks = value;
					await this.plugin.saveSettings();
					this.plugin.refreshStyles();
				}));

		// Code
		new Setting(containerEl)
			.setName('Hide code markers')
			.setDesc('Hide ` symbols for inline code')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.hideCode)
				.onChange(async (value) => {
					this.plugin.settings.hideCode = value;
					await this.plugin.saveSettings();
					this.plugin.refreshStyles();
				}));

		// Quotes
		new Setting(containerEl)
			.setName('Hide quote markers')
			.setDesc('Hide > symbols for blockquotes')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.hideQuotes)
				.onChange(async (value) => {
					this.plugin.settings.hideQuotes = value;
					await this.plugin.saveSettings();
					this.plugin.refreshStyles();
				}));

		// Lists
		new Setting(containerEl)
			.setName('Hide list markers')
			.setDesc('Hide -, *, +, and numbered list markers')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.hideLists)
				.onChange(async (value) => {
					this.plugin.settings.hideLists = value;
					await this.plugin.saveSettings();
					this.plugin.refreshStyles();
				}));
	}
}

