import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig, lazyPlugins } from 'vite-plus'
import vueDevTools from 'vite-plugin-vue-devtools'

import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'

/**
 * 创建延迟加载的 Vite 插件列表。
 *
 * @returns Vite 插件列表。
 */
function createPlugins() {
  return [
    vue(),
    vueDevTools(),
    tailwindcss(),
    Components({
      dts: 'src/components.d.ts',
      resolvers: [IconsResolver()],
    }),
    Icons(),
  ]
}

export default defineConfig({
  run: {
    cache: true,
  },
  fmt: {
    endOfLine: 'lf',
    useTabs: false,
    tabWidth: 2,
    printWidth: 100,
    insertFinalNewline: true,
    semi: false,
    singleQuote: true,
    ignorePatterns: [
      'node_modules',
      'dist',
      'dist-ssr',
      'coverage',
      'src/volt/**',
      'src/components/**',
      'src/lib/**',
      'src-tauri/**',
      'package.json',
      'package.json5',
      '*.md',
      '.trellis/**',
    ],
    overrides: [
      {
        files: ['*.json', '*.jsonc'],
        options: {
          trailingComma: 'none',
        },
      },
    ],
  },
  lint: {
    ignorePatterns: [
      'node_modules',
      'dist',
      'dist-ssr',
      'coverage',
      'src/volt/**',
      'src/components/**',
      'src/lib/**',
      'src-tauri/**',
      'package.json',
      'package.json5',
      '*.md',
      '.trellis/**',
    ],
    rules: {
      'no-console': 'off',
      'typescript/no-explicit-any': 'error',
      'typescript/no-restricted-types': [
        'error',
        {
          types: {
            unknown: '不允许使用 unknown',
          },
        },
      ],
      'vite-plus/prefer-vite-plus-imports': 'error',
    },
    options: {
      typeAware: true,
      typeCheck: false,
    },
    jsPlugins: [
      {
        name: 'vite-plus',
        specifier: 'vite-plus/oxlint-plugin',
      },
    ],
  },
  plugins: lazyPlugins(createPlugins),
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
