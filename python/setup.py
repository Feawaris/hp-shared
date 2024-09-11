from setuptools import setup, find_packages
import os
import json

# 读取 package.json 内容
with open(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'package.json'), 'r') as f:
  pkg = json.load(f)
py_name = pkg['name'].replace('-', '_')
# 读取 README.md 内容
with open(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'README.md'), 'r') as f:
  long_description = f.read()

setup(
  name=py_name,
  version=pkg['version'],
  description=pkg['description'],
  # 详细的描述，通常从 README 文件读取
  long_description=long_description,
  long_description_content_type="text/markdown",
  license=pkg['license'],
  author=pkg['author'],
  # homepage
  url=pkg['homepage'],
  # exports
  packages=[py_name] + [py_name + '.' + pkg for pkg in find_packages(where='src')],
  package_dir={py_name: 'src'},
  # bin
  entry_points={
    'console_scripts': [
      'hp_shared = bin.index:main',
    ],
  },
  # dependencies
  install_requires=[

  ],
  # devDependencies
  extras_require={
    'dev': [
      'watchdog>=5.0.2',
      'mypy>=1.11.2',
    ],
  },
)
