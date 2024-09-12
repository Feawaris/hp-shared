from .es import typeof, Object
from .base import BaseEnv
from ._Object import _Object
import inspect
import datetime
import re

# 简易 chalk
_chalk = _Object({ })
_chalk.styleMap = _Object({
  # 文本颜色
  'black': [30, 39],
  'red': [31, 39],
  'green': [32, 39],
  'yellow': [33, 39],
  'blue': [34, 39],
  'magenta': [35, 39],
  'cyan': [36, 39],
  'white': [37, 39],
  'blackBright': [90, 39],
  'gray': [90, 39],
  'grey': [90, 39],
  'redBright': [91, 39],
  'greenBright': [92, 39],
  'yellowBright': [93, 39],
  'blueBright': [94, 39],
  'magentaBright': [95, 39],
  'cyanBright': [96, 39],
  'whiteBright': [97, 39],

  # 背景颜色
  'bgBlack': [40, 49],
  'bgRed': [41, 49],
  'bgGreen': [42, 49],
  'bgYellow': [43, 49],
  'bgBlue': [44, 49],
  'bgMagenta': [45, 49],
  'bgCyan': [46, 49],
  'bgWhite': [47, 49],
  'bgBlackBright': [100, 49],
  'bgGray': [100, 49],
  'bgGrey': [100, 49],
  'bgRedBright': [101, 49],
  'bgGreenBright': [102, 49],
  'bgYellowBright': [103, 49],
  'bgBlueBright': [104, 49],
  'bgMagentaBright': [105, 49],
  'bgCyanBright': [106, 49],
  'bgWhiteBright': [107, 49],

  # 样式
  'reset': [0, 0],
  'bold': [1, 22],
  'dim': [2, 22],
  'italic': [3, 23],
  'underline': [4, 24],
  'overline': [53, 55],
  'inverse': [7, 27],
  'hidden': [8, 28],
  'strikethrough': [9, 29],
})
for method, (start, end) in Object.entries(_chalk.styleMap):
  _chalk[method] = lambda message, start = start, end = end: f'\x1b[{start}m{message}\x1b[{end}m'

# 定制 console
class BaseConsole():
  def __init__(self):
    self.__dict__ = {
      'getStackInfo': self.getStackInfo,
      'getValues': self.getValues,
      'show': self.show,
      'debug': self.debug,
      'log': self.log,
      'info': self.info,
      'warn': self.warn,
      'error': self.error,
      'success': self.success,
      'end': self.end,
      'dir': self.dir,
    }
  # 统一 .写法 和 []写法 的操作
  # .写法
  def __getattr__(self, key: str) -> callable:
    try:
      return self.__dict__[key]
    except AttributeError:
      return None
  # []写法
  def __getitem__(self, key: str) -> callable:
    try:
      return self.__dict__[key]
    except KeyError:
      return None
  # 根据堆栈跟踪格式提取详细信息
  def getStackInfo(self):
    stack = inspect.stack()
    match = stack[2]

    # 提取信息
    method = match.function or ''
    file = match.filename.replace('\\', '/') if BaseEnv.isWindows else match.filename
    line = match.lineno
    column = match.positions.end_col_offset

    # 完整路径和显示用处理
    fileShow = f'{file}:{line}:{column}'
    windowsPathReg = r'^[A-Za-z]:/.*$'
    macPathReg = r'^/.*$'
    if re.match(windowsPathReg, file) or re.match(macPathReg, file):
      prefix = 'file:///' if BaseEnv.isWindows else 'file://'
      fileShow = f'{prefix}{fileShow}'

    return _Object({
      'fileShow': fileShow,

      'file': file,
      'method': method,
      'line': line,
      'column': column,
    })
  # 处理成要传入 console.log 显示的值，在 show 显示和 jest 测试用
  def getValues(self, options: dict = { }, **kwargs):
    # 参数处理，同时支持字典传参和关键字传参
    options.update(kwargs)

    color = options.get('color')
    name = options.get('name')
    stackInfo = options.get('stackInfo')
    values = options.get('values')

    # 时间
    date = datetime.datetime.now()
    # stackInfo 需要从具体方法传进来
    # 前缀内容
    prefix = ' '.join(filter(None, [f'[{date}]', f'[{name}]', stackInfo.fileShow, stackInfo.method])) + ' :'
    def getValue(value):
      # 第一层简单类型配默认颜色
      if value is None:
        return _chalk.grey(value)
      if typeof(value) == 'number':
        return _chalk.blueBright(value)
      if typeof(value) == 'string':
        # 特殊 color 显示：只输出一个字符串，不同其他类型组合时同 color 风格
        if len(values) == 1 and color in ['yellow', 'red', 'green', 'grey']:
          return _chalk[color](value)
        return _chalk.yellowBright(value)
      if typeof(value) == 'boolean':
        return _chalk.greenBright(value) if value else _chalk.redBright(value)
      # 其他原样返回
      return value
    return [
      _chalk[color](prefix),
      *map(getValue, values)
    ]
  # 同时 show 方法也返回用于需要反馈的场景
  def show(self, options: dict = { }, **kwargs):
    # 参数处理，同时支持字典传参和关键字传参
    options.update(kwargs)

    values = self.getValues(**options)

    print(*values)
    return _Object({
      'input': { k: list(v) if isinstance(v, (list, tuple)) else v for k, v in options.items() },
      'output': values
    })
  def debug(self, *args):
    return self.show({ 'color': 'grey', 'name': 'debug', 'stackInfo': self.getStackInfo(), 'values': args })
  def log(self, *args):
    return self.show({ 'color': 'blue', 'name': 'log', 'stackInfo': self.getStackInfo(), 'values': args })
  def info(self, *args):
    return self.show({ 'color': 'blue', 'name': 'info', 'stackInfo': self.getStackInfo(), 'values': args })
  def warn(self, *args):
    return self.show({ 'color': 'yellow', 'name': 'warn', 'stackInfo': self.getStackInfo(), 'values': args })
  def error(self, *args):
    return self.show({ 'color': 'red', 'name': 'error', 'stackInfo': self.getStackInfo(), 'values': args })
  def success(self, *args):
    return self.show({ 'color': 'green', 'name': 'success', 'stackInfo': self.getStackInfo(), 'values': args })
  def end(self, *args):
    return self.show({ 'color': 'grey', 'name': 'end', 'stackInfo': self.getStackInfo(), 'values': args })
  def dir(self, *args):
    return self.show({ 'color': 'blue', 'name': 'dir', 'stackInfo': self.getStackInfo(), 'values': args })
_console = BaseConsole()

# py 风格的输入/输出
_print = _console.log
def _input(title = ''):
  return input(title)

__all__ = ['_chalk', 'BaseConsole', '_console', '_print', '_input']
