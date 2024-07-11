from hp_shared.base import BaseEnv, _Object, _console
import subprocess
import asyncio

commandMap = _Object({
  'windows': {
    'copy': 'chcp 65001>nul && clip',  # Windows 系统防止复制中文乱码
    'paste': 'powershell get-clipboard',
  },
  'mac': {
    'copy': 'pbcopy',
    'paste': 'pbpaste',
  },
  'linux': {
    'copy': 'xclip -selection clipboard',
    'paste': 'xclip -selection clipboard -o',
  },
})

class clipboard:
  # 复制
  @classmethod
  async def copy(cls, text):
    text = str(text)
    command = commandMap[BaseEnv.os].copy
    process = await asyncio.create_subprocess_shell(command, stdin = asyncio.subprocess.PIPE, stdout = asyncio.subprocess.PIPE, stderr = asyncio.subprocess.PIPE)
    await process.communicate(input = text.encode('utf-8'))
    return text
  @classmethod
  def copySync(cls, text):
    text = str(text)
    command = commandMap[BaseEnv.os].copy
    subprocess.run(command, input = text.encode('utf-8'), check = True, shell = True, text = False)
    return text

  # 粘贴
  @classmethod
  async def paste(cls):
    command = commandMap[BaseEnv.os].paste
    process = await asyncio.create_subprocess_shell(command, stdin = asyncio.subprocess.PIPE, stdout = asyncio.subprocess.PIPE, stderr = asyncio.subprocess.PIPE)
    stdout, *_ = await process.communicate()
    stdout = stdout.decode('utf-8').strip()
    return stdout
  @classmethod
  def pasteSync(cls):
    command = commandMap[BaseEnv.os].paste
    stdout = subprocess.run(command, capture_output = True, check = True, shell = True, text = True).stdout
    stdout = stdout.strip()
    return stdout

  # Clipboard API 同名定制
  @classmethod
  async def writeText(cls, *args):
    return await cls.copy(*args)
  @classmethod
  def writeTextSync(cls, *args):
    return cls.copySync(*args)
  @classmethod
  async def readText(cls):
    return await cls.paste()
  @classmethod
  def readTextSync(cls):
    return cls.pasteSync()

__all__ = ['clipboard']
