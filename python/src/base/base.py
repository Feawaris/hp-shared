from typing import Type
import platform
from urllib.parse import quote, unquote
import math
import random
import re
from datetime import datetime, timezone
import os
import sys


NaN: float = float('nan')
Infinity: float = float('inf')

def typeof(value) -> str:
  if value is None:
    return 'null'
  if isinstance(value, str):
    return 'string'
  # python 中 bool 继承自 int，先判断 bool
  if isinstance(value, bool):
    return 'boolean'
  if (isinstance(value, (int, float))):
    return 'number'
  return 'object'

def isNaN(x) -> bool:
  return Number.isNaN(x)
def isFinite(x) -> bool:
  return Number.isFinite(x)
def parseInt(x, base=10) -> int | None:
  return Number.parseInt(x, base)
def parseFloat(x) -> float | None:
  return Number.parseFloat(x)

def encodeURI(uri: str) -> str:
  return quote(uri, safe=':/@?=&#')
def encodeURIComponent(uri: str) -> str:
  return quote(uri, safe='')
def decodeURI(uri: str) -> str:
  return unquote(uri, )
def decodeURIComponent(uri: str) -> str:
  return unquote(uri, )

class Array(list):
  @staticmethod
  def isArray(value):
    return isinstance(value, list)
  @staticmethod
  def _from(value):
    return list(value)
  def fromAsync(value):
    return list(value)
  @staticmethod
  def of(*value):
    return list(value)

  def __init__(self, value):
    super().__init__(value)
  @property
  def length(self):
    return len(self)
class Date():
  @staticmethod
  def now():
    return datetime.now().timestamp() * 1000
  @staticmethod
  def parse(s):
    return datetime.strptime(s, '%Y-%m-%d %H:%M:%S').timestamp() * 1000
  @staticmethod
  def UTC(year=1970, monthIndex=0, day=1, hour=0, minute=0, second=0, millisecond=0):
    return datetime(year, monthIndex + 1, day, hour, minute, second, millisecond * 1000, tzinfo=timezone.utc).timestamp() * 1000

  def getTime(self):
    pass
  def getTimezoneOffset(self):
    pass
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
  def clz32(x=0):
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
  def log(x, base=math.e):
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
  def parseInt(x, base=10) -> int | None:
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

  def __new__(cls, value=0):
    value = Number.parseFloat(value)
    instance = super().__new__(cls, value)
    return instance

  def toExponential(self, fractionDigits=None) -> str:
    return f'{self:e}' if fractionDigits is None else f'{self:.{fractionDigits}e}'
  def toPrecision(self, precision=None) -> str:
    return f'{self}' if precision is None else f'{self:.{precision}g}'
  def toFixed(x, fractionDigits=0) -> str:
    return f"{x:.{fractionDigits}f}"
class Object:
  @staticmethod
  def create(dic: dict | Type['Object'] | None) -> Type['Object']:
    return Object(dic)
  @staticmethod
  def fromEntries(entries: list) -> Type['Object']:
    obj = {}
    for key, value in entries:
      obj[key] = value
    return Object({key: value for key, value in obj.items()})
  @staticmethod
  @staticmethod
  def keys(obj: dict) -> list:
    return obj.keys()
  @staticmethod
  def values(obj: dict) -> list:
    return obj.values()
  @staticmethod
  def entries(obj: dict) -> list:
    return obj.items()

  @staticmethod
  def assign(target: dict = {}, *sources) -> dict:
    for source in sources:
      target.update(source)
    return target

  def __init__(self, data: dict = {}):
    if data is None:
      data = {}
    data = {key: type(self)(value) if isinstance(value, dict) else value for key, value in data.items()}
    self.__dict__.update(data)

  # 统一 .写法 和 []写法 的操作
  # .写法
  def __getattr__(self, key):
    try:
      return self.__dict__[key]
    except KeyError:
      return None
  def __setattr__(self, key, value):
    self.__dict__[key] = value
  def __delattr__(self, key):
    # print('__delattr__:', key)
    try:
      del self.__dict__[key]
    except KeyError:
      pass
  # []写法
  def __getitem__(self, key):
    try:
      return self.__dict__[key]
    except KeyError:
      return None
  def __setitem__(self, key, value):
    self.__dict__[key] = value
  def __delitem__(self, key):
    try:
      del self.__dict__[key]
    except KeyError:
      pass

  def __repr__(self):
    return f'{self.__class__.__name__}({self.__dict__})'
  # def __str__(self):
  #   # 定义一个辅助函数来递归处理字典
  #   def stringify_dict(dic):
  #     return ','.join([f'{key}:{stringify_value(item)}' for key, item in dic.items()])
  #   # 辅助函数来处理值，如果是Object实例则调用其__str__方法
  #   def stringify_value(value):
  #     if isinstance(value, type(self)):
  #       return str(value)  # 递归处理嵌套的Object实例
  #     return str(value)  # 对于非Object实例，直接转换为字符串
  #   return '{' + stringify_dict(self.__dict__) + '}'
  def __eq__(self, other):
    return isinstance(other, Object) and self.__dict__ == other.__dict__

  def items(self):
    return self.__dict__.items()
  def update(self, *args, **kwargs):
    return self.__dict__.update(*args, **kwargs)
