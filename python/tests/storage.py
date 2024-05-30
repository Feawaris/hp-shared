from hp_shared.base import _console
from hp_shared.storage import clipboard
import unittest

class Dwscribe_clipboard(unittest.IsolatedAsyncioTestCase):
  async def test_copy(self):
    copyText = 'python:copy'
    copyTextRes = await clipboard.copy(copyText)
    self.assertEqual(copyTextRes, copyText)
  async def test_paste(self):
    pasteText = 'python:paste'
    await clipboard.copy(pasteText)
    pasteTextRes = await clipboard.paste()
    self.assertEqual(pasteTextRes, pasteText)

if __name__ == '__main__':
  unittest.main()
