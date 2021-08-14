require('dotenv-safe').config();
const http = require('http')
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res, next) => {
    res.json({ message: "Ok!" });
})

app.get('/clientes', validateJWT, (req, res, next) => {
    res.json([{ id: 1, name: 'Andrew' }])
})

app.post('/login', (req, res, next) => {
    const user = req.body.user;
    const password = req.body.password;
    console.log("user: "+ req.body.user+"; senha: "+ req.body.password)
    if (req.body.user === 'andrew' && req.body.password === '1234') {
        const id = 1;
        const token = jwt.sign({ id }, process.env.SECRET, { expiresIn: 3000 });
        return res.json({ auth: true, token: token });
    }

    return res.status(500).json({ message: 'Login inválido!' })
})

// Apenas para testes, porque posso destruir o token no localstorage do client
app.post('/logout', function (req, res) {
    res.json({ auth: false, token: null });
})

function validateJWT(req, res, next) {
    const token = req.headers['x-access-token'];
    console.log('TOKEN: ', token)

    if (!token)
        return res.status(401).json({ auth: false, message: 'Token was not provided' });

    jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if(err)
            return res.status(500).json({auth: false, message: 'Failed to authenticate token'});
        
        req.userId = decoded.id;
        next();
    })
}

const server = http.createServer(app);
server.listen(3030);
console.log('Servidor ligado na 3030')