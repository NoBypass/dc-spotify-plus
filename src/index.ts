import express from 'express'
import * as querystring from 'querystring'

const app = express()

const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

app.get('/login', function (req, res) {
  const scope = 'user-read-private user-read-email'

  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: clientId,
        scope: scope,
        redirect_uri: 'http://localhost:3000/callback',
      }),
  )
})

app.get('/callback', function (req, res) {
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: req.query.code,
      redirect_uri: 'https://github.com/NoBypass/dc-spotify-plus',
      grant_type: 'authorization_code',
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        clientId + ':' + clientSecret,
      ).toString('base64')}`,
    },
    json: true,
  }

  fetch(authOptions.url, {
    method: 'POST',
    headers: authOptions.headers,
    body: JSON.stringify(authOptions.form),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
})

app.listen(3000, () => console.log('Server ready'))
