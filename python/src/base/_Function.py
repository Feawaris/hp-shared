class _Function:
  @staticmethod
  def pipe(value, *funcs):
    for func in funcs:
      value = func(value)
    return value

__all___ = ['_Function']
