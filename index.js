const express = require('express')
const cors = require('cors')
const getReleases = require('./wood')
const getDeployments = require('./peck')

const port = process.env.PORT || 3000
const app = express()
app.use(cors())

app.post('/wood', async (req, res) => {
  const releases = await getReleases()
  res.json(releases)
})

app.post('/peck', async (req, res) => {
  const deployments = await getDeployments()
  res.json(deployments)
})

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`)
})
