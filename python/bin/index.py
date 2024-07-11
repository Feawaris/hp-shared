import os
import json

# 读取 package.json 内容
with open(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'package.json'), 'r') as f:
  pkg = json.load(f)
py_name = pkg['name'].replace('-', '_')

def main():
  print(py_name)
if __name__ == '__main__':
  main()
