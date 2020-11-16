import { getInput, info } from '@actions/core'
import { resolve } from 'path'
import { promises as fsp } from 'fs'
import { exec } from '@actions/exec'
import glob from 'glob'

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

export const findPath = (pattern: string): Promise<string[]> => {
  return new Promise((r, j) => {
    glob(pattern, (e, matches) => {
      if (e) j(e)
      else r(matches)
    })
  })
}

export const getPackageJson = async (workspace?: string) => {
  if (workspace) {
    const rootPackage = await getPackageJson()
    const workspaces = rootPackage.workspaces
    if (!Array.isArray(workspaces)) throw new Error(`workspace not found`)
    const paths: string[] = []
    await Promise.all(
      workspaces.map(async path =>
        paths.concat(await findPath(resolve(getRootPath(), path)))
      )
    )
    const packages: any[] = []
    await Promise.all(
      paths.map(async path => {
        packages.push(
          JSON.parse(
            await fsp.readFile(resolve(path, `package.json`), {
              encoding: 'utf8'
            })
          )
        )
      })
    )
    return packages.find(val => val.name === workspace)
  } else {
    info(`root: ${getRootPath()}`)
    return JSON.parse(
      await fsp.readFile(resolve(getRootPath(), `package.json`), {
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
