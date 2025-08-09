export default {
  ignoreFiles: ['**/*.js','**/*.jsx','**/*.json', '**/*.html','**/*.md', 'dist/**', 'public/**', 'vite.config.js'],
  customSyntax: 'postcss-scss', 
  rules: {
    'at-rule-empty-line-before': [
      'always',
      {
        except: ['blockless-after-same-name-blockless', 'first-nested'],
        ignore: ['after-comment'],
      },
    ],
    'at-rule-no-vendor-prefix': true,
    'block-no-redundant-nested-style-rules': true,
    'color-hex-length': 'short',
    'comment-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['stylelint-commands'],
      },
    ],
    'comment-whitespace-inside': 'always',
    'container-name-pattern': [
      '^[a-z0-9_]+$',
      {
        message: (name) => `Expected container name "${name}" to be lowercase with underscores only`,
      },
    ],
    'custom-property-empty-line-before': [
      'always',
      {
        except: ['after-custom-property', 'first-nested'],
        ignore: ['after-comment', 'inside-single-line-block'],
      },
    ],
    'custom-property-pattern': [
      '^[a-z0-9_]+$',
      {
        message: (name) => `Expected custom property name "${name}" to be lowercase with underscores only`,
      },
    ],
    'declaration-block-no-redundant-longhand-properties': true,
    'declaration-block-single-line-max-declarations': 1,
    'declaration-empty-line-before': [
      'always',
      {
        except: ['after-declaration', 'first-nested'],
        ignore: ['after-comment', 'inside-single-line-block'],
      },
    ],
    'font-family-name-quotes': 'always-where-recommended',
    'function-name-case': 'lower',
    'function-url-quotes': 'always',
    'hue-degree-notation': 'angle',
    'import-notation': 'url',
    'keyframe-selector-notation': 'percentage-unless-within-keyword-only-block',
    'length-zero-no-unit': [
      true,
      {
        ignore: ['custom-properties'],
      },
    ],
    'lightness-notation': 'percentage',
    'media-feature-name-no-vendor-prefix': true,
    'media-feature-range-notation': 'context',
    'number-max-precision': 4,
    'property-no-vendor-prefix': null,
    'rule-empty-line-before': [
      'always-multi-line',
      {
        except: ['first-nested'],
        ignore: ['after-comment'],
      },
    ],
    'selector-class-pattern': [
      '^[a-z0-9_]+$',
      {
        message: (selector) => `Expected class selector "${selector}" to be lowercase with underscores only`,
      },
    ],
    'selector-id-pattern': [
      '^[a-z0-9_]+$',
      {
        message: (selector) => `Expected id selector "${selector}" to be lowercase with underscores only`,
      },
    ],
    'selector-no-vendor-prefix': true,
    'selector-not-notation': 'complex',
    'selector-pseudo-element-colon-notation': 'double',
    'selector-type-case': 'lower',
    'shorthand-property-no-redundant-values': true,
    'value-keyword-case': 'lower',
    'value-no-vendor-prefix': [
      true,
      {
        ignoreValues: ['box', 'inline-box'],
      },
    ],
  },
}
