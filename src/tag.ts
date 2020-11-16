import { run, getTag } from './helpers'

export const tag = async () => {
  const tag = await getTag()
  await run(`git`, [`tag`, `-a`, `-m`, `Release ${tag}`, `v${tag}`])
}
