const express = require('express')
const jwt = require("jsonwebtoken")
const cors = require("cors")
var md5 = require('md5');
const cookieParser = require('cookie-parser')
const app = express()

const TOKEN_SECRET = "Vr[9!$[pH-[KN6XrX.7bV(W@wPu3)uYQc"

let users = {
    john: "password-john",
    mary: "password-mary",
    jhin: "password-jhin",
    jinx: "password-jinx"
}

let options = {
    maxAge: 1000 * 60 * 15,
    httpOnly: true,
    signed: true
}

app.use(express.json())
app.use(cookieParser(TOKEN_SECRET))
app.listen(3000)

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "*")
    next()
});

function authenticateMiddleware(req, res, next) {
    const authHeader = req.headers['authorization']
    if (authHeader == null) return res.status(401).end()
    jwt.verify(authHeader, TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).end()
        console.log(user)
        req.user = user
        next()
    })
}

function generateAccessToken(username) {
    return jwt.sign(username, TOKEN_SECRET, {
        expiresIn: 60 * 60
    });
}

app.post('/api/login', (req, res) => {
    if (req.body.username && users[req.body.username] !== undefined && md5(users[req.body.username]) === req.body.password) {
        const token = generateAccessToken({
            username: req.body.username
        });
        res.status(200).json({
            token: token
        });
    }
    res.status(403).end()
});

app.post('/api/protected', authenticateMiddleware, function (req, res) {
    res.status(200).json({
        result: 'Hi from Protected API'
    })
})

app.post('/api/public', function (req, res) {
    res.status(200).json({
        result: 'Hi from Public API'
    })
})