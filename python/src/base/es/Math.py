from .Number import Number
import math
import random

class Math:
  PI = math.pi
  E = math.e
  LN2 = math.log(2)
  LN10 = math.log(10)
  LOG2E = math.log2(math.e)
  LOG10E = math.log10(math.e)
  SQRT2 = math.sqrt(2)
  SQRT1_2 = math.sqrt(1 / 2)

  @staticmethod
  def abs(x):
    return abs(x)
  @staticmethod
  def min(*args):
    return min(args)
  @staticmethod
  def max(*args):
    return max(args)
  @staticmethod
  def random():
    return random.random()
  @staticmethod
  def sign(x):
    if (x > 0):
      return 1
    if (x < 0):
      return -1
    return x
  @staticmethod
  def hypot(*args):
    return math.hypot(*args)
  @staticmethod
  def clz32(x = 0):
    if x == 0:
      return 32
    return 32 - len(bin(x)[2:])
  @staticmethod
  def imul(a, b):
    return a * b
  @staticmethod
  def fround(x):
    return Number.parseFloat(x)

  @staticmethod
  def ceil(x):
    return math.ceil(x)
  @staticmethod
  def floor(x):
    return math.floor(x)
  @staticmethod
  def round(x):
    return round(x)
  @staticmethod
  def trunc(x):
    return math.trunc(x)

  @staticmethod
  def pow(x, y):
    return x ** y
  @staticmethod
  def sqrt(x):
    return x ** (1 / 2)
  def cbrt(x):
    return x ** (1 / 3)
  @staticmethod
  def exp(x):
    return math.exp(x)
  @staticmethod
  def expm1(x):
    return math.expm1(x)

  @staticmethod
  def log(x, base = math.e):
    return math.log(x, base)
  @staticmethod
  def log2(x):
    return math.log2(x)
  @staticmethod
  def log1p(x):
    return math.log1p(x)
  @staticmethod
  def log10(x):
    return math.log10(x)

  @staticmethod
  def sin(x):
    return math.sin(x)
  @staticmethod
  def cos(x):
    return math.cos(x)
  @staticmethod
  def tan(x):
    return math.tan(x)
  @staticmethod
  def asin(x):
    return math.asin(x)
  @staticmethod
  def acos(x):
    return math.acos(x)
  @staticmethod
  def atan(x):
    return math.atan(x)
  @staticmethod
  def sinh(x):
    return math.sinh(x)
  @staticmethod
  def cosh(x):
    return math.cosh(x)
  @staticmethod
  def tanh(x):
    return math.tanh(x)
  @staticmethod
  def asinh(x):
    return math.asinh(x)
  @staticmethod
  def acosh(x):
    return math.acosh(x)
  @staticmethod
  def atanh(x):
    return math.atanh(x)
  @staticmethod
  def atan2(y, x):
    return math.atan2(y, x)

__all__ = ['Math']