class Set(set):
  def __init__(self, value):
    super().__init__(value)
  @property
  def size(self):
    return len(self)
class String(str):
  @staticmethod
  def fromCharCode(*codes):
    return ''.join(chr(code) for code in codes)
  @staticmethod
  def fromCodePoint(*codes):
    return ''.join(chr(code) for code in codes)
  @staticmethod
  def raw(string):
    return repr(string).strip('\'"')

  def __new__(cls, *args):
    return super(String, cls).__new__(cls, *args)

  @property
  def length(self):
    return len(self)
  def split(self, sep=None, maxsplit=-1):
    if sep is None:
      return [self]
    if sep == '':
      return list(self)
    return super().split(sep, maxsplit)
  def match(self, pattern):
    return re.search(pattern, self)
  def matchAll(self, pattern):
    return list(re.finditer(pattern, self))

  def at(self, index):
    if index < 0:
      index += len(self)
    if index >= len(self) or index < -len(self):
      return ''
    return self[index]
  def charAt(self, index):
    if 0 <= index < len(self):
      return self[index]
    return ''
  def charCodeAt(self, index):
    if 0 <= index < len(self):
      return ord(self[index])
    return None  # JavaScript returns xNaN, Python equivalent could be None
  def codePointAt(self, index):
    if 0 <= index < len(self):
      return ord(self[index])
    return None
  def indexOf(self, sub, start=0):
    return self.find(sub, start)
  def lastIndexOf(self, sub, start=0):
    return self.rfind(sub, 0, start)
  def search(self, pattern):
    match = re.search(pattern, self)
    return match.start() if match else -1
  def includes(self, substring, start=0):
    return substring in self[start:]
  def startsWith(self, substring, start=0):
    return self.startswith(substring, start)
  def endsWith(self, substring, end=None):
    return self.endswith(substring, 0, end)

  def slice(self, start=0, end=None):
    if end is None:
      return self[start:]
    return self[start:end]
  def concat(self, *args):
    return self + ''.join(args)
  def trim(self):
    return self.strip()
  def trimStart(self):
    return self.lstrip()
  def trimEnd(self):
    return self.rstrip()
  def padStart(self, target_length, pad_string=' '):
    return self.rjust(target_length, pad_string)
  def padEnd(self, target_length, pad_string=' '):
    return self.ljust(target_length, pad_string)
  def repeat(self, times):
    return self * times
  def replace(self, old, new, count=1):
    return super().replace(old, new, count)
  def replaceAll(self, old, new, count=-1):
    return super().replace(old, new, count)
  def toLowerCase(self):
    return self.lower()
  def toUpperCase(self):
    return self.upper()
  def toLocaleLowerCase(self):
    return self.lower()
  def toLocaleUpperCase(self):
    return self.upper()
  def localeCompare(self, other):
    return (self > other) - (self < other)
  def normalize(self, form='NFC'):
    import unicodedata
    return unicodedata.normalize(form, self)
  # Python's `str` is always Unicode NF-Compliant so isWellFormed and toWellFormed are not generally needed
  def isWellFormed(self):
    try:
      self.encode('utf-8').decode('utf-8')
      return True
    except UnicodeDecodeError:
      return False
  def toWellFormed(self):
    return self  # Assuming the string is well-formed as per Python's handling

  def toString(self):
    return self
  def valueOf(self):
    return self

# 运行环境
BaseEnv = Object({})
def getOs() -> str:
  # 操作系统: windows, mac, linux, ...
  os = platform.system().lower()
  if os.startswith('win'):
    return 'windows'
  elif os.startswith('darwin'):
    return 'mac'
  elif os.startswith('linux'):
    return 'linux'
  return ''
BaseEnv.os = getOs()
BaseEnv.isWindows: bool = BaseEnv.os == 'windows'
BaseEnv.isMac: bool = BaseEnv.os == 'mac'
BaseEnv.isLinux: bool = BaseEnv.os == 'linux'

# 退出和重启
# py 已有 exit/quit
def restart():
  python = sys.executable
  os.execl(python, python, *sys.argv)

__all__ = [
  'NaN', 'Infinity',
  'typeof',
  'isNaN', 'isFinite', 'parseInt', 'parseFloat',
  'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent',

  'Array',
  'Date',
  'Math',
  'Number',
  'Object',
  'Set',
  'String',

  'BaseEnv',

  'restart'
]
