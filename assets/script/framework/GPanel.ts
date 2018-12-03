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
 * - [注意] 虽然格式上是static函数，但是需要在场景中挂载激活，使用到了MPanel.ins
 * - [注意] 场景中仅有一个MPanel脚本生效，只挂载1次即可
 */
@ccclass
export default class GPanel extends cc.Component {
  static ins: GPanel

  onLoad() {
    GPanel.ins = this
  }

  @property({ tooltip: _Data.TOOLTIP.PARENT, type: cc.Node })
  parent: cc.Node = null

  /**
  * 链式打开多个panel
  * - 打开的panel无参数传入
  * - 默认interval为1s
  * @param array_panel_name 多个panel的name
  */
  static async chain(...array_panel_name: string[]) {
    for (let i = 0; i < array_panel_name.length; i += 1) {
      await GPanel.open(array_panel_name[i])
      await G.wait_time(1)
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