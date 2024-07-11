from .es import Array

class _Array(Array):
  def push(self, *args):
    for arg in args:
      self.append(arg)
  def remove(self, value):
    super().remove(value)
    return value
  def unshift(self, *args):
    for n in args:
      self.insert(0, args[len(args) - n])
    return self
  def shift(self, index = 0):
    return self.pop(index)
  def sort(self, *args, **kwargs):
    super().sort(*args, **kwargs)
    return self
  def reverse(self):
    super().reverse()
    return self

  def toArray(self):
    return list(self)
  def toCustomArray(self):
    return _Array(self)
  def toSet(self):
    return set(self)
  def toCustomSet(self):
    from ._Set import _Set
    return _Set(self)

__all__ = ['_Array']
