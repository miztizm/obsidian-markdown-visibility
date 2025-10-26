# Changelog

All notable changes to the Markdown Visibility plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Interactive Controls**: Toggle marker visibility with multiple methods
  - Keyboard shortcut (configurable in Hotkeys settings)
  - Settings panel toggle
- **Settings Panel**: Comprehensive configuration options
  - Global enable/disable toggle
  - Granular controls for individual marker types
  - Real-time preview of changes
- **Persistent State**: Settings are saved and restored across Obsidian sessions
- **Dynamic CSS Injection**: CSS is applied/removed based on plugin state
- **Visual Feedback**: Ribbon icon tooltip shows current state

### Changed
- Plugin now starts enabled by default (can be toggled off)
- CSS is dynamically generated based on user preferences instead of static file
- Improved performance with selective CSS application

### Technical Details
- Implemented settings interface with TypeScript
- Added state management for plugin preferences
- Created custom settings tab with toggle controls
- Registered command for keyboard shortcut support
- Enhanced plugin architecture for better maintainability

## [1.0.0] - 2025-10-26

### Added
- Initial release of Markdown Visibility plugin
- CSS-based hiding of Markdown formatting markers
- Support for hiding the following markers:
  - Headers (`#`, `##`, `###`, etc.)
  - Bold text (`**text**`)
  - Italic text (`*text*` or `_text_`)
  - Lists (`-`, `*`, `+`, `1.`)
  - Links (`[label](url)`)
  - Code blocks (`` `code` ``)
  - Blockquotes (`> quote`)
- Optional hiding of link URLs while keeping link text visible
- Works in Live Preview mode
- Comprehensive documentation
- GitHub Actions workflow for automated releases
- Development guide for contributors

### Technical Details
- Built with TypeScript
- Uses esbuild for fast compilation
- Targets CodeMirror 6 classes for precise marker hiding
- Minimal performance impact (CSS-only implementation)
- Compatible with Obsidian v0.15.0+

[1.0.0]: https://github.com/miztizm/obsidian-markdown-visibility/releases/tag/1.0.0

