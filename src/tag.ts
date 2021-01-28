import { run, getTag, getEventFile } from './helpers'

export const tag = async () => {
  const tag = await getTag()
  const eventObj = await getEventFile()
  const { name, email } = eventObj.repository.owner
  // setup committer
  await run(`git`, [`config`, `user.email`, email])
  await run(`git`, [`config`, `user.name`, name])
  await run(`git`, [`tag`, `-a`, `-m`, `'Release ${tag}'`, `v${tag}`])
}
