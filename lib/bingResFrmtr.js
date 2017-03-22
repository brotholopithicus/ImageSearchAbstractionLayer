function formatBingImageSearchData(json) {
    return new Promise((resolve, reject) => {
        const parsedResponse = JSON.parse(json);
        const data = [];
        for (let i = 0; i < parsedResponse.value.length; i++) {
            let resObj = parsedResponse.value[i];
            let tmpObj = {
                name: resObj.name,
                hostPageUrl: resObj.hostPageUrl,
                hostPageDisplayUrl: resObj.hostPageDisplayUrl,
                thumbnailUrl: resObj.thumbnailUrl,
                size: {
                    width: resObj.width,
                    height: resObj.height,
                    thumbnail: {
                        width: resObj.thumbnail.width,
                        height: resObj.thumbnail.height
                    }
                }
            };
            data.push(tmpObj);
        }
        if (!data.length) reject(new Error('No Data...'));
        return resolve(JSON.stringify(data));
    });
}

module.exports = formatBingImageSearchData;
