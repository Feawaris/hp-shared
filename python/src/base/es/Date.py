from datetime import datetime, timezone

class Date():
  @staticmethod
  def now():
    return datetime.now().timestamp() * 1000
  @staticmethod
  def parse(s):
    return datetime.strptime(s, '%Y-%m-%d %H:%M:%S').timestamp() * 1000
  @staticmethod
  def UTC(year = 1970, monthIndex = 0, day = 1, hour = 0, minute = 0, second = 0, millisecond = 0):
    return datetime(year, monthIndex + 1, day, hour, minute, second, millisecond * 1000, tzinfo = timezone.utc).timestamp() * 1000

  def getTime(self):
    pass
  def getTimezoneOffset(self):
    pass
