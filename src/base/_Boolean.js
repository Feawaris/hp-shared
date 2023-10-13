export class _Boolean {
  static FALSY = [0, '', null, undefined, NaN];
}
_Boolean.prototype[Symbol.toStringTag] = _Boolean.name;
