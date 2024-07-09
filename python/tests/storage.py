from hp_shared.base import _console, _Date
from hp_shared.storage import clipboard
import unittest

class describe_clipboard(unittest.IsolatedAsyncioTestCase):
  async def test_copy_paste_copySync_pasteSync(self):
    text = '你好，py:copy,paste'
    textWrite = await clipboard.copy(text)
    textRead = await clipboard.paste()
    self.assertEqual(textWrite,text)
    self.assertEqual(textRead,text)

    await _Date.sleep()

    text = '你好，py:copySync,pasteSync'
    textWrite = clipboard.copySync(text)
    textRead =  clipboard.pasteSync()
    self.assertTrue(textRead == textWrite == text)

if __name__ == '__main__':
  unittest.main()
