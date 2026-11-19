export function docsBase(section) {
  const [owner, repository] = (process.env.GITHUB_REPOSITORY ?? '').split('/')
  const isUserSite = repository?.toLowerCase() === `${owner.toLowerCase()}.github.io`
  const siteBase = isUserSite ? '' : `/${repository || 'genisom_docs'}`
  return `${siteBase}/${section}/`
}
