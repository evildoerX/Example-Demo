import GRes from './GRes'
import GGM from './GGM'

const { ccclass, property } = cc._decorator
enum MOVE_DIRECTION { LEFT, RIGHT, TOP, BOTTOM }
const _Data = {
    TOOLTIP: {
        PARENT: 'panel所挂载的父节点',
    },
    PATH: 'panel',
    TIME: 0.4,
    EASE_IN: cc.easeExponentialOut(),
    EASE_OUT: cc.easeExponentialOut(),
    MOVE_DIRECTION: MOVE_DIRECTION,
    /** 某些组件在scale=0时会出现一些错位等问题，因此将初始值设为0.001 */
    SCALE_0: 0.001,
    SCALE_1: 1,
}
Object.freeze(_Data)

/**
 * [framework-M] 游戏窗口管理
 * - 封装窗口打开的open\close接口，API为open\close\chain；open和close时会附带参数；open的异步结束不包括动画效果，close的异步结束包括动画效果
 * - 封装窗口中UI打开的in\out接口，API为in\out+type
 * - 窗口的打开直接调用active=true；窗口中UI组件的打开方式可以使用写定的方法；未来会独立成为脚本
 * - [注意] 未来可能需要调整并增加node.stopAllActions()
 * - [注意] 目前仅支持同种窗口单个单个显示
 * - [注意] 虽然格式上是static函数，但是需要在场景中挂载激活，使用到了GPanel.ins
 * - [注意] 场景中仅有一个GPanel脚本生效，只挂载1次即可
 */
@ccclass
export default class GPanel extends cc.Component {
  static ins: GPanel

  onLoad() {
    GPanel.ins = this
  }

  @property({ tooltip: _Data.TOOLTIP.PARENT, type: cc.Node })
  parent: cc.Node = null

  /** 当前的渲染层级 */
  private now_z_index: number = 0

  /** panel-实例节点存储 */
  private obj_node = {}

  /** panel-prefab存储 */
  private obj_prefab = {}

  /**
     * 打开panel
     * - [注意] open的异步结束不包括动画效果
     * @param panel_name
     * @param args
     * @static
     * @async
     */
    static async open(panel_name: string, ...args: any[]) {
      const z_index = GPanel.ins.now_z_index += 1
      const show_panel = (prefab: cc.Prefab) => {
          // 删除同名节点
          if (GPanel.ins.obj_node[panel_name]) {
              GPanel.ins.obj_node[panel_name].destroy()
          }
          // 创建新节点
          let node = cc.instantiate(prefab)
          node.setParent(GPanel.ins.parent)
          node.position = cc.Vec2.ZERO
          node.width = cc.winSize.width
          node.height = cc.winSize.height
          node.zIndex = z_index
          node.active = true
          // 如果节点有打开动画，则进行打开动画
          if (node.getComponent(panel_name) && node.getComponent(panel_name).open) {
              node.getComponent(panel_name).open(...args)
          }
          // 保存节点
          GPanel.ins.obj_node[panel_name] = node
      }
      // 优先从prefab存储中寻找
      if (GPanel.ins.obj_prefab[panel_name]) {
          return show_panel(GPanel.ins.obj_prefab[panel_name])
      }
      // 如果找不到则从resource中载入
      return await GRes.load_res(`${_Data.PATH}/${panel_name}`, cc.Prefab).then((v: cc.Prefab) => {
          // 保存prefab
          GPanel.ins.obj_prefab[v.name] = v
          show_panel(v)
      }).catch(() => {
          cc.error(`panel to open is not exist, panel_name= ${panel_name}`)
      })
  }

  /**
   * 关闭panel
   * - close的异步结束包括动画效果；因此具体panel的close()方法实现必须要是一个async函数
   * @param panel_name
   * @param args
   * @static
   * @async
   */
  static async close(panel_name: string, ...args: any[]) {
      // 获取节点
      let node: cc.Node = GPanel.ins.obj_node[panel_name]
      if (node === undefined) {
          cc.warn(`panel to close is not exist, panel_name= ${panel_name}`)
          return
      }
      // 执行节点关闭动画
      if (node.getComponent(panel_name) && node.getComponent(panel_name).close) {
          await node.getComponent(panel_name).close(...args)
      }
      // 删除节点存储
      node.destroy()
      delete GPanel.ins.obj_node[panel_name]
  }

  /**
  * 链式打开多个panel
  * - 打开的panel无参数传入
  * - 默认interval为1s
  * @param array_panel_name 多个panel的name
  */
  static async chain(...array_panel_name: string[]) {
    console.log('chain array_panel_name', array_panel_name)
    for (let i = 0; i < array_panel_name.length; i += 1) {
      await GPanel.open(array_panel_name[i])
      await GGM.wait_time(1)
    }
  }

  /** 
  * @param node
  * @param time
  * @param ease
  * @static
  * @async
  */
  static async out_fade(node: cc.Node, time: number = _Data.TIME, ease = _Data.EASE_OUT) {
    return await new Promise((resolve, reject) => {
      node.runAction(cc.sequence(
        cc.fadeOut(time).easing(ease),
        cc.callFunc(resolve),
      ))
    })
  }

}