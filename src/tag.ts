import { run, getTag } from './helpers'

export const tag = async () => {
  const tag = await getTag()
  // setup committer
  await run(`git`, [`config`, `user.email`, `npmpublish@npmpublish.io`])
  await run(`git`, [`config`, `user.name`, `npmpublish`])
  await run(`git`, [`tag`, `-a`, `-m`, `Release ${tag}`, `v${tag}`])
}
