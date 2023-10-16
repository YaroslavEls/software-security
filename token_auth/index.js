require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const request = require('request');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT;
const DOMAIN = process.env.DOMAIN;

const SESSION_KEY = 'Authorization';

const SSO_LOGIN = `https://${DOMAIN}/authorize?` +
    `client_id=${process.env.CLIENT_ID}&` +
    `redirect_uri=http%3A%2F%2Flocalhost%3A${PORT}&` +
    `response_type=code&response_mode=query&` +
    `audience=https%3A%2F%2F${process.env.DOMAIN}%2Fapi%2Fv2%2F`;
    
const SSO_LOGOUT = `https://${DOMAIN}/v2/logout?` +
    `client_id=${process.env.CLIENT_ID}&` +
    `returnTo=http%3A%2F%2Flocalhost%3A${PORT}&`;

class Session {
    #sessions = {}

    constructor() {
        try {
            this.#sessions = fs.readFileSync(
                __dirname+'/sessions.json', 
                'utf8'
            );
            this.#sessions = JSON.parse(this.#sessions.trim());

            console.log(this.#sessions);
        } catch(e) {
            this.#sessions = {};
        }
    }

    #storeSessions() {
        fs.writeFileSync(
            __dirname+'/sessions.json', 
            JSON.stringify(this.#sessions), 
            'utf-8'
        );
    }

    set(key, value) {
        if (!value) {
            value = {};
        }
        this.#sessions[key] = value;
        this.#storeSessions();
    }

    get(key) {
        return this.#sessions[key];
    }

    destroy(req, res) {
        const sessionId = req.sessionId;
        delete this.#sessions[sessionId];
        this.#storeSessions();
    }
}

const sessions = new Session();

app.use((req, res, next) => {
    let token = req.get(SESSION_KEY);

    if (token) {
        const pkey = fs.readFileSync(__dirname+'/key', 'utf8');
        try {
            const decoded = jwt.verify(token, pkey);
            console.log({ decoded });
        } catch (err) {
            console.error(err);
            return res.status(401).end();
        }

        if (!sessions.get(token)) {
            sessions.set(token)
        }
        req.session = sessions.get(token);
        req.sessionId = token;
    }

    next();
});

app.get('/', async (req, res) => {
    const code = req.query.code;
    const res_obj = {
        logout: SSO_LOGOUT
    }

    if (!code) {
        res.redirect(SSO_LOGIN);
    } else {
        const form = new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code: code,
            redirect_uri: `http://localhost:${PORT}`,
            audience: `https://${DOMAIN}/api/v2/`
        });
        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            body: form.toString()
        };

        await fetch(`https://${DOMAIN}/oauth/token`, options)
            .then(response => response.json())
            .then(data => {
                if (!data.access_token) {
                    throw new Error('request failed')
                }
                sessions.set(data.access_token);
                res_obj.token = data.access_token;
            })
            .catch(error => {
                console.error(error);
                res_obj.message = error.toString();
            });

        return res.json(res_obj);
    }
});

app.get('/logout', (req, res) => {
    sessions.destroy(req, res);
    res.redirect('/');
});

app.post('/api/login', (req, res) => {
    const { login, password } = req.body;

    const options = {
        method: 'POST',
        url: `https://${DOMAIN}/oauth/token`,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        form: {
            grant_type: 'password',
            username: login,
            password: password,
            scope: 'offline_access',
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            audience: `https://${DOMAIN}/api/v2/`
        }
    };
    
    request(options, function(error, response, body) {
        if (error) throw new Error(error);

        const data = JSON.parse(body);
        if (response.statusCode == 200) {
            sessions.set(data.access_token, {login});
            req.session = sessions.get(data.access_token);
            res.json({ token: data.access_token });
        } 
    
        res.status(401).send();
    });
});

app.listen(PORT, async () => {
    const pkey = await fetch(`https://${DOMAIN}/pem`)
        .then(response => response.text());
    fs.writeFileSync(__dirname+'/key', pkey);

    console.log(`Example app listening on port ${PORT}`);
});
