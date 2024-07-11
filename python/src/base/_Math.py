from .es import Infinity, Math
from ._Number import _Number
import math
from functools import reduce

class _Math(Math):
  # 黄金分割比 PHI
  PHI = (Math.sqrt(5) - 1) / 2
  PHI_BIG = (Math.sqrt(5) + 1) / 2

  # 对数
  @staticmethod
  def log(a, x):
    return math.log(x, a)
  @staticmethod
  def loge(x):
    return math.log(x)
  @staticmethod
  def ln(x):
    return math.log(x)
  @staticmethod
  def lg(x):
    return math.log10(x)

  # 三角函数
  @staticmethod
  def arcsin(x):
    return math.asin(x)
  @staticmethod
  def arccos(x):
    return math.acos(x)
  @staticmethod
  def arctan(x):
    return math.atan(x)
  @staticmethod
  def arsinh(x):
    return math.asinh(x)
  @staticmethod
  def arcosh(x):
    return math.acosh(x)
  @staticmethod
  def artanh(x):
    return math.atanh(x)

  @staticmethod
  def factorial(n):
    return int(math.factorial(n))
  @staticmethod
  def A(n, m):
    return int(_Math.factorial(n) / _Math.factorial(n - m))
  @staticmethod
  def C(n, m):
    return int(_Math.A(n, m) / _Math.factorial(m))
# 数列
class Sequence:
  def __init__(self, n = 0):
    self.n = n
  def an(self, n):
    pass
  def Sn(self, n):
    pass
  def toArray(self, length = None):
    if length is None:
      length = self.n
    result = []
    for i in range(length):
      n = i + 1
      result.append(self.an(n))
    self.an(length)
    return result
  def toCustomArray(self, *args):
    pass
  def toSet(self, *args):
    pass
  def toCustomSet(self, *args):
    pass
# 等差数列
class ArithmeticSequence(Sequence):
  def __init__(self, a1, d, n = 0):
    super().__init__(n)
    self.a1 = a1  # 首项
    self.d = d  # 公差
  def an(self, n = None):
    if n is None:
      n = self.n
    return self.a1 + (n - 1) * self.d
  def Sn(self, n = None):
    if n is None:
      n = self.n
    return n / 2 * (self.a1 + self.an(n))
# 等比数列
class GeometricSequence(Sequence):
  def __init__(self, a1, q, n = 0):
    super().__init__(n)
    self.a1 = a1  # 首项
    self.q = q  # 公比
  def an(self, n = None):
    if n is None:
      n = self.n
    return self.a1 * self.q ** (n - 1)
  def Sn(self, n = None):
    if n is None:
      n = self.n
    if (self.q == 1):
      return n * self.a1
    return self.a1 * (1 - self.q ** n) / (1 - self.q)
  pass
# 斐波那契数列
class FibonacciSequence(Sequence):
  def __init__(self, n = 0):
    super().__init__(n)
  def an(self, n = None):
    if n is None:
      n = self.n
    return Math.round((_Math.PHI_BIG ** n - (1 - _Math.PHI_BIG) ** n) / Math.sqrt(5))

  def Sn(self, n = None):
    if n is None:
      n = self.n
    return self.an(n + 2) - 1
# 素数数列
class PrimeSequence(Sequence):
  def __init__(self, max = Infinity, n = 0):
    super().__init__(n)
    self.max = max
  def toArray(self, max = None, n = None):
    if max is None:
      max = self.max
    if n is None:
      n = self.n
    if 0 < max < Infinity:
      n = Infinity
    elif n > 0:
      max = Infinity

    result = []
    value = 2
    while value <= max and len(result) < n:
      if _Number.isPrime(value):
        result.append(value)
      value += 1
    return result
  def an(self, n):
    if n is None:
      n = self.n
    return self.toArray(n = n)[n - 1]
  def Sn(self, n):
    if n is None:
      n = self.n
    return reduce(lambda total, val: total + val, self.toArray(n = n))
_Math.Sequence = Sequence
_Math.ArithmeticSequence = ArithmeticSequence
_Math.GeometricSequence = GeometricSequence
_Math.FibonacciSequence = FibonacciSequence
_Math.PrimeSequence = PrimeSequence

__all___ = ['_Math']
