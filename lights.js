const {baseuri, lightids, speed, getUsername} = require('./setup')
const axios = require('axios').default

const main = async () => {
  let username
  try {
    username = process.env.HUE_USERNAME || await getUsername()
  } catch (err) {
    console.error(err.message)
    return 1
  }

  const hue = axios.create({
    baseURL: `http://${baseuri}/api/${username}`,
    timeout: 1000,
    rejectUnauthorized: false
  })

  try {
    const { data } = await hue.get(`/lights`)
    const ids = Object.keys(data)
    ids.forEach(id => console.log(`${id}: ${data[id].name} (${data[id].state.on ? 'ON' : 'OFF'})`))
  } catch (err) {
    console.error(err.message)
  }

}

main()
