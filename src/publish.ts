import { run, getPackageJson } from './helpers'

export const publish = async (pkg?: string) => {
  const config: Parameters<typeof run>[1] = []
  const packageJson = await getPackageJson(pkg)
  if (!packageJson) throw new Error(`failed to find workspace ${pkg}`)
  if (pkg) {
    config.concat([`workspace`, pkg])
  }
  config.push(`publish`)
  config.push(`--non-interactive`)
  if (packageJson.private) config.push(`--access restricted`)
  else config.push(`--access public`)
  console.log(`config: ${config}`)
  return run(`yarn`, config)
}
