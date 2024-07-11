import math
import re

class Number(float):
  # static
  NaN = float('nan')
  POSITIVE_INFINITY = float('inf')
  NEGATIVE_INFINITY = float('-inf')
  MAX_VALUE = 2 ** 1024 - 1
  MIN_VALUE = 2 ** -1074
  MAX_SAFE_INTEGER = 2 ** 53 - 1
  MIN_SAFE_INTEGER = -(2 ** 53 - 1)
  EPSILON = 2 ** -52

  @staticmethod
  def isNaN(x) -> bool:
    return math.isnan(x)
  @staticmethod
  def isFinite(x) -> bool:
    return math.isfinite(x)
  @staticmethod
  def isInteger(x) -> bool:
    return isinstance(x, int) or (isinstance(x, float) and x.is_integer())
  @staticmethod
  def isSafeInteger(x) -> bool:
    return Number.isInteger(x) and Number.MIN_SAFE_INTEGER <= x <= Number.MAX_SAFE_INTEGER
  @staticmethod
  def parseInt(x, base = 10) -> int | None:
    if (isinstance(x, bool)):
      return 1 if x else 0
    x = str(x)

    match = re.match(r'(-?[0-9a-f]+)' if base == 16 else r'(-?\d+)', x)
    if match:
      if base == 16 and x.lower().startswith(('0x', '0X')):
        return int(x, 16)
      else:
        return int(match.group(1), base)
    else:
      return None
  @staticmethod
  def parseFloat(x) -> float | None:
    if (isinstance(x, bool)):
      return 1.0 if x else 0.0
    x = str(x)
    match = re.match(r'((-?\d+)(\.\d+)?)', x)
    if match:
      return float(match.group(1), )
    else:
      return None

  def __new__(cls, value = 0):
    value = Number.parseFloat(value)
    instance = super().__new__(cls, value)
    return instance

  def toExponential(self, fractionDigits = None) -> str:
    return f'{self:e}' if fractionDigits is None else f'{self:.{fractionDigits}e}'
  def toPrecision(self, precision = None) -> str:
    return f'{self}' if precision is None else f'{self:.{precision}g}'
  def toFixed(x, fractionDigits = 0) -> str:
    return f"{x:.{fractionDigits}f}"

__all__ = ['Number']
