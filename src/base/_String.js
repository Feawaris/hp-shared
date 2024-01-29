export class _String extends String {
  /**
   * [新增] 首字母大写
   * @param name
   * @returns {string}
   */
  static toFirstUpperCase(name = '') {
    return `${(name[0] ?? '').toUpperCase()}${name.slice(1)}`;
  }
  /**
   * [新增] 首字母小写
   * @param name 名称
   * @returns {string}
   */
  static toFirstLowerCase(name = '') {
    return `${(name[0] ?? '').toLowerCase()}${name.slice(1)}`;
  }
  /**
   * [新增] 转驼峰命名。常用于连接符命名转驼峰命名，如 xx-name -> xxName
   * @param name 名称
   * @param separator 连接符。用于生成正则 默认为中划线 - 对应regexp得到 /-(\w)/g
   * @param first 首字母处理方式。true 或 'uppercase'：转换成大写;
   *                           false 或 'lowercase'：转换成小写;
   *                           'raw' 或 其他无效值：默认原样返回，不进行处理;
   * @returns {MagicString|string|string}
   */
  static toCamelCase(name, { separator = '-', first = 'raw' } = {}) {
    // 生成正则
    const regexp = new RegExp(`${separator}(\\w)`, 'g');
    // 拼接成驼峰
    const camelName = name.replaceAll(regexp, (substr, $1) => {
      return $1.toUpperCase();
    });
    // 首字母大小写根据传参判断
    if ([true, 'uppercase'].includes(first)) {
      return this.toFirstUpperCase(camelName);
    }
    if ([false, 'lowercase'].includes(first)) {
      return this.toFirstLowerCase(camelName);
    }
    return camelName;
  }
  /**
   * [新增] 转连接符命名。常用于驼峰命名转连接符命名，如 xxName -> xx-name
   * @param name 名称
   * @param separator 连接符
   * @returns {string}
   */
  static toLineCase(name = '', { separator = '-' } = {}) {
    return name
    // 按连接符拼接
      .replaceAll(/([a-z])([A-Z])/g, `$1${separator}$2`)
    // 转小写
      .toLowerCase();
  }

  /**
   * constructor
   */
  constructor(value) {
    super(value);
  }

  // [Symbol.iterator] 继承
  // length 继承
  // split 继承
  // match 继承
  // matchAll 继承

  // at 继承
  // charAt 继承
  // charCodeAt 继承
  // codePointAt 继承
  // indexOf 继承
  // lastIndexOf 继承
  // search 继承
  // includes 继承
  // startsWith 继承
  // endsWith 继承

  // slice 继承
  // substring 继承
  // substr 继承
  // concat 继承
  // trim 继承
  // trimStart 继承
  // trimEnd 继承
  // trimLeft 继承
  // trimRight 继承
  // padStart 继承
  // padEnd 继承
  // repeat 继承
  // replace 继承
  // replaceAll 继承
  // toLowerCase 继承
  // toUpperCase 继承
  // toLocaleLowerCase 继承
  // toLocaleUpperCase 继承
  // localeCompare 继承
  // normalize 继承
  // isWellFormed 继承
  // toWellFormed 继承

  // toString 继承
  // valueOf 继承
}
