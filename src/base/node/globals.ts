import { BaseEnv } from '../base';

interface ImportMeta {
  url: string;
  resolve?: Function;
}
interface NodeGlobals {
  __filename: string;
  __dirname: string;
}
export function useNodeGlobals(importMeta?: ImportMeta): NodeGlobals {
  if (BaseEnv.isBrowser) {
    try {
      return {
        __filename: importMeta.url,
        __dirname: importMeta.url.slice(0, importMeta.url.lastIndexOf('/')),
      };
    }catch (e) {}
  }
  if (BaseEnv.isWx) {
    const pages = getCurrentPages();
    const page = pages[pages.length - 1];
    return {
      __filename: page.route,
      __dirname: page.route.slice(0, page.route.lastIndexOf('/')),
    };
  }
  if (BaseEnv.isNode) {
    // node 无需
  }
  return {
    __filename: '',
    __dirname: '.',
  };
}
