/**
 * vite 配置：https://cn.vitejs.dev/config/
 */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig(({ command, mode }) => {
  return {
    base: './',
    server: {
      host: '0.0.0.0',
      port: 36000,
      fs: {
        strict: false,
      },
    },
    resolve: {
      // 别名
      alias: {
        '@root': resolve(__dirname, ''),
        '@': resolve(__dirname, 'src'),
      },
    },
    plugins: [vue()],
    build: {
      target: 'esnext',
      sourcemap: 'inline',
      // 自定义底层的 Rollup 打包配置。
      rollupOptions: {
        output: {
          // 入口文件名
          entryFileNames(chunkInfo) {
            return `assets/entry-${chunkInfo.type}-[name].js`;
          },
          // 块文件名
          chunkFileNames(chunkInfo) {
            return `assets/${chunkInfo.type}-[name].js`;
          },
          // 资源文件名，css、图片等
          assetFileNames(chunkInfo) {
            return `assets/${chunkInfo.type}-[name].[ext]`;
          },
        },
      },
    },
  };
});
