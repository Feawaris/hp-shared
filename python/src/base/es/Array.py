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

__all__ = ['Array']
