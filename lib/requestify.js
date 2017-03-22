function formatURL(str, options = {}) {
    if (options.query) str += `?${require('querystring').stringify(options.query)}`;
    return Object.assign({}, require('url').parse(str), options);
}

function requestify(str, options) {
    const config = formatURL(str, options);
    return new Promise((resolve, reject) => {
        const lib = config.protocol === 'https:' ? require('https') : require('http');
        const req = lib.request(config, (res) => {
            if (res.statusCode < 200 || res.statusCode > 299) return reject(new Error(`Request Error - Status Code: ${res.statusCode}`));
            const body = [];
            res.on('data', (chunk) => body.push(chunk));
            res.on('end', () => resolve(body.join('')));
        });
        req.on('error', (err) => reject(err));
        req.end();
    });
}

module.exports = requestify;
