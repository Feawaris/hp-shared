/**
 * [vuepress](https://v2.vuepress.vuejs.org/zh/)
 * [vuepress-theme-hope](https://theme-hope.vuejs.press/zh/)
 */
import { _console } from 'hp-shared/base';
import { defineUserConfig } from 'vuepress';
import { hopeTheme } from 'vuepress-theme-hope';
import { viteBundler } from '@vuepress/bundler-vite';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sourceDir = path.resolve(__dirname, '..');
const rootDir = path.resolve(sourceDir, '..');
_console.log({ rootDir, sourceDir });

export default defineUserConfig({
  /**
   * 站点配置
   */
  base: '/hp-shared/',
  lang: 'zh-CN',
  title: 'hp-shared',
  description: '基础库',
  head: [['link', { rel: 'icon', href: '/static/logo.jpg' }]],
  locales: {},

  /**
   * 主题配置
   */
  theme: hopeTheme(
    {
      /**
       * 主题基本选项
       */
      // hostname:'',
      author: [
        {
          name: 'hp',
          url: '',
          email: '',
        },
      ],
      license: 'MIT',
      favicon: '/static/logo.jpg',
      locales: {},
      extraLocales: {},
      hotReload: true,

      /**
       * 主题功能选项
       */
      // blog: {},
      encrypt: {
        global: false,
        admin: [],
        config: {},
      },

      /**
       * 主题布局选项
       */
      /**
       * 导航栏
       */
      navbar: [{ text: 'README', link: '/' }],
      navbarIcon: true,
      navbarLayout: {
        start: ['Brand'],
        center: ['Links'],
        end: ['Language', 'Repo', 'Outlook', 'Search'],
      },
      logo: '/static/logo.jpg',
      get logoDark() {
        return this.logo;
      },
      // navTitle: $siteLocale.title,
      repo: 'https://github.com/Feawaris/hp-shared',
      repoDisplay: true,
      repoLabel: true,
      navbarAutoHide: 'none',
      hideSiteNameOnMobile: false,
      /**
       * 侧边栏
       */
      sidebar: [{ text: 'README', link: '/' }],
      sidebarIcon: true,
      sidebarSorter: ['readme', 'order', 'title', 'filename'],
      headerDepth: Infinity,
      /**
       * 路径导航
       */
      breadcrumb: true,
      breadcrumbIcon: true,
      prevLink: true,
      nextLink: true,
      /**
       * 标题
       */
      titleIcon: true,
      pageInfo: ['Word', 'ReadingTime', 'PageView', 'Category', 'Tag', 'Author', 'Date'],
      /**
       * Meta
       */
      lastUpdated: true,
      contributors: true,
      editLink: false,
      // editLinkPattern: '',
      get docsRepo() {
        return this.repo;
      },
      docsBranch: 'main',
      docsDir: '',
      /**
       * 页脚
       */
      footer: '结束',
      copyright: 'Copyright © hp',
      displayFooter: true,
      /**
       * 杂项
       */
      rtl: false,
      // home: '',
      toc: true,

      /**
       * 主题外观选项
       */
      // iconAssets: [],
      darkmode: 'toggle',
      fullscreen: true,
      pure: false,
      print: true,
      // iconPrefix: '',

      /**
       * 插件配置
       */
      plugins: {
        /**
         * 内置插件
         * 下列插件被内部调用，不可禁用:
         */
        // @vuepress/plugin-theme-data
        themeData: {},
        // vuepress-plugin-components
        components: {
          components: [
            // 代码组件
            'CodePen',
            // 内容组件
            'SiteInfo',
            'VPBanner',
            'VPCard',
            // 媒体组件
            'VidStack',
            'BiliBili',
            'PDF',
            // 工具组件
            'Badge',
            'FontIcon',
            'Share',
          ],
          componentsOptions: {},
          rootComponents: {
            notice: [],
          },
        },
        // vuepress-plugin-sass-palette
        sassPalette: {},

        /**
         * 自动启用的插件
         * 下列插件默认启用，你可以禁用它们:
         */
        // @vuepress/plugin-active-header-links
        activeHeaderLinks: {},
        // @vuepress/external-link-icon
        externalLinkIcon: {},
        // @vuepress/plugin-catalog
        /* catalog: {
          title: '',
          level: 3,
          index: true,
        }, */
        // @vuepress/plugin-copy-code
        copyCode: {
          showInMobile: true,
        },
        // @vuepress/plugin-git
        git: {},
        // @vuepress/plugin-nprogress
        nprogress: {},
        // @vuepress/plugin-photo-swipe
        photoSwipe: {},
        // @vuepress/plugin-prismjs
        prismjs: {
          preloadLanguages: ['markdown', 'jsdoc', 'yaml', 'js', 'vue'],
          light: 'one-light',
          dark: '',
        },
        // @vuepress/plugin-reading-time
        readingTime: {
          wordPerMinute: 300,
        },
        // @vuepress/plugin-seo
        seo: {},
        // @vuepress/plugin-sitemap
        sitemap: {},
        // vuepress-plugin-md-enhance
        mdEnhance: {
          /**
           * 语法
           */
          katex: true,
          // mathjax: true,
          sub: true,
          sup: true,
          tasklist: {
            disabled: true,
            label: true,
          },
          figure: true,
          imgLazyload: true,
          imgMark: true,
          imgSize: true,
          obsidianImgSize: false,

          /**
           * 内容
           */
          include: {
            // resolvePath: (path) => path,
            deep: true,
          },
          revealJs: false,
          component: true,
          footnote: true,
          tabs: true,

          /**
           * 样式化
           */
          alert: true,
          attrs: true,
          hint: true,
          mark: true,
          stylize: [],
          align: true,

          /**
           * 图表
           */
          chart: true,
          echarts: true,
          markmap: true,
          mermaid: true,
          flowchart: true,

          /**
           * 代码
           */
          kotlinPlayground: true,
          sandpack: true,
          vuePlayground: true,
          playground: {},
          codetabs: true,
          demo: {
            jsLib: [],
            cssLib: [],
            jsfiddle: true,
            codepen: true,
            codepenLayout: 'left',
            codepenEditors: '101',
            editors: '101',
            // babel: 'https://unpkg.com/@babel/standalone/babel.min.js',
            // vue: 'https://unpkg.com/vue/dist/vue.global.prod.js',
            // react: 'https://unpkg.com/react/umd/react.production.min.js',
            // reactDOM: 'https://unpkg.com/react-dom/umd/react-dom.production.min.js',
          },

          /**
           * 其他
           */
          gfm: true,
          breaks: false,
          vPre: true,
          delay: 800,
          locales: {},
        },
        // @vuepress/plugin-back-to-top
        backToTop: {
          threshold: 100,
          progress: true,
        },

        /**
         * 需要手动启用的插件
         * 主题捆绑以下插件，你可以通过配置启用它们
         */
        // @vuepress/plugin-blog
        // @vuepress/plugin-copyright
        // @vuepress/plugin-comment

        /**
         * 内置支持的插件
         * 以下插件受到主题支持，但你需要在使用前自行安装它们:
         */
        // @vuepress/plugin-docsearch
        docsearch: {},
        // @vuepress/plugin-search
        // @vuepress/plugin-feed
        // @vuepress/plugin-redirect
        // @vuepress/plugin-pwa
        // vuepress-plugin-search-pro
      },
    },
    {
      check: true,
      compact: true,
      custom: false,
      debug: false,
    },
  ),

  /**
   * 打包工具配置
   */
  bundler: viteBundler({
    viteOptions: {},
    vuePluginOptions: {},
  }),

  /**
   * 通用配置项
   */
  dest: `${rootDir}/dist/docs`,
  temp: `${sourceDir}/.vuepress/.temp`,
  cache: `${sourceDir}/.vuepress/.cache`,
  public: `${sourceDir}/.vuepress/public`,
  debug: false,
  pagePatterns: ['**/*.md', '!.vuepress', '!node_modules'],
  permalinkPattern: null,

  /**
   * Dev 配置项
   */
  host: '0.0.0.0',
  port: 9000,
  open: false,
  // templateDev: '@vuepress/client/templates/dev.html',

  /**
   * Build 配置项
   */
  shouldPreload: true,
  shouldPrefetch: true,
  // templateBuild: '@vuepress/client/templates/build.html',
  // templateBuildRenderer: templateRenderer,

  /**
   * Markdown 配置
   */
  markdown: {},

  /**
   * 插件配置
   */
  plugins: [],
});
