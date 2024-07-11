from .es import typeof, Object
from .base import BaseEnv
from ._Object import _Object
import inspect
import datetime
import re

# 简易 chalk
_chalk = _Object({ })
_chalk.styleMap = _Object({
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

_console = _Object({ })
# 根据堆栈跟踪格式提取详细信息
def getStackInfo():
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
def getValues(options: dict = { }, **kwargs):
  # 参数处理，同时支持字典传参和关键字传参
  options.update(kwargs)

  style = options.get('style')
  type = options.get('type')
  stackInfo = options.get('stackInfo')
  values = options.get('values')

  # 时间
  date = datetime.datetime.now()
  # stackInfo 需要从具体方法传进来
  # 前缀内容
  prefix = ' '.join(filter(None, [f'[{date}]', f'[{type}]', stackInfo.fileShow, stackInfo.method])) + ' :'
  # 样式映射
  styleMap = _Object({
    'blue': { 'node': 'blue', 'browser': 'color:blue;' },
    'yellow': { 'node': 'yellow', 'browser': 'color:orange;' },
    'red': { 'node': 'red', 'browser': 'color:red;' },
    'green': { 'node': 'green', 'browser': 'color:green;' },
    'grey': { 'node': 'grey', 'browser': 'color:grey;' },
    'bold': { 'node': 'bold', 'browser': 'font-weight:bold;' },
  })

  def getValue(value):
    # 第一层简单类型配默认颜色
    if value is None:
      return _chalk.grey(value)
    if typeof(value) == 'number':
      return _chalk.blueBright(value)
    if typeof(value) == 'string':
      # 特殊 style 显示：只输出一个字符串，不同其他类型组合时同 style 风格
      if len(values) == 1 and style in ['yellow', 'red', 'green', 'grey']:
        return _chalk[styleMap[style].node](value)
      return _chalk.yellowBright(value)
    if typeof(value) == 'boolean':
      return _chalk.greenBright(value) if value else _chalk.redBright(value)
    # 其他原样返回
    return value
  return [
    _chalk[styleMap[style].node](prefix),
    *map(getValue, values)
  ]
def show(options: dict = { }, **kwargs):
  # 参数处理，同时支持字典传参和关键字传参
  options.update(kwargs)

  values = _console.getValues(**options)

  print(*values)
  return _Object({
    'input': { k: list(v) if isinstance(v, (list, tuple)) else v for k, v in options.items() },
    'output': values
  })
def log(*args):
  return _console.show({ 'style': 'blue', 'type': 'log', 'stackInfo': _console.getStackInfo(), 'values': args })
def warn(*args):
  return _console.show({ 'style': 'yellow', 'type': 'warn', 'stackInfo': _console.getStackInfo(), 'values': args })
def error(*args):
  return _console.show({ 'style': 'red', 'type': 'error', 'stackInfo': _console.getStackInfo(), 'values': args })
def success(*args):
  return _console.show({ 'style': 'green', 'type': 'success', 'stackInfo': _console.getStackInfo(), 'values': args })
def end(*args):
  return _console.show({ 'style': 'grey', 'type': 'end', 'stackInfo': _console.getStackInfo(), 'values': args })
def dir(*args):
  return _console.show({ 'style': 'blue', 'type': 'dir', 'stackInfo': _console.getStackInfo(), 'values': args })
_console.getStackInfo = getStackInfo
_console.getValues = getValues
_console.show = show
_console.log = log
_console.warn = warn
_console.error = error
_console.success = success
_console.end = end
_console.dir = dir

_print = _console.log
def _input(title = ''):
  return input(title)

__all__ = ['_chalk', '_console', '_print', '_input']
