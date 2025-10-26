# Release Guide

## Automatic Release Process

This project uses GitHub Actions to automatically create releases when you change the version in `package.json` and push to GitHub.

## How to Create a Release

### Step 1: Update Version

**Option A: Manually edit `package.json`**

Open `package.json` and change the version:

```json
{
  "version": "1.0.1"
}
```

**Option B: Use npm version command** (if you have npm properly configured)

```bash
npm version patch   # 1.0.0 -> 1.0.1
npm version minor   # 1.0.0 -> 1.1.0
npm version major   # 1.0.0 -> 2.0.0
```

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

### Step 3: Push to GitHub

```bash
git add package.json manifest.json versions.json
git commit -m "Bump version to 1.0.1"
git push
```

**That's it!** No need to manually create or push tags.

### Step 4: GitHub Actions Takes Over

When `package.json` is pushed to the `main` branch, the workflow will automatically:
1. ✅ Detect if the version changed
2. ✅ Install Node.js 20 with npm cache
3. ✅ Build the plugin (`npm ci && npm run build`)
4. ✅ Create a git tag for the new version
5. ✅ Extract changelog notes (if available)
6. ✅ Create a GitHub release with:
   - Built files (`main.js`, `manifest.json`, `styles.css`)
   - Release notes from `CHANGELOG.md` or auto-generated notes
   - **Published immediately** (not as draft)

## Workflow Features

### ✨ Improvements Made

- **Simple Trigger**: Triggers on `package.json` changes, no manual tag pushing needed
- **Smart Detection**: Only creates releases when version actually changes
- **Auto-tagging**: Automatically creates git tags for you
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

The workflow triggers on changes to `package.json` on the `main` branch. If you want to trigger on a different branch:

```yaml
on:
  push:
    branches:
      - main
      - release  # Add more branches
    paths:
      - 'package.json'
```

## Troubleshooting

### Build Fails

- Check that `npm run build` works locally
- Ensure all dependencies are in `package.json` (not global)
- Check the Actions tab for detailed error logs

### Release Not Created

- Verify the version in `package.json` actually changed from the previous commit
- Check that you pushed to the `main` branch
- Check workflow permissions in repo Settings → Actions → General → Workflow permissions
- Ensure `contents: write` permission is enabled

### Files Missing from Release

- Check that files exist in `dist/` after build
- Verify the file paths in the `gh release create` command

## Quick Reference

```bash
# Complete release process
# 1. Edit package.json and change version to 1.0.1
# 2. Optionally update CHANGELOG.md
git add package.json manifest.json versions.json CHANGELOG.md
git commit -m "Release version 1.0.1"
git push
# Done! GitHub Actions creates the release automatically
```

## Links

- [GitHub Actions Workflows](https://github.com/miztizm/obsidian-markdown-visibility/actions)
- [Releases](https://github.com/miztizm/obsidian-markdown-visibility/releases)
- [npm version docs](https://docs.npmjs.com/cli/v9/commands/npm-version)
