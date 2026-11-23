import { h } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import genisomaiLogo from '../../pages/assets/genisomai-logo.png'
import genisomaiLogoEn from '../../pages/assets/genisomai-logo-en.png'
import DocsVersion from './DocsVersion.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('DocsVersion', DocsVersion)
  },
  Layout() {
    const { lang } = useData()
    const logo = lang.value === 'en'
      ? { src: genisomaiLogoEn, width: 4530, height: 2481 }
      : { src: genisomaiLogo, width: 480, height: 136 }
    return h(DefaultTheme.Layout, null, {
      'nav-bar-title-before': () => h('span', { class: 'docs-brand-logos' },
        h('img', { ...logo, alt: 'Genisom AI' }),
      ),
    })
  },
}
