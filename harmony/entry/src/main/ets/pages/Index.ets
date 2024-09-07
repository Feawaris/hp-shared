import { version, BaseEnv, _console, _Object, _Math, _Date, _String, _Set } from 'hp-shared/dist/index.js'
import { router } from '@kit.ArkUI'

function test_console() {
  _console.log(JSON.stringify(BaseEnv, null, 2))
  _console.warn(1, '1', true, null, undefined, 1n, [1, 2], { a: 1, b: 2 }, [{ a: 1, b: 2 }])
  _console.error({ a: 1, b: 2 })
  _console.dir({ a: 1, b: 2 })
  _console.table([{ a: 1, b: 2 }])
}
function test_base() {
  _console.warn(version)
  _console.dir(BaseEnv)

  interface GeneratedObjectLiteralInterface_1 {
    username: string;
    password: string;
    temp1: number;
    temp2: number;
  }
  const model: GeneratedObjectLiteralInterface_1 = {
    username: 'xx',
    password: '123456',
    temp1: 1,
    temp2: 2
  };
  const params = _Object.filter(model, { pick: ['username', 'password'] }); // [!code focus]
  _console.warn(params)

  _console.log(_Math.C(4, 2))
  _console.log(new Date())
  _console.log(new _Date())
  _console.log(_String.toCamelCase('el-input', { first: 'uppercase' }))
  _console.log(new Set([1, 2, 3, 1, 2]))
  _console.log(new _Set([1, 2, 3, 1, 2]))
}
// test_console()
test_base()

@Entry
@Component
struct Index {
  @State message: string = 'Hello World'
  build() {
    Row() {
      Column() {
        Text(this.message).fontSize(50).fontWeight(FontWeight.Bold)
        Button() {
          Text('Next').fontSize(30).fontWeight(FontWeight.Bold)
        }.type(ButtonType.Capsule).margin({ top: 20 }).backgroundColor('#0d9ffb').width('40%').height('5%')
        .onClick(async () => {
          _console.log('next')
          await router.pushUrl({ url: 'pages/Second' })
        })
      }.width('100%')
    }.height('100%')
  }
}