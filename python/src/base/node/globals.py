from .._Object import _Object
import inspect
import os

# 使用 __file__ 方式始终为当前文件路径不符合预期，改成使用组合式函数导出
def useNodeGlobals():
  # 获取当前函数的上一层调用者的信息
  caller_frame = inspect.currentframe().f_back
  # 从帧对象中提取文件名
  caller_file = inspect.getframeinfo(caller_frame).filename
  # 将文件名转换为绝对路径
  __filename = os.path.abspath(caller_file)
  __dirname = os.path.dirname(__filename)
  # 注意字典顺序，外部使用 .values() 方式解构
  return _Object({
    '__filename': __filename,
    '__dirname': __dirname,
  })

__all__ = ['useNodeGlobals']
