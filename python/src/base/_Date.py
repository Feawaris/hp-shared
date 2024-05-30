from .base import Number
from datetime import datetime, timezone
import re

class _Date(datetime):
  @staticmethod
  def sleep():
    pass

  @classmethod
  def _parse_date_str(cls, date_str):
    date_str = date_str.replace('/', '-')
    # 定义正则表达式和对应的日期时间格式
    date_patterns = {
      r'^\d{4}$': '%Y',
      r'^\d{4}[-/]\d{1,2}$': '%Y-%m',
      r'^\d{4}[-/]\d{1,2}[-/]\d{1,2}$': '%Y-%m-%d',
      r'^\d{4}[-/]\d{1,2}[-/]\d{1,2} \d{1,2}:\d{1,2}$': '%Y-%m-%d %H:%M',
      r'^\d{4}[-/]\d{1,2}[-/]\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}$': '%Y-%m-%d %H:%M:%S',
    }

    # 遍历模式，尝试匹配并解析日期字符串
    for pattern, date_format in date_patterns.items():
      if re.match(pattern, date_str):
        return datetime.strptime(date_str, date_format)
  def __new__(cls, *args, **kwargs):
    # 如果没有提供任何参数，则使用当前时间
    if not args:
      date = datetime.now()
      return super().__new__(cls, date.year, date.month, date.day, date.hour, date.minute, date.second, date.microsecond)
    # 如果提供的第一个参数是字符串类型，解析这个日期字符串
    elif len(args) == 1 and isinstance(args[0], str):
      date = cls._parse_date_str(args[0])
      return super().__new__(cls, date.year, date.month, date.day, date.hour, date.minute, date.second, date.microsecond)
    # 对于其他情况，直接将参数传递给父类的__new__方法
    return super().__new__(cls, *args, **kwargs)
  @property
  def isLeapYear(self):
    return (self.year % 4 == 0 and self.year % 100 != 0) or (self.year % 400 == 0)
  @property
  def week(self):
    return self.weekday() + 1
  @property
  def shortHour(self):
    return self.hour if self.hour <= 12 else self.hour - 12
  @property
  def millisecond(self):
    return self.microsecond // 1000
  @property
  def timeZoneOffsetHour(self):
    return self.hour + (self.minute * 60 + self.second) // 60
  # def timestamp(self):
  #   return self.timestamp()

  # 定义对象的字符串表示
  def __str__(self, format='YYYY-MM-DD HH:mm:ss'):
    def formatFunc(result):
      # 定义格式化模式和对应的替换函数
      patterns = {
        "YYYY": lambda x: x.strftime("%Y"),
        "YY": lambda x: x.strftime("%y"),
        "MM": lambda x: x.strftime("%m"),
        "DD": lambda x: x.strftime("%d"),
        "HH": lambda x: x.strftime("%H"),
        "mm": lambda x: x.strftime("%M"),
        "ss": lambda x: x.strftime("%S"),
      }
      # 遍历所有模式并替换字符串中的占位符
      for pattern, func in patterns.items():
        result = re.sub(pattern, func(self), result)
      return result

    return formatFunc(format)
  def toString(self, *args, **kwargs):
    return self.__str__(*args, **kwargs)
  # 定义对象的官方字符串表示，通常用于调试
  def __repr__(self):
    return f"_Date({self.year}, {self.month}, {self.day}, {self.hour}, {self.minute}, {self.second}, {self.microsecond})"
  # 允许将_Date对象转换为整数（时间戳）
  def __int__(self):
    return int(self.timestamp())
  # 允许将_Date对象转换为浮点数（时间戳）
  def __float__(self):
    return float(self.timestamp())
  def toNumber(self, *args, **kwargs):
    return self.__int__(*args, **kwargs)
  def toBoolean(self):
    return not Number.isNaN(self.timestamp())

__all__ = ['_Date']
