const {JWT} = require('google-auth-library');
const cache = {};
module.exports = ({clientId, accessToken}) => {
    if (!cache[clientId] || cache[clientId].accessToken !== accessToken) {
        const client = new JWT(
            clientId,
            null,
            accessToken,
            ['https://www.googleapis.com/auth/cloud-platform']
        );
        cache[clientId] = { client, accessToken };
    }
    return cache[clientId].client;
};
