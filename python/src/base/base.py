from ._Object import _Object
import platform
import os
import sys

# 运行环境
BaseEnv = _Object({ })
def getOs() -> str:
  # 操作系统: windows, mac, linux, ...
  os = platform.system().lower()
  if os.startswith('win'):
    return 'windows'
  elif os.startswith('darwin'):
    return 'mac'
  elif os.startswith('linux'):
    return 'linux'
  return ''
BaseEnv.os = getOs()
BaseEnv.isWindows: bool = BaseEnv.os == 'windows'
BaseEnv.isMac: bool = BaseEnv.os == 'mac'
BaseEnv.isLinux: bool = BaseEnv.os == 'linux'

# 退出和重启
# py 已有 exit/quit
def restart():
  python = sys.executable
  os.execl(python, python, *sys.argv)

__filename = os.path.abspath(__file__)
__dirname = os.path.dirname(__filename)
__all__ = [
  'BaseEnv',
  'restart',
  '__filename', '__dirname'
]
