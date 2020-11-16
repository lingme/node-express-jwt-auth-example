const express = require('express')
const jwt = require("jsonwebtoken")
const cookieParser = require('cookie-parser')
const app = express()

const TOKEN_SECRET = "Vr[9!$[pH-[KN6XrX.7bV(W@wPu3)uYQc"

let users = {
    john: "password-john",
    mary: "password-mary",
    jhin: "password-jhin",
    jinx: "password-jinx"
}

app.use(express.json());
app.use(cookieParser())
app.listen(3000)

function authenticateMiddleware(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).end()
    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).end()
        console.log(user)
        req.user = user
        next()
    })
}

function generateAccessToken(username) {
    return jwt.sign(username, TOKEN_SECRET, {
        expiresIn: 60
    });
}

app.post('/api/login', (req, res) => {
    if (users[req.body.username] === req.body.password) {
        const token = generateAccessToken({
            username: req.body.username
        });
        res.status(200).json({
            token: token
        });
    }
    res.status(403).end()
});

app.post('/api/hello', authenticateMiddleware, function (req, res) {
    res.status(200).json({
        result: 'Hello World'
    })
})