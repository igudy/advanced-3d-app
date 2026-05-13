/**
 * Stable portrait URLs from Wikimedia Commons. Resolves via Special:FilePath
 * (302 to upload.wikimedia.org) so hotlinks survive thumbnail path churn.
 */
export function commonsImage(fileTitleOnCommons: string): string {
  const title = fileTitleOnCommons.trim().replace(/\s+/g, '_')
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(title)}`
}
