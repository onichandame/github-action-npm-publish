import { getYarnVersion, run, getPackageJson } from './helpers'

export const publish = async (pkg?: string) => {
  const yarnVer = await getYarnVersion()
  const config: Parameters<typeof run>[1] = []
  const packageJson = await getPackageJson(pkg)
  if (!packageJson) throw new Error(`failed to find workspace ${pkg}`)
  if (pkg) {
    config.push(...[`workspace`, pkg])
  }
  if (yarnVer.major !== `1`) config.push(`npm`)
  config.push(`publish`)
  if (yarnVer.major === `1`) config.push(`--non-interactive`)
  config.push(`--access`)
  if (packageJson.private) config.push(`restricted`)
  else config.push(`public`)
  return run(`yarn`, config)
}
