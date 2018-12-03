/**
 * [framework] 本地数据存储（LocalData）管理类
 * - 【注意】key不能重复
 * - 【注意】get函数的返回值，由于游戏引擎原因，均返回string，这里不做类型转换，实际使用过程中需要注意
 * - 【注意】当没有key的对应值时，会返回null
 */

export default class GLD {
	/** 封装设置item */
	static set_item(key: string, value) {
		cc.sys.localStorage.setItem(key, value)
	}

	/** 封装获取item */
	static get_item(key: string) {
		return cc.sys.localStorage.getItem(key)
	}

	/** 是否初始化 */
	static set is_init(value) { GLD.set_item("IsInit", value) }
	static get is_init() { return GLD.get_item("IsInit") }

	/** 音乐 */
	static set music(value) { GLD.set_item("Music", value) }
	static get music() { return GLD.get_item("Music") }

	/** 音效 */
	static set sound(value) { GLD.set_item("Sound", value) }
	static get sound() { return GLD.get_item("Sound") }

	/** 语言 */
	static set language(value) { GLD.set_item("Language", value) }
	static get language() { return GLD.get_item("Language") }

	//////////
	// 下面的内容需要添加每个游戏自身的本地存储；注意使用static方法
	//////////
}
