import { _Object } from './_Object';

// 专注于 JSON 支持的类型：`null`,`number`,`string`,`boolean`,`array`,`object`，前后端数据交互用
export const _JSON = Object.create(JSON);
// 判断类型
_JSON.typeof = function (value) {
  if ([null, undefined].includes(value)) {
    return 'null';
  }
  if (Array.isArray(value)) {
    return 'array';
  }
  const type = typeof value;
  if (value !== null && ['number', 'string', 'boolean', 'object'].includes(type)) {
    return type;
  }
  // 其他 JSON 不转换的视为无效值
  return '';
};
_JSON.DataModel = class {
  /**
   *
   * @param model 数据模型，同时作为默认值和类型推导用
   * @param type 数据类型，无法根据 model 推导或特殊情况时显式指定
   * @param nullDefaultType model 传 null 时默认推导类型，默认给常用的 number
   * @param isObjectList 显式声明 [{...}] 格式为列表
   * @param enableObjectListDeep 当前和嵌套中的 [{...}] 格式是否理解为列表来处理，默认设置成 true 常用
   * @returns {{}|*[]}
   */
  constructor(model, { type, nullDefaultType = 'number', isObjectList = null, enableObjectListDeep = true } = {}) {
    // DataModel 对象直接合并即可，不用拆解
    if (model instanceof _JSON.DataModel) {
      _Object.assign(this, model);
      return;
    }

    // type
    if (!type) {
      if (model === null) {
        // default 为 null 时的默认行为
        type = nullDefaultType;
      } else {
        // type 推导
        type = _JSON.typeof(model);
      }
    }
    this.type = type;

    // 共用选项收集，递归传参用
    const commonOptions = { nullDefaultType, enableObjectListDeep };
    if (type === 'array') {
      isObjectList = isObjectList ?? (enableObjectListDeep && (model.length === 1 && _JSON.typeof(model[0]) === 'object'));
      this.isObjectList = isObjectList;

      this.children = model.map(value => new _JSON.DataModel(value, commonOptions));

      _Object.assign(this, {
        get default() {
          return this.isObjectList ? [] : this.children.map(child => child.default);
        },
      });
    } else if (type === 'object') {
      this.children = Object.fromEntries(Object.entries(model).map(([key, value]) => {
        return [key, new _JSON.DataModel(value, commonOptions)];
      }));

      _Object.assign(this, {
        get default() {
          return Object.fromEntries(Object.entries(this.children).map(([name, child]) => {
            return [name, child.default];
          }));
        },
      });
    } else {
      this.default = model;
    }
  }
};
// 简写方式
_JSON.model = function (...args) {
  return new _JSON.DataModel(...args);
};
_JSON.number = function (model, options = {}) {
  return new _JSON.DataModel(model, { type: 'number', ...options });
};
_JSON.string = function (model, options = {}) {
  return new _JSON.DataModel(model, { type: 'string', ...options });
};
_JSON.boolean = function (model, options = {}) {
  return new _JSON.DataModel(model, { type: 'boolean', ...options });
};
_JSON.array = function (model, options = {}) {
  return new _JSON.DataModel(model, { type: 'array', ...options });
};
_JSON.object = function (model, options = {}) {
  return new _JSON.DataModel(model, { type: 'object', ...options });
};
