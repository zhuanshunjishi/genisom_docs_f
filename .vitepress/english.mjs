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
    title: `GenisomAI ${product.toUpperCase()} SDK Documentation`,
    description,
    base: `/genisom_docs/${product}-en/`,
    themeConfig: {
      nav: [
        { text: 'Home', link: '/../en/', target: '_self' },
        { text: '中文', link: `/../${product}/`, target: '_self' },
        ...themeConfig.nav
          .filter((item) => item.component || item.text === 'GitHub')
          .map((item) => item.component === 'M1DocsVersion'
            ? { ...item, props: { ...item.props, english: true } }
            : item),
      ],
      sidebar: themeConfig.sidebar.map(translateItem),
      search: { provider: 'local' },
    },
  }
}
