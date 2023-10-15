require('dotenv').config();
const uuid = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const port = process.env.PORT;
const fs = require('fs');
const request = require('request');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const SESSION_KEY = 'Authorization';

class Session {
    #sessions = {}

    constructor() {
        try {
            this.#sessions = fs.readFileSync(__dirname+'/sessions.json', 'utf8');
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

app.get('/', (req, res) => {
    if (req.session) {
        return res.json({
            username: req.session.login,
            logout: `http://localhost:${port}/logout`
        })
    }
    res.sendFile(path.join(__dirname+'/index.html'));
})

app.get('/logout', (req, res) => {
    sessions.destroy(req, res);
    res.redirect('/');
});

app.post('/api/login', (req, res) => {
    const { login, password } = req.body;

    const options = {
        method: 'POST',
        url: `https://${process.env.DOMAIN}/oauth/token`,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        form: {
            grant_type: 'password',
            username: login,
            password: password,
            scope: 'offline_access',
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            audience: `https://${process.env.DOMAIN}/api/v2/`
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

app.listen(port, async () => {
    const pkey = await fetch(`https://${process.env.DOMAIN}/pem`)
        .then(response => response.text());
    fs.writeFileSync(__dirname+'/key', pkey);

    console.log(`Example app listening on port ${port}`);
});
