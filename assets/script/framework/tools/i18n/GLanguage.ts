import LanguageZH from "./LanguageZH"
import LanguageEN from "./LanguageEN"
import GLD from '../../GLD'

const {ccclass, property, executeInEditMode, requireComponent} = cc._decorator;

const _Data = {
    TYPE: {
        CHINESE: 'chinese',
        ENGLISH: 'english',
    },
    TOOLTIP: {
        PREVIEW: '预览1次；预览完毕后置于false',
        KEY: '多语言对应的key',
    },
    DEFAULT_KEY: 'enter_a_key_and_set_preview_true',
}
Object.freeze(_Data)

/**
 * [framework-M] 多语言
 * - 【用法】修改LanguageZH.js中的内容，key-value格式，并将此组件挂载在对应的Label所在节点下，修改key
 */
@ccclass
@executeInEditMode
@requireComponent(cc.Label)
export default class Glanguage extends cc.Component {

  /** 类型 */
  static get TYPE() { return _Data.TYPE }

  @property(cc.Label)
  label: cc.Label = null;

  @property
  text: string = 'hello';

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}

  start () {

  }

  // update (dt) {}
}
