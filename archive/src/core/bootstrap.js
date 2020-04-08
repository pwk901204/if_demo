import store from '@/store'
import config from '@/defaultSettings'

export default function Initializer () {
  // console.log(`API_URL: ${process.env.VUE_APP_API_BASE_URL}`)
  // console.log(store.state.app)
  const navTheme = store.state.app.theme ? store.state.app.theme : config.navTheme
  const layout = store.state.app.layout ? store.state.app.layout : config.layout
  const fixedHeader = store.state.app.fixedHeader ? store.state.app.fixedHeader : config.fixedHeader
  const fixSiderbar = store.state.app.fixSiderbar ? store.state.app.fixSiderbar : config.fixSiderbar
  const contentWidth = store.state.app.contentWidth ? store.state.app.contentWidth : config.contentWidth
  const autoHideHeader = store.state.app.autoHideHeader ? store.state.app.autoHideHeader : config.autoHideHeader
  const colorWeak = store.state.app.weak ? store.state.app.weak : config.colorWeak
  const primaryColor = store.state.app.color ? store.state.app.color : config.primaryColor
  const multiTab = store.state.app.multiTab ? store.state.app.multiTab : config.multiTab

  store.commit('app/TOGGLE_THEME', navTheme)
  store.commit('app/TOGGLE_LAYOUT_MODE', layout)
  store.commit('app/TOGGLE_FIXED_HEADER', fixedHeader)
  store.commit('app/TOGGLE_FIXED_SIDERBAR', fixSiderbar)
  store.commit('app/TOGGLE_CONTENT_WIDTH', contentWidth)
  store.commit('app/TOGGLE_FIXED_HEADER_HIDDEN', autoHideHeader)
  store.commit('app/TOGGLE_WEAK', colorWeak)
  store.commit('app/TOGGLE_COLOR', primaryColor)
  store.commit('app/TOGGLE_MULTI_TAB', multiTab)
  // store.commit('app/SET_TOKEN', Vue.ls.get(ACCESS_TOKEN))
  // last step
}
