const axios = require('axios');

module.exports.fetchTagDescription = async(tagname) => {
    const api_url = `https://api.stackexchange.com/2.2/tags/${tagname}/wikis?site=stackoverflow`;

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        json: true,
    };

    return await axios
        .get(api_url, options)
        .then((response) => response.data.items[0].excerpt)
        .catch((err) => {
            return '';
        });
};