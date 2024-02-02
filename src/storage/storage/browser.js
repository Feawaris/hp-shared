// web storage

function createCustomStorage(webStorage) {
  const customStorage = Object.create(webStorage);
  customStorage.setItem = function(key, value, { json = true } = {}) {
    // undefined 转为 null 存储
    if (value === undefined) {
      value = null;
    }
    value = json ? JSON.stringify(value) : value;
    webStorage.setItem(key, value);
  };
  customStorage.getItem = function(key, { json = true, defaultValue = null } = {}) {
    const text = webStorage.getItem(key);
    return json ? (() => {
      try {
        return JSON.parse(text);
      } catch (e) {
        return defaultValue;
      }
    })() : text;
  };
  return customStorage;
}
export const _sessionStorage = createCustomStorage(sessionStorage);
export const _localStorage = createCustomStorage(localStorage);
