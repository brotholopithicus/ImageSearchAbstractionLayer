const requestify = require('./requestify');
const bingResFrmtr = require('./bingResFrmtr');
const configDefault = require('./configDefault');

function bingRequest(options) {
    let configOpts = configDefault(options);
    const requestURL = 'https://api.cognitive.microsoft.com/bing/v5.0/images/search';
    return requestify(requestURL, configOpts).then(bingResFrmtr).catch(console.log);
}

module.exports = bingRequest;
