from datetime import datetime, timezone
import re
import asyncio

class _Date:
  @staticmethod
  async def sleep(seconds = 0.3):
    return await asyncio.sleep(seconds)

  def __init__(self, *args, **kwargs):
    # 如果没有提供任何参数，则使用当前时间
    if not args:
      self.value = datetime.now()
    # 如果提供的第一个参数是字符串类型，解析这个日期字符串
    elif len(args) == 1 and isinstance(args[0], str):
      def parseDateStr(date_str):
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
      self.value = parseDateStr(args[0])
    # 对于其他情况，直接将参数传递给 datetime 方法
    else:
      self.value = datetime(*args, **kwargs)
  # toString
  def __str__(self, format = 'YYYY-MM-DD HH:mm:ss'):
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

__all__ = ['_Date']
