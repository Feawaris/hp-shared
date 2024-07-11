from .es import Object

class _Object(Object):
  @staticmethod
  def deepAssign(target: dict, *sources) -> dict:
    for source in sources:
      for key, value in source.items():
        if isinstance(value, dict):
          _Object.deepAssign(target[key], value)
        else:
          target[key] = value
    return target
  @staticmethod
  def filter(target: dict, options: dict = { }, pick = [], omit = [], emptyPick = 'all') -> dict:
    pick = pick + options.get('pick', [])
    omit = omit + options.get('omit', [])
    emptyPick = emptyPick or options.get('emptyPick', '')

    # pick 和 emptyPick 筛选：pick 有值直接拿，为空时根据 emptyPick 默认拿空或全部 key
    keys = pick if len(pick) > 0 or emptyPick == 'empty' else _Object.keys(target)
    # omit 筛选
    keys = [key for key in keys if key not in omit]

    return _Object({ key: target[key] for key in keys })

  @property
  def length(self):
    return len(self.__dict__)

  def keys(self):
    return self.__dict__.keys()
  def values(self):
    return self.__dict__.values()
  def entries(self):
    return self.__dict__.items()
  def __iter__(self):
    return iter(self.__dict__.items())

__all__ = ['_Object']
