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

  while (true) {
    for (let i = 0; i < 65536; i += speed) {
      try {
        const request = {
          "on": true,
          "sat": 254,
          "bri": 254,
          "hue": i
        }
        const requests = []
        lightids.forEach(id => requests.push(hue.put(`/lights/${id}/state`, request)))
        await Promise.all(requests)
      } catch (err) {
        console.log(`${err.code}: ${err.message}`)
      }
    }
  }
}

main()
