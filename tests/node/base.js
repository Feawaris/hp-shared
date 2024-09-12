const { BaseEnv, _console, _print, _input, _Date, _Math, _Number, _Object, _BigInt } = require('hp-shared');

describe('base', () => {
  test('BaseEnv', () => {
    expect(BaseEnv).toMatchObject({
      envs: ['node'],
      isNode: true,
      os: (() => {
        const os = process.platform.toLowerCase();
        if (os.startsWith('win')) {
          return 'windows';
        }
        if (os.startsWith('darwin')) {
          return 'mac';
        }
        if (os.startsWith('linux')) {
          return 'linux';
        }
      })(),
      isMobile: false,
    });
  });
});
describe('_console', () => {
  test('test_debug_log_info_warn_error_success_end', () => {
    const inputValues = [null, undefined, 10, '12px', true, false, 10n, Symbol('test')];
    const outputValues = [
      '\x1b[90mnull\x1b[39m',
      '\x1b[90mundefined\x1b[39m',
      '\x1b[94m10\x1b[39m',
      '\x1b[93m12px\x1b[39m',
      '\x1b[92mtrue\x1b[39m',
      '\x1b[91mfalse\x1b[39m',
      '\x1b[96m10n\x1b[39m',
      '\x1b[95mSymbol(test)\x1b[39m',
    ];
    function fn({ color, name } = {}) {
      const res = _console[name](...inputValues);
      // res.input: stackInfo 先不加入测试，先不用整个 res.input
      expect(res.input).toMatchObject({ color, name, values: inputValues });
      // res.output
      expect(res.output.slice(1)).toEqual(outputValues);
    }
    fn({ name: 'debug', color: 'grey' });
    fn({ name: 'log', color: 'blue' });
    fn({ name: 'info', color: 'blue' });
    fn({ name: 'warn', color: 'yellow' });
    fn({ name: 'error', color: 'red' });
    fn({ name: 'success', color: 'green' });
    fn({ name: 'end', color: 'grey' });
  });
  test('test__print', () => {
    expect(_print).toEqual(_console.log);
  });
  test('test__input', async () => {
    // 使用模拟的 readline 接口替换真实的 readline.createInterface
    jest.spyOn(require('node:readline'), 'createInterface').mockReturnValue({
      question: jest.fn().mockImplementation((query, callback) => {
        // 模拟用户输入
        callback('123');
      }),
      close: jest.fn(),
    });

    const text = await _input('输入内容：');
    expect(text).toBe('123');

    // 清除模拟
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });
});
describe('_Object', () => {
  test('iterator', () => {
    const obj = new _Object({ a: 1, b: 2 });
    expect(obj.length).toEqual(Object.keys(obj).length);
    expect(Array.from(obj.keys())).toEqual(Object.keys(obj));
    expect(Array.from(obj.values())).toEqual(Object.values(obj));
    expect(Array.from(obj.entries())).toEqual(Object.entries(obj));
    for (const [key, value] of obj) {
      expect(value).toEqual(obj[key]);
    }
  });
  test('filter', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(_Object.filter(obj, { pick: 'a,b' })).toEqual({ a: 1, b: 2 });
  });
});
describe('_Number', () => {
  test('convertBase', () => {
    expect(_Number.convertBase(10, { to: 2 })).toEqual('1010');
    expect(_Number.convertBase(10, { to: 8 })).toEqual('12');
    expect(_Number.convertBase('f', { from: 16 })).toEqual('15');
    expect(_Number.convertBase('f', { from: 16, to: 8 })).toEqual('17');
  });
  test('isPrime', () => {
    expect(_Number.isPrime(1)).toEqual(false);
    expect(_Number.isPrime(2)).toEqual(true);
    expect(_Number.isPrime(3)).toEqual(true);
    expect(_Number.isPrime(4)).toEqual(false);
    expect(_Number.isPrime(5)).toEqual(true);
    expect(_Number.isPrime(6)).toEqual(false);
    expect(_Number.isPrime(7)).toEqual(true);
    expect(_Number.isPrime(8)).toEqual(false);
    expect(_Number.isPrime(9)).toEqual(false);
    expect(_Number.isPrime(10)).toEqual(false);
  });

  describe('_Number.prototype', () => {
    test('toMaxFixed', () => {
      const num = new _Number('12px');
      expect(num.toFixed(2)).toEqual('12.00');
      expect(num.toMaxFixed(2)).toEqual('12');
    });
  });
});
describe('_Math', () => {
  test('PHI', () => {
    expect(_Math.PHI).toEqual((Math.sqrt(5) - 1) / 2);
    expect(_Math.PHI_BIG).toEqual((Math.sqrt(5) + 1) / 2);
  });
});
describe('BigInt', () => {
  test('转换系列方法', () => {
    const fac18 = new _BigInt(_Math.factorial(18));
    const fac19 = new _BigInt(_Math.factorial(19));
    expect(fac18.toJSON()).toEqual('6402373705728000');
    expect(fac19.toString()).toEqual('121645100408832000');
    expect(fac18 < Number.MAX_SAFE_INTEGER).toEqual(true);
    expect(fac19 > Number.MAX_SAFE_INTEGER).toEqual(true);
  });
});
