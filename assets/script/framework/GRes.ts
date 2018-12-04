// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
/** 配置参数 */
const GP = {
  FAKE_PATH: '__fake_path__',
}
Object.freeze(GP)


@ccclass
export default class GRes extends cc.Component {

  static ins: GRes

  onLoad() {
    GRes.ins = this
  }

  array_fake: any[] = []

  /** 资源载入链 */
  async load_chain() {
    this.array_fake = await GRes.load_res_dir(GP.FAKE_PATH, cc.Prefab)
    console.log('this.array_fake.....', this.array_fake)
  }

  /**
   * 载入单个资源
   * - 输出log
   * @param path 
   * @param type 
   * @static
   * @async
  */
  static async load_res(path: string, type: typeof cc.Asset) {
    return await new Promise((resolve, reject) => {
      cc.loader.loadRes(path, type, (err, res) => {
        // 载入失败
        if (err) {
          cc.error(`[MRes] resource load fail,path=${path},type=${type},error=${err}`)
          reject()
          return
        }
        // 载入成功
        resolve(res)
      })
    })
  }

  /**
   * 载入dir资源
   * - 使用Promise进行封装
   * - 输出log
   * @param path 
   * @param type 
   * @static
   * @async
   */
  static async load_res_dir(path: string, type: typeof cc.Asset): Promise<any> {
    return await new Promise((resolve, reject) => {
      cc.loader.loadResDir(path, type, (err, res) => {
        // 载入失败
        if (err) {
          cc.error(`[MRes] resource load fail,path=${path},type=${type},error=${err}`)
          reject()
          return
        }
        // 载入成功
        cc.warn(`[MRes] resource load success,length=${res.length}`)
        if (res.length === 0) { cc.warn(`[MRes] resource length=0,please check again`) }
        // 写入数据
        resolve(res)
      })
    })
  }
}
