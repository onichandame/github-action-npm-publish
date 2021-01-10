import { getInput } from '@actions/core'
import { join } from 'path'
import { promises as fsp } from 'fs'
import { exec } from '@actions/exec'

const modes = <const>['all', 'at_least_one']
type Mode = typeof modes[number]
const isMode = (raw: any): raw is Mode => modes.includes(raw)

export const getMode = () => {
  const mode = getInput(`mode`)
  if (isMode(mode)) return mode
  else throw new Error(`mode ${mode} not valid.`)
}

export const getPackages = () => {
  const packages = getInput(`packages`)
    .split(` `)
    .filter(val => !!val)
  if (packages.length) return packages
  else return null
}

export const getRootPath = () => {
  const root = process.env.GITHUB_WORKSPACE
  if (!root) throw new Error(`workspace not found`)
  return root
}

export const run = (...args: Parameters<typeof exec>) => {
  if (!args[1]) args[1] = []
  if (!args[2]) args[2] = {}
  args[2].cwd = getRootPath()
  return exec(...args)
}

export const getPackagePaths = async (): Promise<string[]> => {
  const root = getRootPath()
  const rawLines: string[] = []
  if (
    (await exec(`yarn`, [`workspaces`, `info`], {
      cwd: root,
      listeners: { stdout: data => rawLines.push(data.toString()) }
    })) !== 0
  )
    return [root]
  rawLines.shift()
  rawLines.pop()
  const rawJson = JSON.parse(rawLines.join(``))
  const result: string[] = []
  Object.values(rawJson).forEach((wsp: any) =>
    result.push(join(root, wsp.location))
  )
  return result.filter(val => !!val)
}

export const getPackageJson = async (workspace?: string) => {
  if (workspace) {
    const pkgPaths = await getPackagePaths()
    console.log(`root: ${getRootPath()}`)
    console.log(`workspaces: ${pkgPaths}`)
    const packages: any[] = []
    await Promise.all(
      pkgPaths.map(async path => {
        packages.push(
          JSON.parse(
            await fsp.readFile(join(path, `package.json`), {
              encoding: 'utf8'
            })
          )
        )
      })
    )
    return packages.find(val => val.name === workspace)
  } else {
    return JSON.parse(
      await fsp.readFile(join(getRootPath(), `package.json`), {
        encoding: 'utf8'
      })
    )
  }
}

export const getTag = async () => {
  if (getPackages()) {
    const pkg = getInput(`tag_package`)
    if (!pkg)
      throw new Error(`must specify a package to track in tags in monorepo`)
    return (await getPackageJson(pkg)).version
  } else {
    return (await getPackageJson()).version
  }
}
