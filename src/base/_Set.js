/**
 * 加强add方法。跟数组push方法一样可添加多个值
 * @param set {Set} 目标set
 * @param args {*[]} 多个值
 */
export function add(set, ...args) {
  for (const arg of args) {
    set.add(arg);
  }
}
