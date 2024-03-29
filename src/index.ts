import { info, setFailed } from '@actions/core'

import { getPackages, getMode, getPackageJson } from './helpers'
import { publish } from './publish'
import { tag } from 'tag'
;(async () => {
  try {
    const packages = getPackages()
    const failures: string[] = []
    if (packages) {
      info(`publishing packages ${packages.join(`, `)}`)
      await Promise.all(
        packages.map(val =>
          publish(val).then(output => {
            if (output.exitCode !== 0)
              if (getMode() === 'all')
                throw new Error(`package ${val} failed publishing`)
              else if (getMode() === `at_least_one`) failures.push(val)
          })
        )
      )
      if (failures.length === packages.length)
        throw new Error(`all packages failed publishing`)
    } else {
      info(`publishing package ${(await getPackageJson()).name}`)
      await publish()
    }
    await tag()
  } catch (e) {
    setFailed(e)
  }
})()
