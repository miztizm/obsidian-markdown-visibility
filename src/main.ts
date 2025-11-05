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
	private styleEl: HTMLStyleElement | null = null;
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
		this.saveSettings();

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
		// Always remove existing styles first to ensure clean state
		this.removeStyles();

		this.styleEl = document.createElement('style');
		this.styleEl.id = 'markdown-visibility-styles';
		this.styleEl.setAttribute('data-markdown-visibility', 'active');

		let css = '';

		// FIX: Multi-layer hiding approach for ALL formatting types to prevent text offset
		// This prevents layout shifts when clicking on text with Cyrillic characters or any formatting
		// Use multiple hiding techniques simultaneously to ensure markers NEVER appear in any state
		const multiLayerHideStyle = 'font-size: 0 !important; width: 0 !important; height: 0 !important; display: inline !important; visibility: hidden !important; opacity: 0 !important;';

		// Helper function to apply multi-layer hiding to all possible states
		const applyMultiLayerHiding = (selector: string): string => {
			let rules = '';
			rules += `${selector} { ${multiLayerHideStyle} }\n`;
			rules += `.cm-active ${selector} { ${multiLayerHideStyle} }\n`;
			rules += `.cm-activeLine ${selector} { ${multiLayerHideStyle} }\n`;
			rules += `.cm-line ${selector} { ${multiLayerHideStyle} }\n`;
			rules += `.cm-line.cm-active ${selector} { ${multiLayerHideStyle} }\n`;
			rules += `.cm-content ${selector} { ${multiLayerHideStyle} }\n`;
			return rules;
		};

		if (this.settings.hideHeaders) {
			css += applyMultiLayerHiding('.cm-formatting-header');
		}
		if (this.settings.hideBold) {
			css += applyMultiLayerHiding('.cm-formatting-strong');
		}
		if (this.settings.hideItalic) {
			css += applyMultiLayerHiding('.cm-formatting-em');
		}
		if (this.settings.hideLinks) {
			css += applyMultiLayerHiding('.cm-formatting-link');
			css += applyMultiLayerHiding('.cm-formatting-link-string');
			css += applyMultiLayerHiding('.cm-url');
			css += applyMultiLayerHiding('.cm-hmd-internal-link .cm-underline');
		}
		if (this.settings.hideCode) {
			// Hide inline code backticks with multi-layer approach
			css += applyMultiLayerHiding('.cm-formatting-code');

			// FIX: Re-enable code block fence hiding with multi-layer approach
			// Previous issue was caused by padding, not hiding itself
			// Hide fence markers WITHOUT adding any padding
			css += applyMultiLayerHiding('.cm-formatting-code-block');
			css += applyMultiLayerHiding('.HyperMD-codeblock-begin');
			css += applyMultiLayerHiding('.HyperMD-codeblock-end');
		}
		if (this.settings.hideQuotes) {
			css += applyMultiLayerHiding('.cm-formatting-quote');
		}
		if (this.settings.hideLists) {
			// FIX: Use color: transparent instead of font-size: 0 to preserve bullet rendering
			// This hides the markdown syntax (-, *, +) but allows Obsidian to render bullets (•)
			css += `.cm-formatting-list { color: transparent !important; }\n`;
			css += `.cm-formatting-list-ul { color: transparent !important; }\n`;
			css += `.cm-formatting-list-ol { color: transparent !important; }\n`;
		}

		// Only append if we have CSS rules to apply
		if (css.length > 0) {
			this.styleEl.textContent = css;
			document.head.appendChild(this.styleEl);
		} else {
			this.styleEl = null;
		}
	}

	removeStyles() {
		// Remove by ID to ensure we catch any orphaned style elements
		const existingStyle = document.getElementById('markdown-visibility-styles');
		if (existingStyle) {
			existingStyle.remove();
		}

		// Also remove via reference if it exists
		if (this.styleEl) {
			this.styleEl.remove();
			this.styleEl = null;
		}

		// Final verification - log error if style element still exists
		const stillExists = document.getElementById('markdown-visibility-styles');
		if (stillExists) {
			console.error('[Markdown Visibility] ERROR: Style element still exists after removal!');
		}
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

		containerEl.createEl('h2', { text: 'Markdown Visibility Settings' });

		containerEl.createEl('h3', { text: 'Interface Options' });

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

		containerEl.createEl('h3', { text: 'Granular Controls' });
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

