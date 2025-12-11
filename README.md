# Markdown Visibility

An Obsidian plugin that hides Markdown formatting markers for a cleaner writing experience.

## What It Does

Hides Markdown syntax characters (like `**`, `#`, `[]`) while keeping your formatted text visible and editable. Your source files remain unchanged—this is purely visual.

## Features

- **Toggle visibility** with ribbon icon, hotkey, or settings
- **Granular control** - choose which markers to hide:
  - Headers (`#`, `##`, `###`)
  - Bold (`**text**`) and italic (`*text*`)
  - Lists (`-`, `*`, `1.`)
  - Links (`[label](url)`)
  - Code (`` ` ``)
  - Blockquotes (`>`)
- **Ribbon icon** in left sidebar (can be hidden)
- **Status bar item** showing current state (optional)
- **Keyboard shortcut** support
- **Persistent settings** across sessions

## Installation

### Manual Installation

1. Download the latest release from [GitHub releases](https://github.com/miztizm/obsidian-markdown-visibility/releases)
2. Extract and copy to `<vault>/.obsidian/plugins/obsidian-markdown-visibility/`
3. Reload Obsidian (`Ctrl+R` or `Cmd+R`)
4. Enable in Settings → Community Plugins

## Usage

### Toggle Visibility

- **Ribbon icon**: Click the eye icon in the left sidebar
- **Keyboard shortcut**: Configure in Settings → Hotkeys → "Toggle Markdown Visibility"
- **Status bar**: Click the status bar item (if enabled)
- **Settings panel**: Settings → Markdown Visibility

### Options

**Interface:**
- Show/hide ribbon icon
- Show/hide status bar item

**Granular controls** - Choose which markers to hide:
- Headers (`#`, `##`, `###`)
- Bold (`**`)
- Italic (`*`, `_`)
- Links (`[]()`)
- Code (`` ` ``)
- Quotes (`>`)
- Lists (`-`, `*`, `1.`)

## Development

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for build instructions and contribution guidelines.

## FAQ

**Q: Does this modify my Markdown files?**
A: No. This is purely visual—your source files remain unchanged.

**Q: Can I choose which markers to hide?**
A: Yes. Settings → Markdown Visibility → Granular Controls.

**Q: Can I hide the ribbon icon?**
A: Yes. Settings → Markdown Visibility → Interface Options → Show ribbon icon.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- ⭐ Star the repository
- 🐛 Report bugs via [GitHub Issues](https://github.com/miztizm/obsidian-markdown-visibility/issues)
- 💬 Share feedback with the community
