import https from 'https'

export async function getCurrentWeather(lat, lon) {

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}`

  const request = new Promise((resolve, reject) => {
    const req = https.get(url, (response) => {
      response.setEncoding('utf8')

      let responseBody = ''

      response.on('data', (chunk) => {
          responseBody += chunk
      })

      response.on('end', () => {
        resolve(JSON.parse(responseBody))
      });
    })

    req.on('error', (err) => {
      reject(err)
    })
    
    req.end()
  })

  return await request
}