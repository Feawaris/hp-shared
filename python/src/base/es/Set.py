class Set(set):
  def __init__(self, value):
    super().__init__(value)
  @property
  def size(self):
    return len(self)

__all__ = ['Set']
