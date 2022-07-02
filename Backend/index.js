const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const proposta = require('./assets/proposta.json');
const plans = require('./assets/plans.json');
const prices = require('./assets/prices.json');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// busca dados
app.get('/', (req, res) => {
    return res.json(proposta)
})

app.get('/planos', (req, res) => {
    return res.json(plans)
})
app.get('/proposta', (req, res) => {
    return res.json(proposta)
})
app.get('/prices', (req, res) => {
    return res.json(prices)
})

// inseri dados
app.post('/add', (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).end()
    }

    proposta.push(body)

    fs.writeFile("./assets/proposta.json", JSON.stringify(proposta), err => {
        if (err) throw err;

        console.log('Escrito com sucesso');
    })

    return res.json(body)
})

app.listen(21262, () => {
    console.log(`Express started at http://localhost:21262`);
}) 