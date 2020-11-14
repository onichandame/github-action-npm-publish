import { info, setFailed } from '@actions/core'

import { getWorkspaces, getMode } from './helpers'
import { publish } from './publish'
;(async () => {
  try {
    const workspaces = getWorkspaces()
    info(`publishing packages ${workspaces?.join(`, `)}`)
    const failures: string[] = []
    if (workspaces) {
      await Promise.all(
        workspaces.map(val =>
          publish(val).then(code => {
            if (code !== 0)
              if (getMode() === 'all')
                throw new Error(`package ${val} failed publishing`)
              else if (getMode() === `at_least_one`) failures.push(val)
          })
        )
      )
      if (failures.length === workspaces.length)
        throw new Error(`all packages failed publishing`)
    } else {
      await publish()
    }
  } catch (e) {
    setFailed(e)
  }
})()
