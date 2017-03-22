function configDefault(options) {
    let defaultOptions = {
        query: {
            q: 'funny cats',
            offset: '0',
            count: '10',
            mkt: 'en-US',
            safeSearch: 'Moderate'
        },
        headers: {
            'Ocp-Apim-Subscription-Key': '466e854bdce84dd68d144130fdd85e5d'
        }
    };
    for (let opt in defaultOptions) {
        for (let i in options) {
            if (defaultOptions[opt].hasOwnProperty(i)) {
                defaultOptions[opt][i] = options[i];
            }
        }
    }
    return defaultOptions;
}

module.exports = configDefault;
