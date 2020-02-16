const fetch = require('node-fetch')

const REPO = process.env.REPO
const OWNER = process.env.OWNER
const AUTH = process.env.AUTH

async function getReleases() {
  let result = []

  try {
    const gquery = `{
      repository(name: "${REPO}", owner: "${OWNER}") {
        releases(last: 7) {
          edges {
            node {
              author {
                name
                login
                avatarUrl
              }
              name
              tagName
              createdAt
            }
          }
        }
      }
    }`

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: AUTH
      },
      body: JSON.stringify({
        query: gquery
      })
    })

    const json = await response.json()
    const edges = json.data.repository.releases.edges

    result = edges
      .map(({ node }) => {
        const user = node.author.name || node.author.login
        const avatarUrl = node.author.avatarUrl
        const release = node.name
          ? node.name
              .replace(node.tagName, '')
              .replace('|', '')
              .trim()
          : node.tagName
        const tag = node.tagName
        const date = new Intl.DateTimeFormat('en-GB').format(
          new Date(node.createdAt)
        )

        return {
          user,
          avatarUrl,
          release,
          tag,
          date
        }
      })
      .sort((a, b) => b.tag.localeCompare(a.tag))
  } catch (error) {
    console.error(error)
  }

  return result
}

module.exports = getReleases
