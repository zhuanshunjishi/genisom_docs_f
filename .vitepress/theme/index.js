import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import genisomaiLogo from '../../pages/assets/genisomai-logo.png'
import DocsVersion from './DocsVersion.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('DocsVersion', DocsVersion)
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-title-before': () => h('span', { class: 'docs-brand-logos' },
        h('img', { src: genisomaiLogo, alt: 'Genisom AI', width: 480, height: 136 }),
      ),
    })
  },
}
