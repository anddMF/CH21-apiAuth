require('dotenv-safe').config();
const http = require('http')
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const repository = require('../jwt/repositories/user-repository')

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

app.post('/login', async (req, res, next) => {
    const user = req.body.email;
    const password = req.body.password;

    const data = await repository.getUser(user, password).then();

    if (data.length > 0) {
        const id = data[0].ID;
        const token = jwt.sign({ id }, process.env.SECRET, { expiresIn: 30000 });
        return res.json({ data: {
            avatar: data[0].AVATAR,
            email: data[0].EMAIL,
            id: data[0].ID,
            dtBirth: data[0].DT_BIRTH,
            idCompany: data[0].ID_COMPANY,
            name: data[0].NAME
        }, token: token });
    } else {
        return res.status(500).json({ message: 'Invalid login' })
    }
})

// Apenas para testes, porque posso destruir o token no localstorage do client
app.post('/logout', function (req, res) {
    res.json({ auth: false, token: null });
})

function validateJWT(req, res, next) {
    const token = req.headers['x-access-token'];

    if (!token)
        return res.status(401).json({ auth: false, message: 'Token was not provided' });

    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err)
            return res.status(500).json({ auth: false, message: 'Failed to authenticate token' });

        req.userId = decoded.id;
        next();
    })
}

const server = http.createServer(app);
server.listen(3030);
console.log('Servidor ligado na 3030')