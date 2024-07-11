from .es import Number, Math, parseInt
from ._Object import _Object

class _Number(Number):
  @staticmethod
  def convertBase(x, options = { }, _from = 10, to = 10) -> str:
    options = _Object(options)
    _from = options['from'] or _from
    to = options['to'] or to

    x = parseInt(x, _from)
    if to == 2:
      return format(x, 'b')
    elif to == 8:
      return format(x, 'o')
    elif to == 16:
      return format(x, 'x')
    else:
      # 对于十进制以外的其他进制，需要手动转换
      result = ''
      while x > 0:
        remainder = x % to
        result = str(remainder) + result
        x = x // to
      return result or '0'
  @staticmethod
  def isPrime(x) -> bool:
    if x <= 1:
      return False
    if x == 2:
      return True
    if x % 2 == 0:
      return False
    for i in range(3, parseInt(Math.sqrt(x)) + 1, 2):
      if x % i == 0:
        return False
    return True

  def toMaxFixed(x, fractionDigits = 0) -> str:
    # 创建格式化字符串
    format_str = f"{{:.{fractionDigits}f}}"
    # 格式化数字
    str_x = format_str.format(x)
    # 移除尾部多余的零和小数点
    return str_x.rstrip('0').rstrip('.') if '.' in str_x else str_x

__all__ = ['_Number']
