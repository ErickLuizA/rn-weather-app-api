import http from 'http'
import { URL } from 'url'

import { addToken, deleteToken } from './firebase.js'

const hostname = '10.0.0.106'
const port = 3333

const baseUrl = 'http://10.0.0.106:3333'

const server = http.createServer(async (request, response) => {

  const requestUrl = new URL(baseUrl + request.url)

  if(requestUrl.pathname === '/token') {

    try {
      if(request.method === 'POST') {
        let data

        request.on('data', chunk => {
          data = JSON.parse(chunk)
        })

        request.on('end', async () => {
          await addToken(data.token, data.lat, data.lon)
  
          response.statusCode = 201
        })
      }
  
      if(request.method === 'DELETE') {
        const token = requestUrl.searchParams.get('token')

        await deleteToken(token)

        response.statusCode = 204
      }

      response.setHeader('Content-Type', 'application/json')
  
      response.end()

    } catch (error) {
      response.statusCode = 500

      response.setHeader('Content-Type', 'application/json')
  
      const jsonResponse = JSON.stringify({
        "error": error.message
      })
  
      response.end(jsonResponse)
    }
    
  } else {
    response.statusCode = 404

    response.setHeader('Content-Type', 'application/json')

    const jsonResponse = JSON.stringify({
      "error": "Resource not found"
    })

    response.end(jsonResponse)
  }
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})