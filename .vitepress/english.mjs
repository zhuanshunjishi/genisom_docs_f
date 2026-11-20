import { docsBase } from './docs-base.mjs'
import { docsNav } from './docs-nav.mjs'

export function englishConfig(chineseConfig, product, description, labels) {
  const { themeConfig } = chineseConfig

  function translateItem(item) {
    return {
      ...item,
      text: labels[item.text],
      ...(item.items && { items: item.items.map(translateItem) }),
    }
  }

  return {
    ...chineseConfig,
    lang: 'en',
    title: `Genisom ${product.toUpperCase()} SDK Documentation`,
    description,
    base: docsBase(`${product}-en`),
    themeConfig: {
      nav: docsNav(product, true),
      sidebar: themeConfig.sidebar.map(translateItem),
      search: { provider: 'local' },
    },
  }
}
