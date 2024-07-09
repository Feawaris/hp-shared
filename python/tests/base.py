from hp_shared.base import NaN, Infinity, isNaN, isFinite, parseInt, parseFloat, decodeURI, decodeURIComponent, encodeURI, encodeURIComponent, Object, _Object, Number, _Number, BaseEnv, _console, Date, _Date
import unittest
import platform
import math

i = 1
f = 3.14
str1 = '12px'
str2 = '12.5px'
bol1 = True
bol2 = False
inputValues = [None, i, f, str1, str2, bol1, bol2]
outputValues = [
  '\x1b[90mNone\x1b[39m',
  '\x1b[94m1\x1b[39m',
  '\x1b[94m3.14\x1b[39m',
  '\x1b[93m12px\x1b[39m',
  '\x1b[93m12.5px\x1b[39m',
  '\x1b[92mTrue\x1b[39m',
  '\x1b[91mFalse\x1b[39m'
]

class describe_es(unittest.TestCase):
  def test_global(self):
    self.assertTrue(math.isnan(NaN))
    self.assertEqual(Infinity, float('inf'))
    uri = 'https://test:123456@sub.example.com:8080/p1/p2?q1=hello world&q2=2#快速上手'
    uri_encoded = 'https://test:123456@sub.example.com:8080/p1/p2?q1=hello%20world&q2=2#%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8B'
    uri_component_encoded = 'https%3A%2F%2Ftest%3A123456%40sub.example.com%3A8080%2Fp1%2Fp2%3Fq1%3Dhello%20world%26q2%3D2%23%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8B'
    self.assertEqual(uri_encoded, encodeURI(uri))
    self.assertEqual(uri_component_encoded, encodeURIComponent(uri))
    self.assertEqual(uri, decodeURI(uri_encoded))
    self.assertEqual(uri, decodeURIComponent(uri_component_encoded))

class describe_base(unittest.TestCase):
  def test_BaseEnv(self):
    os = platform.system().lower()
    if os.startswith('darwin'):
      self.assertEqual(BaseEnv.os, 'mac')
    elif os.startswith('windows'):
      self.assertEqual(BaseEnv.os, 'windows')
    elif os.startswith('linux'):
      self.assertEqual(BaseEnv.os, 'linux')

class describe__console(unittest.TestCase):
  def test_log(self):
    res = _console.log(*inputValues)
    input, output = res.input, res.output
    inputObj = _Object({'style': input.style, 'type': input.type, 'values': input.values})
    expectInputObj = _Object({'style': 'blue', 'type': 'log', 'values': inputValues})
    self.assertEqual(inputObj, expectInputObj)
    self.assertEqual(output[1:], outputValues)
  def test_warn(self):
    res = _console.warn(*inputValues)
    input, output = res.input, res.output
    inputObj = _Object({'style': input.style, 'type': input.type, 'values': input.values})
    expectInputObj = _Object({'style': 'yellow', 'type': 'warn', 'values': inputValues})
    self.assertEqual(inputObj, expectInputObj)
    self.assertEqual(output[1:], outputValues)

class describe__Object(unittest.TestCase):
  def test_Object(self):
    obj = _Object({'a': 1, 'b': 2})
    # assign
    _Object.assign(obj, {'c': 3}, {'d': 4})
    self.assertEqual(obj, _Object({'a': 1, 'b': 2, 'c': 3, 'd': 4}))
  def test__Object(self):
    obj = _Object({'a': 1, 'b': 2, 'userInfo': {'name': 'user1', 'age': 1, 'gender': 'male'}})
    # length
    self.assertEqual(obj.length, len(obj.__dict__))
    # __iter__
    for key, value in obj:
      self.assertEqual(value, obj[key])
    # deepAssign
    _Object.deepAssign(obj, {'userInfo': {'age': 2}}, {'userInfo': {'gender': 'female'}})
    self.assertEqual(obj, _Object({'a': 1, 'b': 2, 'userInfo': {'name': 'user1', 'age': 2, 'gender': 'female'}}))
    # filter 两种传参写法
    obj2 = _Object.filter(obj, {'pick': ['a', 'b']})
    _console.log(obj2)
    obj3 = _Object.filter(obj, pick=['a', 'b'])
    _console.log(obj3)

class describe__Number(unittest.TestCase):
  def test_Number(self):
    # convertBase
    self.assertEqual(_Number.convertBase(10, {'to': 2}), '1010')
    self.assertEqual(_Number.convertBase(10, {'to': 8}), '12')
    self.assertEqual(_Number.convertBase('f', {'from': 16}), '15')
    self.assertEqual(_Number.convertBase('f', {'from': 16, 'to': 8}), '17')
    # isPrime
    for i in range(10 + 1):
      _console.log(i, _Number.isPrime(i))

class describe__Date(unittest.IsolatedAsyncioTestCase):
  async def test__Date(self):
    _console.log(1)
    await _Date.sleep()
    _console.log(2)

if __name__ == '__main__':
  unittest.main()
