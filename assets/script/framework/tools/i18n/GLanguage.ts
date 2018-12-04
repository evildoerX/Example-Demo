import LanguageZH from "./LanguageZH"
import LanguageEN from "./LanguageEN"
import GLD from '../../GLD'

const { ccclass, property, executeInEditMode, requireComponent } = cc._decorator;

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
export default class GLanguage extends cc.Component {

  /** 类型 */
  static get TYPE() { return _Data.TYPE }

  /** 获取key对应的value */
  static get_text(key: string, language_type: string = GLD.language): string {
    let value: string
    switch (language_type) {
      case _Data.TYPE.CHINESE:
        value = LanguageZH[key]
        break;
      case _Data.TYPE.ENGLISH:
        value = LanguageEN[key]
        break;
      default:
        // 默认为英文
        value = LanguageEN[key]
        break;
    }
    if (value === undefined) { cc.warn('[注意] 获取了一个不存在的本地字符串，key=', key) }
    return value
  }

  /** 预览（点击后刷新编辑器） */
  @property({ tooltip: _Data.TOOLTIP.PREVIEW })
  preview: boolean = false

  /** 
   * key
   * - notify: () => { }, // 会报错：not yet support notify attribute for ES6 Classes
   */
  @property({ tooltip: _Data.TOOLTIP.KEY, multiline: true })
  key: string = _Data.DEFAULT_KEY

  onLoad() {
    this.update_label()
  }

  start() {

  }

  update(dt) {
    if (this.preview) {
      this.preview = false
      this.update_label()
    }
  }

  /**
     * 更新label
     * - 目前仅支持cc.Label组件
     * @param label node中的cc.Label组件
     */
    update_label(key: string = this.key, label: cc.Label = this.node.getComponent(cc.Label)) {
      let value = GLanguage.get_text(key)
      label.string = value === undefined ? key : value
  }
}
