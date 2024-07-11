import re

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
  def split(self, sep = None, maxsplit = -1):
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
  def indexOf(self, sub, start = 0):
    return self.find(sub, start)
  def lastIndexOf(self, sub, start = 0):
    return self.rfind(sub, 0, start)
  def search(self, pattern):
    match = re.search(pattern, self)
    return match.start() if match else -1
  def includes(self, substring, start = 0):
    return substring in self[start:]
  def startsWith(self, substring, start = 0):
    return self.startswith(substring, start)
  def endsWith(self, substring, end = None):
    return self.endswith(substring, 0, end)

  def slice(self, start = 0, end = None):
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
  def padStart(self, target_length, pad_string = ' '):
    return self.rjust(target_length, pad_string)
  def padEnd(self, target_length, pad_string = ' '):
    return self.ljust(target_length, pad_string)
  def repeat(self, times):
    return self * times
  def replace(self, old, new, count = 1):
    return super().replace(old, new, count)
  def replaceAll(self, old, new, count = -1):
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
  def normalize(self, form = 'NFC'):
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

__all__ = ['String']
