import GRes from './GRes'
import GLD from './GLD'
import GLanguage from './tools/i18n/GLanguage'
import GPanel from './GPanel'
import GGM from './GGM'

const {ccclass, property} = cc._decorator

const _Data = {
  /** 伪帧数之内进度条读满 */
  FAKE_FRAME: 100,
  /** 进度条满之后的等待时间 */
  FAKE_DELAY: 0.5,
  /** loading界面渐隐时间 */
  LAODING_FADE_TIME: 1,
  /** 屏幕比例（竖屏） */
  SCREEN_RATIO: 1136 / 640,
}
Object.freeze(_Data)

@ccclass
export default class NewClass extends cc.Component {

  onLoad () {
    this.adjust_screen()
  }

  async start () {
    await GRes.ins.load_chain()
    console.log('载入连成功')
    GLD.is_init = false
    this.inin_local_data()
    this.init_test_local_data()
    this.flag_loading += 1
    // 载入进度条
    this.pb.progress = 0
    GGM.run_by_each_frame(()=>{
      this.pb.progress +=1 / _Data.FAKE_FRAME
      console.log('this.pb.progress', this.pb.progress)
      if (this.pb.progress >= 1) { this.flag_loading += 1 }
    },this,_Data.FAKE_FRAME)
  }

  /** 
  * 载入完毕计数
  * - 目前有进度条bar的读条完毕和数据data的载入完毕，执行回调在setter函数中
  */
  private _flag_loading = 0
  get flag_loading () {
    return this._flag_loading
  }
  set flag_loading(v) {
    this._flag_loading = v
    if (v === 2) { 
      this.panel_loading_close() 
    }
  }

  /** 游戏主Canvas */
  @property(cc.Canvas)
  canvas: cc.Canvas = null

  /** 游戏Loading界面 */
  @property(cc.Node)
  panel_loading: cc.Node = null

  /** 游戏Loading界面进度条 */
  @property(cc.ProgressBar)
  pb: cc.ProgressBar = null

  /**
  * loading界面关闭动画、关闭逻辑
  * - 定制渐隐效果
  * - 打开游戏主界面
  */
  panel_loading_close() {
    this.scheduleOnce(
      () => {
        GPanel.out_fade(this.panel_loading, _Data.LAODING_FADE_TIME, cc.easeCircleActionInOut()).then(
          () => {
            this.panel_loading.active = false
            GPanel.chain('PanelTest', 'PanelTest')
          }
        )
      },_Data.FAKE_DELAY
    )
  }
  /** 初始化本地数据 */
  inin_local_data() {
    // 输出log
    if (GLD.is_init === 'true') {
      cc.warn('get user\'s local data')
      return
    } else {
      cc.warn('unget user\'s local data, init now...')
    }

    //////////
    // 这里是各个项目的本地数据初始化过程
    //////////

    GLD.music = true
    GLD.sound = true
    GLD.language = GLanguage.TYPE.ENGLISH

    // 初始化完毕之后，置is_init为true
    GLD.is_init = true
  }

  /** 初始化测试环境的本地数据 */
  init_test_local_data() {
    //////////
    // 这里是各个项目在测试环境中的本地数据初始化过程
    //////////
  }

  /**
   * 调整屏幕适配
   * @param canvas 
   * @param design_screen_radio 屏幕设计大小；目前从C中获取，未来也可以从canvas中获取
   * @param now_screen_radio 
   */
  adjust_screen(
    canvas: cc.Canvas = this.canvas,
    design_screen_radio: number = _Data.SCREEN_RATIO,
    now_screen_radio: number = cc.winSize.height / cc.winSize.width
    )
  {
    canvas.fitHeight = !(now_screen_radio > design_screen_radio)
    canvas.fitWidth = now_screen_radio > design_screen_radio
    canvas.alignWithScreen() //!! 本方法不在代码提示中，也不在文档中，但是就是不能删除，只能说一句666；我都忘记自己为啥要写这一串代码。。。
  }
}
