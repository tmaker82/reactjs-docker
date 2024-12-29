require('dotenv').config();

const pool = require('./config/db');
const logger = require('../logger');
const express = require('express');
const routes = require('./routes/index');
const redroutes = require('./routes/redmine_index');
const app = express();
const fs = require('fs')
const os = require('os')
const { body, validationResult } = require('express-validator');
const { createProxyMiddleware } = require('http-proxy-middleware');

app.use(express.json());
app.set("port", process.env.PORT || 5000);

app.post('/users',
    body('email').isEmail(),
    body('name').notEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    routes
);

app.use('/api', routes);
app.use('/redmine', redroutes);

app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

app.use((err, req, res, next) => {
    logger.error(err.message);
    res.status(500).send('Something broke!');
});

/*
app.get('/', (req, res) => {
    //res.send('Hi!');
    try {
        const fd = fs.openSync('test.txt', 'a+')
        console.error(fd)
    } catch (err) {
        console.error('Ошибка', err)
    }
    const content = 'Some content!'
    fs.appendFile('test.txt', content, (err) => {
        if (err) {
            console.error(err)
            return
        }
        //файл записан успешно
    })
    res.send('Hi! \n' + content);
});

app.get('/all', (req, res) => {
    //res.send('Hi!');
    try {
        const fd = fs.openSync('test.txt', 'a+')
        console.error(fd)
    } catch (err) {
        console.error('Ошибка', err)
    }
    const content = 'ALLLL!'
    fs.appendFile('test.txt', content, (err) => {
        if (err) {
            console.error(err)
            return
        }
        //файл записан успешно
    })
    res.send('Hi! \n' + content);
});


app.get('/info', (req, res) => {

    let currentDate = new Date();

    pool.query('SELECT name from newtable', (err, res) => {
        if(err) {
            console.error('Error connecting to the database', err.stack);
        } else {
            console.log('Connected to the database:', res.rows);
            console.log('pool', res.rows)
        }
    });

    console.log('pool', pool.query)

    const content = currentDate + ' | ' + os.release() + " | " + os.homedir() + " | " + os.hostname() + " | " + os.type() +
        " | " + os.loadavg() +  ' | ' + pool.host + '\n'

    app.use((req, res, next) => {
        logger.info(`${req.method} ${req.url}`);
        next();
    });

    app.use((err, req, res, next) => {
        logger.error(err.message);
        res.status(500).send('Something broke!');
    });

    res.send('INFO! \n' + content);
});
*/



app.listen(app.get("port"), () => {
    console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});