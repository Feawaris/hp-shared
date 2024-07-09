import unittest
import base
import storage

if __name__ == '__main__':
  loader = unittest.TestLoader()

  suite = unittest.TestSuite()
  suite.addTests(loader.loadTestsFromModule(base))
  suite.addTests(loader.loadTestsFromModule(storage))

  runner = unittest.TextTestRunner(verbosity=2)
  runner.run(suite)
