from hp_shared.base.es import (
  typeof, NaN, Infinity, isNaN, isFinite, parseInt, parseFloat, encodeURI, encodeURIComponent, decodeURI, decodeURIComponent,
  Array, Date, Math, Number, Object, Set, String
)
from hp_shared.base.node import useNodeGlobals
from hp_shared.base import _Object, _Number, BaseEnv, _console, _print, _input, _Date
import unittest
from unittest.mock import patch
import platform
import math
import os

class describe_es_globals(unittest.TestCase):
  def test_typeof(self):
    self.assertEqual('null', typeof(None))
    self.assertEqual('string', typeof('1'))
    self.assertEqual('number', typeof(1))
    self.assertEqual('boolean', typeof(True))
    self.assertEqual('object', typeof({ }))
  def test_NaN_Infinity(self):
    self.assertTrue(math.isnan(NaN))
    self.assertEqual(Infinity, float('inf'))
  def test_isNaN_isFinite_parseInt_parseFloat(self):
    self.assertTrue(isNaN(NaN))
    self.assertTrue(isFinite(1))
    self.assertEqual(10, parseInt('10'))
    self.assertEqual(2, parseInt('10', 2))
    self.assertEqual(8, parseInt('10', 8))
    self.assertEqual(16, parseInt('10', 16))
    self.assertEqual(12.5, parseFloat('12.5px'))
  def test_encodeURI_decodeURI_encodeURIComponent_decodeURIComponent(self):
    uri = 'https://test:123456@sub.example.com:8080/p1/p2?q1=hello world&q2=2#快速上手'
    uri_encoded = 'https://test:123456@sub.example.com:8080/p1/p2?q1=hello%20world&q2=2#%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8B'
    uri_component_encoded = 'https%3A%2F%2Ftest%3A123456%40sub.example.com%3A8080%2Fp1%2Fp2%3Fq1%3Dhello%20world%26q2%3D2%23%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8B'
    self.assertEqual(uri_encoded, encodeURI(uri))
    self.assertEqual(uri, decodeURI(uri_encoded))
    self.assertEqual(uri_component_encoded, encodeURIComponent(uri))
    self.assertEqual(uri, decodeURIComponent(uri_component_encoded))
class describe_es_Array(unittest.TestCase):
  pass
class describe_es_Date(unittest.TestCase):
  pass
class describe_es_Math(unittest.TestCase):
  pass
class describe_es_Number(unittest.TestCase):
  pass
class describe_es_Object(unittest.TestCase):
  def test_constructor(self):
    obj = Object({ "a": 1, "b": 2, "c": 3 })
    self.assertEqual(obj.constructor, Object)
class describe_es_Set(unittest.TestCase):
  pass
class describe_es_String(unittest.TestCase):
  pass

class describe_node_globals(unittest.TestCase):
  def test_useNodeGlobals(self):
    __filename, __dirname, *_ = useNodeGlobals().values()
    self.assertEqual(__filename, os.path.abspath(__file__))
    self.assertEqual(__dirname, os.path.dirname(os.path.abspath(__file__)))

class describe_base(unittest.TestCase):
  def test_BaseEnv(self):
    os = platform.system().lower()
    if os.startswith('darwin'):
      self.assertEqual(BaseEnv.os, 'mac')
      self.assertTrue(BaseEnv.isMac)
    elif os.startswith('windows'):
      self.assertEqual(BaseEnv.os, 'windows')
      self.assertTrue(BaseEnv.isWindows)
    elif os.startswith('linux'):
      self.assertEqual(BaseEnv.os, 'linux')
      self.assertTrue(BaseEnv.isLinux)
class describe__Array(unittest.TestCase):
  pass
class describe__console(unittest.TestCase):
  def test_log_warn_error_success_end(self):
    inputValues = [None, 10, '12px', True, False]
    outputValues = [
      '\x1b[90mNone\x1b[39m',
      '\x1b[94m10\x1b[39m',
      '\x1b[93m12px\x1b[39m',
      '\x1b[92mTrue\x1b[39m',
      '\x1b[91mFalse\x1b[39m'
    ]
    def fn(type: str, style: str) -> None:
      res = _console[type](*inputValues)
      # res.input: stackInfo 先不加入测试，先不用整个 res.input
      self.assertEqual(
        { 'style': res.input.style, 'type': res.input.type, 'values': res.input.values },
        { 'style': style, 'type': type, 'values': inputValues },
      )
      # res.output
      self.assertEqual(res.output[1:], outputValues)
    fn(type = 'log', style = 'blue')
    fn(type = 'warn', style = 'yellow')
    fn(type = 'error', style = 'red')
    fn(type = 'success', style = 'green')
    fn(type = 'end', style = 'grey')
  def test__print(self):
    self.assertEqual(_print, _console.log)
  def test__input(self):
    with patch('builtins.input', return_value = '123'):
      text = _input('输入内容：')
      self.assertEqual(text, '123')
class describe__Date(unittest.IsolatedAsyncioTestCase):
  async def test__Date(self):
    _console.log(1)
    await _Date.sleep()
    _console.log(2)
class describe__Function(unittest.TestCase):
  pass
class describe__Math(unittest.TestCase):
  pass
class describe__Number(unittest.TestCase):
  def test_Number_convertBase(self):
    self.assertEqual(_Number.convertBase(10, { 'to': 2 }), '1010')
    self.assertEqual(_Number.convertBase(10, { 'to': 8 }), '12')
    self.assertEqual(_Number.convertBase('f', { 'from': 16 }), '15')
    self.assertEqual(_Number.convertBase('f', { 'from': 16, 'to': 8 }), '17')
  def test_Number_isPrime(self):
    for i in range(10 + 1):
      _console.log(i, _Number.isPrime(i))
class describe__Object(unittest.TestCase):
  def test__Object_assign(self):
    obj = _Object({ 'a': 1, 'b': 2 })
    _Object.assign(obj, { 'c': 3 }, { 'd': 4 })
    self.assertEqual(obj, _Object({ 'a': 1, 'b': 2, 'c': 3, 'd': 4 }))
  def test__Object_tests(self):
    obj = _Object({ 'a': 1, 'b': 2, 'userInfo': { 'name': 'user1', 'age': 1, 'gender': 'male' } })
    # length
    self.assertEqual(obj.length, len(obj.__dict__))
    # __iter__
    for key, value in obj:
      self.assertEqual(value, obj[key])
    # deepAssign
    _Object.deepAssign(obj, { 'userInfo': { 'age': 2 } }, { 'userInfo': { 'gender': 'female' } })
    self.assertEqual(obj, _Object({ 'a': 1, 'b': 2, 'userInfo': { 'name': 'user1', 'age': 2, 'gender': 'female' } }))
    # filter 两种传参写法
    obj2 = _Object.filter(obj, { 'pick': ['a', 'b'] })
    _console.log(obj2)
    obj3 = _Object.filter(obj, pick = ['a', 'b'])
    _console.log(obj3)
class describe__Set(unittest.TestCase):
  pass
class describe__String(unittest.TestCase):
  pass

if __name__ == '__main__':
  unittest.main()
