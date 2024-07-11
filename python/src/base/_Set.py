from .es import Set

class _Set(Set):
  @staticmethod
  def cap(*sets):
    pass
  @staticmethod
  def cup(*sets):
    pass
  @staticmethod
  def setminus(mainSet, *otherSets):
    pass

  def __init__(self, *args):
    super().__init__(*args)
  @property
  def length(self):
    return self.size

  def toArray(self):
    return list(self)
  def to_Array(self):
    from ._Array import _Array
    return _Array(self)
  def toSet(self):
    return set(self)
  def to_Set(self):
    return _Set(self)

__all__ = ['_Set']
