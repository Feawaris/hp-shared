/**
 * [VuePress 配置](https://v2.vuepress.vuejs.org/zh/reference/config.html)
 * [VuePress Theme Hope 配置](https://theme-hope.vuejs.press/zh/config/intro.html)
 */
import { _console } from 'hp-shared';
import pkg from 'hp-shared/package.json' assert { type: 'json' };
import path from 'node:path';
import { defineUserConfig } from 'vuepress';
import { hopeTheme } from 'vuepress-theme-hope';
import { viteBundler } from '@vuepress/bundler-vite';

const docsDir = path.resolve(__dirname, '..');
const rootDir = path.resolve(docsDir, '..');
_console.log({ rootDir, docsDir });
// _console.log('process.env: ', process.env, process.env.vuepress_to);
export default defineUserConfig({
  /**
   * 站点配置
   */
  base: {
    local: '/',
    github: `/${pkg.name}/`,
    npm: `/${pkg.name}@${pkg.version}/docs/.vuepress/dist/`,
  }[process.env.vuepress_to || 'local'],
  lang: 'zh-CN',
  title: pkg.name,
  description: pkg.description,
  head: [
    ['link', { rel: 'icon', href: '/static/logo.jpg' }],
    ['script', { src: 'https://unpkg.com/hp-shared/dist/browser/index.umd.js', async: true }],
    ['script', { src: 'https://unpkg.com/hp-shared/dist/browser/index-tampermonkey.js', async: true }],
  ],
  locales: {},

  /**
   * 主题配置
   */
  theme: hopeTheme(
    /**
     * 主题选项
     */
    {
      /**
       * 主题基本选项
       */
      // hostname:'',
      author: [
        { name: 'hp', url: '', email: '' },
      ],
      license: pkg.license,
      favicon: '/static/logo.jpg',
      locales: {},
      extraLocales: {},
      hotReload: true,
      iconAssets: 'fontawesome',

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
      navbar: [
        {
          text: '链接',
          icon: 'link',
          children: [
            {
              text: '安装包',
              children: [
                { text: 'npm 包', link: 'https://www.npmjs.com/package/hp-shared' },
                { text: 'ohpm 包', link: 'https://ohpm.openharmony.cn/#/cn/detail/hp-shared' },
                { text: 'pip 包', link: 'https://pypi.org/project/hp-shared/' },
                { text: 'tampermonkey 包', link: 'https://greasyfork.org/zh-CN/scripts/497270-hp-shared' },
              ],
            },
            {
              text: 'CDN',
              children: [
                { text: 'unpkg', link: 'https://unpkg.com/hp-shared' },
                { text: 'jsdelivr', link: 'https://cdn.jsdelivr.net/npm/hp-shared' },
              ],
            },
            {
              text: '仓库',
              children: [
                { text: 'github 仓库', link: 'https://github.com/Feawaris/hp-shared' },
                { text: 'gitee 仓库', link: 'https://gitee.com/Feawaris/hp-shared' },
              ],
            },
          ],
        },
      ],
      navbarLayout: {
        start: ['Brand'],
        center: ['Links'],
        end: ['Language', 'Repo', 'Outlook', 'Search'],
      },
      logo: '/static/logo.jpg',
      /*get logoDark() {
        return this.logo;
      },*/
      // navbarTitle: $siteLocale.title,
      repo: 'https://github.com/Feawaris/hp-shared',
      // repoDisplay: true,
      // repoLabel: '',
      navbarAutoHide: 'none',
      hideSiteNameOnMobile: false,
      /**
       * 侧边栏
       */
      // sidebar: "structure",
      // sidebarSorter: ['readme', 'order', 'title', 'filename'],
      headerDepth: 6,
      /**
       * 路径导航
       */
      // breadcrumb: true,
      // breadcrumbIcon: true,
      // prevLink: true,
      // nextLink: true,
      /**
       * 标题
       */
      // titleIcon: true,
      pageInfo: ['Word', 'ReadingTime', 'Tag'],
      /**
       * Meta
       */
      // lastUpdated: true,
      // contributors: true,
      editLink: false,
      // editLinkPattern: '',
      /*get docsRepo() {
        return this.repo;
      },*/
      docsBranch: 'main',
      // docsDir: '',
      /**
       * 页脚
       */
      footer: '',
      copyright: 'Copyright © hp',
      displayFooter: true,
      /**
       * 杂项
       */
      // home: '',
      // rtl: false,
      // toc: true,

      /**
       * 主题外观选项
       */
      // iconAssets: [],
      darkmode: 'toggle',
      // externalLinkIcon: true,
      fullscreen: true,
      // pure: false,
      // print: true,
      // iconPrefix: '',

      /**
       * 主题多语言选项
       */

      /**
       * 插件配置
       */
      plugins: {
        // 插件配置 -> 主题插件
        /**
         * 内置插件
         * 下列插件被内部调用，不可禁用:
         */
        // @vuepress/plugin-sass-palette
        sassPalette: {},
        // @vuepress/plugin-theme-data
        themeData: {},
        // vuepress-plugin-components
        components: {
          /*components: [
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
          },*/
        },

        /**
         * 自动启用的插件
         * 下列插件默认启用，你可以禁用它们:
         */
        // @vuepress/plugin-active-header-links
        // activeHeaderLinks: {},
        // @vuepress/plugin-back-to-top
        backToTop: {
          // threshold: 100,
          // progress: true,
        },
        // @vuepress/plugin-catalog
        catalog: {
          index: true,
        },
        // @vuepress/plugin-copy-code
        copyCode: {
          showInMobile: true,
        },
        // @vuepress/plugin-git
        git: {},
        // @vuepress/plugin-links-check
        linksCheck: {},
        // @vuepress/plugin-nprogress
        // nprogress: {},
        // @vuepress/plugin-photo-swipe
        photoSwipe: {},
        // @vuepress/plugin-reading-time
        readingTime: {
          wordPerMinute: 300,
        },
        // @vuepress/plugin-seo
        seo: {},
        // @vuepress/plugin-shiki
        shiki: {
          langs: ['md','html','css','scss', 'js', 'ts', 'py', 'sh'],
          theme: 'nord',
          themes: {
            light: 'everforest-light',
            dark: 'nord',
          },
          lineNumbers: true,
          highlightLines: true,
          notationDiff: true,
          notationFocus: true,
          notationHighlight: true,
          notationErrorLevel: true,
          notationWordHighlight: true,
          whitespace: false,
        },
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
          tasklist: true,
          figure: true,
          imgLazyload: true,
          imgMark: true,
          imgSize: true,

          /**
           * 内容
           */
          include: true,
          revealJs: false,
          component: true,
          footnote: true,
          tabs: true,

          /**
           * 样式化
           */
          alert: true,
          spoiler: true,
          attrs: true,
          hint: true,
          mark: true,
          stylize: [],
          align: true,

          /**
           * 图表
           */
          // chart: true,
          // echarts: true,
          // markmap: true,
          // mermaid: true,
          // plantuml: true,
          // flowchart: true,

          /**
           * 代码
           */
          // kotlinPlayground: true,
          // sandpack: true,
          // vuePlayground: true,
          playground: {},
          codetabs: true,
          // demo: true,

          /**
           * 其他
           */
          gfm: true,
          vPre: true,
        },

        /**
         * 需要手动启用的插件
         * 主题捆绑以下插件，你可以通过配置启用它们
         */
        // @vuepress/plugin-blog
        // @vuepress/plugin-copyright
        // @vuepress/plugin-comment
        // @vuepress/plugin-notice
        // @vuepress/plugin-rtl
        // @vuepress/plugin-watermark

        /**
         * 内置支持的插件
         * 以下插件受到主题支持，但你需要在使用前自行安装它们:
         */
        // @vuepress/plugin-docsearch
        docsearch: {
          apiKey: 'e6e80d21728b1b7b7c5a608c06cc1c41',
          indexName: 'feawarisio',
          appId: 'XJIF4AN787',
        },
        // @vuepress/plugin-search
        // @vuepress/plugin-feed
        // @vuepress/plugin-prismjs
        // @vuepress/plugin-redirect
        // @vuepress/plugin-pwa
        // vuepress-plugin-search-pro
      },
    },

    /**
     * 主题行为选项 (可选)
     */
    {
      // check: true,
      // compact: true,
      // custom: false,
      // debug: false,
    },
  ),

  /**
   * 打包工具配置
   */
  bundler: viteBundler({
    viteOptions: {
      cacheDir: `${docsDir}/node_modules/.vite`,
    },
    vuePluginOptions: {},
  }),

  /**
   * 通用配置项
   */
  dest: `${docsDir}/.vuepress/dist`,
  temp: `${docsDir}/.vuepress/.temp`,
  cache: `${docsDir}/.vuepress/.cache`,
  public: `${docsDir}/.vuepress/public`,
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
  markdown: {
    headers: {
      level: [1, 2, 3, 4, 5, 6],
    },
  },

  /**
   * 插件配置
   */
  plugins: [],
});
