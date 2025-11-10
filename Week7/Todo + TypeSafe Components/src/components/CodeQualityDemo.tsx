import React, { useState } from 'react';

/**
 * Component demonstrating Week 9 Day 5: Code Quality Setup
 * Features ESLint, Prettier, Husky, and git hooks integration
 */
export const CodeQualityDemo: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false);

  const qualityFeatures = [
    {
      title: '📋 ESLint Configuration',
      description: 'TypeScript, React, and code quality rules',
      details: [
        'TypeScript-aware linting',
        'React hooks validation',
        'Import organization',
        'Code quality enforcement',
      ],
    },
    {
      title: '🎨 Prettier Integration',
      description: 'Automatic code formatting',
      details: [
        'Consistent code style',
        'Auto-formatting on save',
        'Customizable formatting rules',
        'Multi-file type support',
      ],
    },
    {
      title: '🪝 Husky Git Hooks',
      description: 'Automated quality checks',
      details: ['Pre-commit linting', 'Automatic formatting', 'Type checking', 'Test execution'],
    },
    {
      title: '⚡ Lint-staged',
      description: 'Efficient staged file processing',
      details: [
        'Only process staged files',
        'Fast feedback loop',
        'Multiple file type support',
        'Configurable actions',
      ],
    },
  ];

  const npmScripts = [
    { command: 'npm run lint', description: 'Run ESLint on all files' },
    { command: 'npm run lint:fix', description: 'Fix auto-fixable issues' },
    { command: 'npm run format', description: 'Format all files with Prettier' },
    { command: 'npm run format:check', description: 'Check formatting without changes' },
    { command: 'npm run type-check', description: 'Run TypeScript type checking' },
    { command: 'npm run code-quality', description: 'Run all quality checks' },
    { command: 'npm run code-quality:fix', description: 'Fix all auto-fixable issues' },
  ];

  return (
    <div className='max-w-6xl mx-auto p-6 space-y-8'>
      {/* Header */}
      <div className='text-center space-y-4'>
        <h1 className='text-4xl font-bold text-gray-800'>🛠️ Week 9 Day 5: Code Quality Setup</h1>
        <p className='text-lg text-gray-600 max-w-3xl mx-auto'>
          Comprehensive code quality automation with ESLint, Prettier, Husky, and git hooks for
          consistent code formatting and quality enforcement.
        </p>
      </div>

      {/* Feature Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {qualityFeatures.map((feature, index) => (
          <div
            key={index}
            className='bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow'
          >
            <div className='flex items-start space-x-4'>
              <div className='flex-1'>
                <h3 className='text-xl font-semibold text-gray-800 mb-2'>{feature.title}</h3>
                <p className='text-gray-600 mb-4'>{feature.description}</p>
                <ul className='space-y-1'>
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className='text-sm text-gray-500 flex items-center'>
                      <span className='w-2 h-2 bg-blue-400 rounded-full mr-2'></span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* NPM Scripts */}
      <div className='bg-gray-50 rounded-lg p-6'>
        <h2 className='text-2xl font-bold text-gray-800 mb-4 flex items-center'>
          📜 Available Scripts
        </h2>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          {npmScripts.map((script, index) => (
            <div key={index} className='bg-white rounded-lg p-4 border border-gray-200'>
              <code className='text-sm font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded'>
                {script.command}
              </code>
              <p className='text-sm text-gray-600 mt-2'>{script.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Git Hooks Info */}
      <div className='bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200'>
        <h2 className='text-2xl font-bold text-gray-800 mb-4'>🔗 Git Hooks Integration</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <h3 className='text-lg font-semibold text-gray-700 mb-2'>Pre-commit Hook</h3>
            <ul className='space-y-2 text-sm text-gray-600'>
              <li className='flex items-center'>
                <span className='w-2 h-2 bg-green-500 rounded-full mr-2'></span>
                Runs lint-staged on staged files
              </li>
              <li className='flex items-center'>
                <span className='w-2 h-2 bg-green-500 rounded-full mr-2'></span>
                Performs TypeScript type checking
              </li>
              <li className='flex items-center'>
                <span className='w-2 h-2 bg-green-500 rounded-full mr-2'></span>
                Executes test suite
              </li>
              <li className='flex items-center'>
                <span className='w-2 h-2 bg-green-500 rounded-full mr-2'></span>
                Prevents commit if checks fail
              </li>
            </ul>
          </div>
          <div>
            <h3 className='text-lg font-semibold text-gray-700 mb-2'>Commit Message Hook</h3>
            <ul className='space-y-2 text-sm text-gray-600'>
              <li className='flex items-center'>
                <span className='w-2 h-2 bg-green-500 rounded-full mr-2'></span>
                Validates conventional commit format
              </li>
              <li className='flex items-center'>
                <span className='w-2 h-2 bg-green-500 rounded-full mr-2'></span>
                Ensures consistent commit history
              </li>
              <li className='flex items-center'>
                <span className='w-2 h-2 bg-green-500 rounded-full mr-2'></span>
                Supports standard commit types
              </li>
              <li className='flex items-center'>
                <span className='w-2 h-2 bg-green-500 rounded-full mr-2'></span>
                Provides helpful error messages
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Configuration Details */}
      <div className='bg-yellow-50 rounded-lg p-6 border border-yellow-200'>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className='flex items-center justify-between w-full text-left'
        >
          <h2 className='text-2xl font-bold text-gray-800'>⚙️ Configuration Files</h2>
          <span className='text-gray-600'>{showDetails ? '▼' : '▶'}</span>
        </button>
        {showDetails && (
          <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <h3 className='font-semibold text-gray-700'>Quality Tools</h3>
              <ul className='text-sm text-gray-600 space-y-1'>
                <li>📄 eslint.config.js - ESLint configuration</li>
                <li>📄 .prettierrc.json - Prettier settings</li>
                <li>📄 .prettierignore - Prettier ignore patterns</li>
                <li>📄 .editorconfig - Editor settings</li>
              </ul>
            </div>
            <div className='space-y-2'>
              <h3 className='font-semibold text-gray-700'>Git Hooks</h3>
              <ul className='text-sm text-gray-600 space-y-1'>
                <li>📄 .husky/pre-commit - Pre-commit hook</li>
                <li>📄 .husky/commit-msg - Commit message validation</li>
                <li>📄 package.json - Lint-staged configuration</li>
                <li>📄 CODE_QUALITY.md - Setup documentation</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Benefits */}
      <div className='bg-purple-50 rounded-lg p-6 border border-purple-200'>
        <h2 className='text-2xl font-bold text-gray-800 mb-4'>🎯 Benefits</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='text-center'>
            <div className='text-3xl mb-2'>🔄</div>
            <h3 className='font-semibold text-gray-700 mb-2'>Consistency</h3>
            <p className='text-sm text-gray-600'>
              Uniform code style and quality across the entire project
            </p>
          </div>
          <div className='text-center'>
            <div className='text-3xl mb-2'>⚡</div>
            <h3 className='font-semibold text-gray-700 mb-2'>Automation</h3>
            <p className='text-sm text-gray-600'>
              Automatic formatting and quality checks without manual intervention
            </p>
          </div>
          <div className='text-center'>
            <div className='text-3xl mb-2'>🛡️</div>
            <h3 className='font-semibold text-gray-700 mb-2'>Quality Gates</h3>
            <p className='text-sm text-gray-600'>
              Prevent low-quality code from entering the repository
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='text-center text-sm text-gray-500 pt-6 border-t border-gray-200'>
        <p>🚀 Week 9 Day 5: Complete code quality automation with industry best practices</p>
        <p>
          Featuring ESLint, Prettier, Husky, EditorConfig, and comprehensive git hook integration
        </p>
      </div>
    </div>
  );
};

export default CodeQualityDemo;
