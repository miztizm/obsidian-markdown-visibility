# Release Guide

## Automatic Release Process

This project uses GitHub Actions to automatically create releases when you push a version tag.

## How to Create a Release

### Step 1: Update Version

Update the version in `package.json`:

```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0)
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major
```

This will:
- Update version in `package.json`
- Run `version-bump.mjs` which updates `manifest.json` and `versions.json`
- Create a git commit with the version change

### Step 2: Update Changelog (Optional)

If you want custom release notes, update `CHANGELOG.md`:

```markdown
## 1.0.1

### Added
- New feature X

### Fixed
- Bug fix Y

### Changed
- Improvement Z
```

The workflow will automatically extract the notes for the current version.

### Step 3: Push Changes and Tag

```bash
# Push the version commit and tag
git push && git push --tags
```

### Step 4: GitHub Actions Takes Over

The workflow will automatically:
1. ✅ Checkout the code
2. ✅ Install Node.js 20 with npm cache
3. ✅ Build the plugin (`npm ci && npm run build`)
4. ✅ Extract changelog notes (if available)
5. ✅ Create a GitHub release with:
   - Built files (`main.js`, `manifest.json`, `styles.css`)
   - Release notes from `CHANGELOG.md` or auto-generated notes
   - **Published immediately** (not as draft)

## Workflow Features

### ✨ Improvements Made

- **Updated Actions**: Using latest `actions/checkout@v4` and `actions/setup-node@v4`
- **Node.js 20**: Updated from Node 18 to Node 20
- **NPM Cache**: Faster builds with npm dependency caching
- **Changelog Support**: Automatically extracts notes from `CHANGELOG.md`
- **Auto-generated Notes**: If no changelog, GitHub generates notes from commits
- **Security**: Fixed command injection vulnerability (removed `eval`)
- **Auto-publish**: Releases are published immediately (not drafts)

### 🔧 Configuration Options

#### Create Draft Releases

To create draft releases that you manually publish later, add `--draft` flag:

```yaml
gh release create "$tag" \
  --title "Release $tag" \
  --draft \
  --notes-file "${{ steps.changelog.outputs.notes_file }}" \
  dist/main.js \
  dist/manifest.json \
  dist/styles.css
```

#### Custom Tag Patterns

To only trigger on specific tag patterns, modify the trigger:

```yaml
on:
  push:
    tags:
      - 'v*.*.*'  # Only v1.0.0, v1.2.3, etc.
```

## Troubleshooting

### Build Fails

- Check that `npm run build` works locally
- Ensure all dependencies are in `package.json` (not global)
- Check the Actions tab for detailed error logs

### Release Not Created

- Verify you pushed the tag: `git push --tags`
- Check workflow permissions in repo Settings → Actions → General → Workflow permissions
- Ensure `contents: write` permission is enabled

### Files Missing from Release

- Check that files exist in `dist/` after build
- Verify the file paths in the `gh release create` command

## Quick Reference

```bash
# Complete release process
npm version patch              # Update version
# Update CHANGELOG.md manually
git push && git push --tags    # Trigger release
```

## Links

- [GitHub Actions Workflows](https://github.com/miztizm/obsidian-markdown-visibility/actions)
- [Releases](https://github.com/miztizm/obsidian-markdown-visibility/releases)
- [npm version docs](https://docs.npmjs.com/cli/v9/commands/npm-version)
