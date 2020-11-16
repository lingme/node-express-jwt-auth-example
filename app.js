const express = require('express')
const jwt = require("jsonwebtoken")
const cookieParser = require('cookie-parser')
const app = express()

const TOKEN_SECRET = "Vr[9!$[pH-[KN6XrX.7bV(W@wPu3)uYQc"

let users = {
    john: "passwordjohn",
    mary: "passwordmary",
    jhin: "passwordjhin",
    jinx: "passwordjinx"
}

app.use(express.json());
app.use(cookieParser())
app.listen(3000)

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        console.log(user)
        req.user = user
        next()
    })
}

function generateAccessToken(username) {
    return jwt.sign(username, TOKEN_SECRET, {
        expiresIn: '1800s'
    });
}

app.post('/api/login', (req, res) => {
    if (users[req.body.username] === req.body.password) {
        const token = generateAccessToken({
            username: req.body.username
        });
        res.json(token);
    }
    res.sendStatus(403)
});

app.post('/api/hello', authenticateToken, function (req, res) {
    res.send('Hello World')
})