/**
 * [vite 配置](https://cn.vitejs.dev/config/)
 */
import { _Object, _Date } from '../base';

export const vite = Object.create(null);

// 当前时间转成文件名，替换无法使用的符号
vite.getDateNameForFile = function () {
  return new _Date().toString().replaceAll(':', '_').replaceAll(' ', '__');
};
vite.createBaseConfig = function (env) {
  const result = {
    /**
     * 共享选项
     */
    root: process.cwd(),
    base: './',
    ...(env ? { mode: env.mode } : {}),
    define: {},
    plugins: [],
    publicDir: 'public',
    cacheDir: 'node_modules/.vite',
    resolve: {
      alias: {},
      dedupe: [],
      conditions: [],
      mainFields: ['browser', 'module', 'jsnext:main', 'jsnext'],
      extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
      preserveSymlinks: false,
    },
    css: {
      modules: {},
      postcss: {},
      preprocessorOptions: {},
      preprocessorMaxWorkers: true,
      devSourcemap: true,
      transformer: 'postcss',
      lightningcss: {},
    },
    json: {
      namedExports: true,
      stringify: false,
    },
    esbuild: {},
    assetsInclude: [],
    logLevel: 'info',
    // customLogger: {},
    clearScreen: true,
    get envDir() {
      return this.root;
    },
    envPrefix: 'VITE_',
    appType: 'spa',

    /**
     * 服务器选项
     */
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: false,
      https: false,
      open: false,
      proxy: {},
      cors: {},
      headers: {},
      hmr: {},
      warmup: {
        clientFiles: [],
        ssrFiles: [],
      },
      watch: {},
      middlewareMode: false,
      fs: {
        strict: true,
        // allow: [],
        deny: ['.env', '.env.*', '*.{crt,pem}'],
      },
      // origin: '',
      sourcemapIgnoreList: (sourcePath) => sourcePath.includes('node_modules'),
    },

    /**
     * 构建选项
     */
    build: {
      target: 'esnext',
      modulePreload: {},
      outDir: 'dist',
      assetsDir: 'assets',
      assetsInlineLimit: 4 * (2 ** 10),
      cssCodeSplit: true,
      get cssTarget() {
        return this.target;
      },
      get cssMinify() {
        return this.minify;
      },
      sourcemap: false,
      rollupOptions: {
        output: {
          entryFileNames(chunkInfo) {
            return `static/entryFileNames-${chunkInfo.type}-[name]-[hash]-${vite.getDateNameForFile()}.[format].js`;
          },
          chunkFileNames(chunkInfo) {
            return `static/chunkFileNames-${chunkInfo.type}-[name]-[hash]--${vite.getDateNameForFile()}.[format].js`;
          },
          assetFileNames(chunkInfo) {
            return `static/assetFileNames-${chunkInfo.type}-[name]-[hash]-${vite.getDateNameForFile()}.[ext]`;
          },
        },
      },
      commonjsOptions: {},
      dynamicImportVarsOptions: {},
      // lib: {},
      manifest: false,
      ssrManifest: false,
      ssr: false,
      ssrEmitAssets: false,
      get minify() {
        return this.ssr ? false : 'esbuild';
      },
      terserOptions: {},
      write: true,
      emptyOutDir: true,
      copyPublicDir: true,
      reportCompressedSize: true,
      chunkSizeWarningLimit: 10 * (2 ** 10),
      watch: null,
    },

    /**
     * 预览选项
     */
    preview: {
      get host() {
        return result.server.host;
      },
      port: 4173,
      get strictPort() {
        return result.server.strictPort;
      },
      get https() {
        return result.server.https;
      },
      get open() {
        return result.server.open;
      },
      get proxy() {
        return result.server.proxy;
      },
      get cors() {
        return result.server.cors;
      },
      headers: {},
    },

    /**
     * 依赖优化选项
     */
    optimizeDeps: {
      entries: [],
      exclude: [],
      include: [],
      esbuildOptions: {},
      force: false,
      holdUntilCrawlEnd: true,
      needsInterop: [],
    },

    /**
     * SSR 选项
     */
    ssr: {
      external: [],
      noExternal: [],
      target: 'node',
      resolve: {
        conditions: [],
        externalConditions: [],
      },
    },

    /**
     * Worker 选项
     */
    worker: {
      format: 'iife',
      plugins: () => [],
      rollupOptions: {},
    },
  };
  return result;
};
vite.merge = function (...sources) {
  const simpleKeys = ['root', 'base', 'mode', 'publicDir', 'cacheDir', 'esbuild', 'logLevel', 'clearScreen', 'envDir', 'envPrefix', 'appType'];
  const objectKeys = ['define', 'resolve', 'css', 'json', 'customLogger', 'server', 'build', 'preview', 'optimizeDeps', 'ssr', 'worker'];
  const arrayKeys = ['plugins', 'assetsInclude'];

  let result = {};
  for (const source of sources) {
    for (let [key, value] of Object.entries(source)) {
      // 视为指定类型的属性
      if (simpleKeys.includes(key)) {
        result[key] = value;
        continue;
      }
      if (objectKeys.includes(key)) {
        result[key] = result[key] || {};
        _Object.deepAssign(result[key], value);
        continue;
      }
      if (arrayKeys.includes(key)) {
        result[key] = result[key] || [];
        if (!Array.isArray(value)) {
          value = [value];
        }
        result[key].push(...value);
        continue;
      }
      // 其他属性
      result[key] = value;
    }
  }
  return result;
};
