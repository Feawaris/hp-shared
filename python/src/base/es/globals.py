from .Number import Number
from urllib.parse import quote, unquote

def typeof(value = None) -> str:
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

NaN = Number.NaN
Infinity = Number.POSITIVE_INFINITY
isNaN = Number.isNaN
isFinite = Number.isFinite
parseInt = Number.parseInt
parseFloat = Number.parseFloat
def encodeURI(uri: str) -> str:
  return quote(uri, safe = ':/@?=&#')
def decodeURI(uri: str) -> str:
  return unquote(uri, )
def encodeURIComponent(uri: str) -> str:
  return quote(uri, safe = '')
def decodeURIComponent(uri: str) -> str:
  return unquote(uri, )

__all__ = [
  'typeof',
  'NaN', 'Infinity',
  'isNaN', 'isFinite', 'parseInt', 'parseFloat',
  'encodeURI', 'decodeURI', 'encodeURIComponent', 'decodeURIComponent',
]
