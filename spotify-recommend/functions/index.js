/**
 * Firebase functions that perform spotify authentication
 */
const express = require('express'); // Express web server framework
const functions = require('firebase-functions');
const cors = require('cors');
const request = require('request');
const cookieParser = require('cookie-parser');
const querystring = require('querystring');
const util = require('./util');

// for local development, override these values
const server_url = 'https://find-vibes.firebaseapp.com';
const client_url = 'https://find-vibes.firebaseapp.com';

const redirect_uri = `${server_url}/spotifyCallback`;
const stateKey = "__session";
// to set firebase functions:config:set spotify.secret="YOUR_SECRET" spotify.client_id="YOUR_CLIENT_ID"
const secret = functions.config().spotify.secret;
const client_id = functions.config().spotify.client_id;

const app = express();
app.use(cors())
    .use(cookieParser());

app.get('/login', function(req, res) {
    const state = util.generateRandomString(16);

    // your application requests authorization
    const scope = 'user-read-private user-top-read user-read-playback-state playlist-modify-private';
    res.cookie(stateKey, state);
    res.setHeader('Cache-Control', 'no-store');
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            // set this with your client id using `firebase functions:config:set spotify.client_id="SPOTIFY_CLIENT_ID"`
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});

app.get("/spotifyCallback", (req, res) => {
    const code = req.query.code;
    const state = req.query.state;
    const storedState = req.cookies ? req.cookies[stateKey] : null;
    res.setHeader('Cache-Control', 'no-store');

    if (!code || !state || !storedState || storedState !== state) {
        res.status(400);
        res.send("Spotify authorization has failed")
    } else {
        res.cookie(stateKey, state, {
            expires: new Date(0)
        });
        const encodedAuthorizationValue = Buffer.from(`${client_id}:${secret}`).toString('base64');
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': `Basic ${encodedAuthorizationValue}`
            },
            json: true
        };

        request.post(authOptions, (error, authResponse, body) => {
            if (error || authResponse.statusCode !== 200) {
                res.status(400);
                res.redirect("Spotify authorization has failed");
            } else {
                const access_token = body.access_token;

                res.cookie('access_token', access_token, {
                    maxAge: 3600 * 1000,
                    sameSite: true
                });
                res.redirect(`${client_url}/options`)
            }
        });
    }
});

exports.widgets = functions.https.onRequest(app);