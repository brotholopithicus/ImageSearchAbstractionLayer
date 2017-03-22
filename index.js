const https = require('https');
const http = require('http');
const fs = require('fs');
require('dotenv').config();
const PORT = process.env.PORT;

const bingRequest = require('./lib/bingRequest');

const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => console.log('connected to db'));

const Search = require('./models/search');

const sslOptions = {
    key: fs.readFileSync('./ssl/key.pem'),
    cert: fs.readFileSync('./ssl/cert.pem'),
    passphrase: process.env.SSL_PASSPHRASE
}

const server = process.env.PROTOCOL === 'http' ? http.Server(requestHandler) : https.Server(sslOptions, requestHandler);

async function requestHandler(req, res) {
    const url = require('url');
    const requestURL = url.parse(req.url);
    switch (requestURL.pathname) {
        case '/favicon.ico':
            res.writeHead(200, { 'Content-Type': 'image/x-icon' });
            const stream = fs.createReadStream('./favicon.ico');
            stream.pipe(res);
            break;
        case '/api/latest':
            Search.find({})
                .limit(10)
                .sort({ date: -1 })
                .exec((err, results) => {
                    if (err) return handleError(err);
                    const data = [];
                    for (let i = 0; i < results.length; i++) {
                        let resObj = results[i];
                        let tmpObj = {
                            query: resObj.query,
                            date: resObj.date
                        }
                        data.push(tmpObj);
                    }
                    res.write(JSON.stringify(data));
                    res.end();
                });
            break;
        case '/api/search':
            if (requestURL.query) {
                const querystring = require('querystring');
                const query = querystring.parse(requestURL.query);
                Search.findOne({ query: query.q }, (err, result) => {
                    if (err) return handleError(err);
                    if (!result) {
                        let newSearch = new Search({ query: query.q });
                        newSearch.save((err) => {
                            if (err) return handleError(err);
                            console.log('doc created: ', newSearch.query);
                        });
                    } else {
                        result.date = Date.now();
                        result.save((err) => {
                            if (err) return handleError(err);
                            console.log('doc updated: ', result.query);
                        });
                    }
                });
                const response = await bingRequest(query);
                res.write(response);
                res.end();
            } else {
                res.writeHead(302, { 'Location': '/' });
                res.end();
            }
            break;
        default:
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(`<ul><li><a href="/api/latest">/api/latest</a> - last ten searches.</li><li><a href="/api/search?q=monkey&offset=0">/api/search?q=monkey&offset=0</a> - search images: q is your query, offset is page number.</li></ul>`);
            res.end();
            break;

    }
}

function handleError(err) {
    // elegant and concise
    console.log(err);
}

server.listen(PORT, () => console.log(`Server Listening On Port: ${PORT}`));
