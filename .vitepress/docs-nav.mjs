const sdkVersions = { m1: '0.2.3', l2: '0.2.3' }

export function docsNav(product, english = false) {
  const nav = [
    { component: 'DocsVersion', props: { docsVersion: 'V0.1', sdkVersion: sdkVersions[product], english } },
    { text: english ? 'Docs Home' : '文档首页', link: '/' },
    { text: english ? 'Documentation Site Home' : '总文档站首页', link: english ? '/../en/' : '/../', target: '_self' },
  ]

  if (product !== 'l2') {
    nav.push({ text: english ? '中文' : 'English', link: `/../${english ? product : `${product}-en`}/`, target: '_self' })
  }

  nav.push({ text: 'GitHub', link: 'https://github.com/zsibot/genisom_docs' })
  return nav
}
