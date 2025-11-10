# Code Quality Setup

This project uses a comprehensive code quality setup with ESLint, Prettier, and
Husky to ensure consistent code formatting and maintain high code quality
standards.

## 🛠️ Tools & Configuration

### ESLint

- **Purpose**: Code linting and quality enforcement
- **Config File**: `eslint.config.js`
- **Rules**: TypeScript, React, Accessibility, and Import rules
- **Extensions**: Supports `.ts`, `.tsx`, `.js`, `.jsx` files

### Prettier

- **Purpose**: Automatic code formatting
- **Config File**: `.prettierrc.json`
- **Ignore File**: `.prettierignore`
- **Features**: Consistent formatting for all supported file types

### Husky

- **Purpose**: Git hooks automation
- **Config Directory**: `.husky/`
- **Hooks**: Pre-commit and commit message validation

### EditorConfig

- **Purpose**: Consistent editor settings across different IDEs
- **Config File**: `.editorconfig`

## 📋 Available Scripts

### Linting

```bash
npm run lint              # Run ESLint on all files
npm run lint:fix          # Run ESLint and automatically fix issues
npm run lint:check        # Run ESLint with zero warnings tolerance
```

### Formatting

```bash
npm run format            # Format all files with Prettier
npm run format:check      # Check if files are properly formatted
```

### Type Checking

```bash
npm run type-check        # Run TypeScript compiler without emitting files
```

### Combined Quality Checks

```bash
npm run code-quality      # Run type-check, lint:check, and format:check
npm run code-quality:fix  # Run type-check, lint:fix, and format
```

## 🎯 Git Hooks

### Pre-commit Hook

Automatically runs before each commit:

1. **lint-staged**: Runs ESLint and Prettier on staged files
2. **Type checking**: Ensures TypeScript compilation
3. **Tests**: Runs the test suite

### Commit Message Hook

Validates commit messages follow conventional commit format:

- `feat: add new feature`
- `fix: resolve bug in component`
- `docs: update README`
- `style: format code`
- `refactor: restructure component`
- `test: add unit tests`
- `chore: update dependencies`

## 🔧 Lint-staged Configuration

The project uses `lint-staged` to run quality checks only on staged files:

- **TypeScript/JavaScript files**: ESLint + Prettier
- **Other files** (JSON, CSS, MD): Prettier only
- **TypeScript files**: Additional type checking

## 📝 Editor Integration

### VS Code

Install these extensions for the best experience:

- ESLint
- Prettier - Code formatter
- EditorConfig for VS Code

### Settings

The `.editorconfig` file provides consistent settings for:

- Indentation (2 spaces)
- End of line (LF)
- Character set (UTF-8)
- Trailing whitespace handling

## 🚀 Development Workflow

1. **Install dependencies**: `npm install`
2. **Start development**: `npm run dev`
3. **Before committing**:
   - Files are automatically formatted and linted via git hooks
   - Commit messages are validated
   - Tests must pass

## 🔍 Troubleshooting

### ESLint Issues

```bash
# Fix auto-fixable issues
npm run lint:fix

# Check for unfixable issues
npm run lint:check
```

### Formatting Issues

```bash
# Auto-format all files
npm run format

# Check formatting without changing files
npm run format:check
```

### Type Errors

```bash
# Check TypeScript types
npm run type-check
```

### Git Hook Issues

```bash
# Reinstall Husky hooks
npx husky install

# Make hooks executable
chmod +x .husky/pre-commit .husky/commit-msg
```

## 📖 Best Practices

1. **Consistent Formatting**: Let Prettier handle all formatting automatically
2. **Follow ESLint Rules**: Address linting warnings and errors promptly
3. **Type Safety**: Ensure TypeScript compilation passes
4. **Conventional Commits**: Use meaningful commit messages with proper format
5. **Test Coverage**: Maintain good test coverage for all features

## 🎯 Quality Gates

The project enforces quality through multiple gates:

1. **Editor Level**: Real-time feedback via extensions
2. **Pre-commit**: Automated checks before code enters repository
3. **CI/CD**: Additional checks in continuous integration (if configured)

This setup ensures that all code in the repository maintains consistent quality
and formatting standards.
