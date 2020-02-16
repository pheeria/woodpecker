const fetch = require('node-fetch')
const countries = require('./countries')

async function peck(domain) {
  let result = { tag: '', commit: '' }

  try {
    const response = await fetch(`${domain}/health/check`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/html'
      },
      mode: 'no-cors'
    })
    const deployment = await response.json()

    result = {
      tag: deployment.version.tag,
      commit: deployment.version.commit
    }
  } catch (error) {
    console.error(error)
  }

  return result
}

async function getDeployments() {
  return await Promise.all(
    countries.map(async d => {
      const version = await peck(d.b2c)

      return {
        ...d,
        b2c: {
          url: d.b2c,
          ...version
        }
      }
    })
  )
}

module.exports = getDeployments
