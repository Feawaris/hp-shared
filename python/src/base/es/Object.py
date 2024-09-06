from typing import Type

class Object:
  @staticmethod
  def create(dic: dict | Type['Object'] | None) -> Type['Object']:
    return Object(dic)
  @staticmethod
  def fromEntries(entries: list) -> Type['Object']:
    obj = { }
    for key, value in entries:
      obj[key] = value
    return Object({ key: value for key, value in obj.items() })
  @staticmethod
  @staticmethod
  def keys(obj: dict) -> list:
    return obj.keys()
  @staticmethod
  def values(obj: dict) -> list:
    return obj.values()
  @staticmethod
  def entries(obj: dict) -> list:
    return obj.items()

  @staticmethod
  def assign(target: dict = { }, *sources) -> dict:
    for source in sources:
      target.update(source)
    return target

  @property
  def constructor(self):
    return type(self)
  def __init__(self, data: dict = { }):
    if data is None:
      data = { }
    data = { key: type(self)(value) if isinstance(value, dict) else value for key, value in data.items() }
    self.__dict__.update(data)

  # 统一 .写法 和 []写法 的操作
  # .写法
  def __getattr__(self, key):
    try:
      return self.__dict__[key]
    except KeyError:
      return None
  def __setattr__(self, key, value):
    self.__dict__[key] = value
  def __delattr__(self, key):
    # print('__delattr__:', key)
    try:
      del self.__dict__[key]
    except KeyError:
      pass
  # []写法
  def __getitem__(self, key):
    try:
      return self.__dict__[key]
    except KeyError:
      return None
  def __setitem__(self, key, value):
    self.__dict__[key] = value
  def __delitem__(self, key):
    try:
      del self.__dict__[key]
    except KeyError:
      pass

  def __repr__(self):
    return f'{self.__class__.__name__}({self.__dict__})'
  # def __str__(self):
  #   # 定义一个辅助函数来递归处理字典
  #   def stringify_dict(dic):
  #     return ','.join([f'{key}:{stringify_value(item)}' for key, item in dic.items()])
  #   # 辅助函数来处理值，如果是Object实例则调用其__str__方法
  #   def stringify_value(value):
  #     if isinstance(value, type(self)):
  #       return str(value)  # 递归处理嵌套的Object实例
  #     return str(value)  # 对于非Object实例，直接转换为字符串
  #   return '{' + stringify_dict(self.__dict__) + '}'
  def __eq__(self, other):
    return isinstance(other, Object) and self.__dict__ == other.__dict__

  def items(self):
    return self.__dict__.items()
  def update(self, *args, **kwargs):
    return self.__dict__.update(*args, **kwargs)

__all__ = ['Object']
