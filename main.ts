import { Plugin } from 'obsidian';

export default class MarkdownVisibilityPlugin extends Plugin {
	async onload() {
		console.log('Loading Markdown Visibility plugin');

		// The styles.css file in the plugin folder will be automatically loaded by Obsidian
		// No additional code is needed to apply the CSS
	}

	onunload() {
		console.log('Unloading Markdown Visibility plugin');
	}
}

