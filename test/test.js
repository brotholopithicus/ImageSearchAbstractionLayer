const requestify = require('./lib/requestify');
const bingResFrmtr = require('./lib/bingResFrmtr');

const options = { query: { q: 'funny cats', offset: '0', count: '10', mkt: 'en-US', safeSearch: 'off'}, headers: { 'Ocp-Apim-Subscription-Key': '466e854bdce84dd68d144130fdd85e5d' } };
const requestURL = 'https://api.cognitive.microsoft.com/bing/v5.0/images/search';
requestify(requestURL, options).then(bingResFrmtr).then(console.log).catch(console.log);
