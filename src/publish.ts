import { run, getPackage } from './helpers'

export const publish = async (workspace?: string) => {
  const config: Parameters<typeof run>[1] = []
  const packageJson = await getPackage(workspace)
  if (!packageJson) throw new Error(`failed to find workspace ${workspace}`)
  if (workspace) {
    config.concat([`workspace`, workspace])
  }
  config.push(`publish`)
  config.push(`--non-interactive`)
  if (packageJson.private) config.push(`--access restricted`)
  else config.push(`--access public`)
  return run(`yarn`, config)
}
